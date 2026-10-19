import dns from 'node:dns/promises';
import net from 'node:net';

/**
 * Guards for fetching a URL a caller supplied. Without this, the server can be made to request internal
 * addresses (cloud metadata, other services on the same network) and return what it finds.
 */

const BLOCKED_NAMES = ['localhost', 'metadata.google.internal', 'metadata'];
const BLOCKED_SUFFIXES = ['.localhost', '.local', '.internal', '.lan', '.home', '.corp'];
const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);

function ipv4Private(ip: string): boolean {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p as [number, number, number, number];
  return (
    a === 0 || // "this" network
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, includes cloud metadata 169.254.169.254
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) || // 192.0.0.0/24 and documentation 192.0.2.0/24
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    a >= 224 // multicast and reserved
  );
}

/** Expands any IPv6 text form (including "::" and a dotted IPv4 tail) to 8 numeric groups, or null. */
function expandIPv6(ip: string): number[] | null {
  let text = ip.toLowerCase();
  const zone = text.indexOf('%');
  if (zone >= 0) text = text.slice(0, zone);
  const tail = text.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (tail) {
    const v4 = (tail[1] as string).split('.').map(Number);
    if (v4.length !== 4 || v4.some((n) => !Number.isInteger(n) || n > 255)) return null;
    text = text.slice(0, -(tail[1] as string).length) + (((v4[0] as number) << 8) | (v4[1] as number)).toString(16) + ':' + (((v4[2] as number) << 8) | (v4[3] as number)).toString(16);
  }
  const halves = text.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? (halves[0] as string).split(':') : [];
  const rest = halves.length === 2 && halves[1] ? (halves[1] as string).split(':') : [];
  const missing = 8 - head.length - rest.length;
  if ((halves.length === 1 && missing !== 0) || missing < 0) return null;
  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...rest].map((g) => parseInt(g, 16));
  return groups.length === 8 && groups.every((g) => Number.isInteger(g) && g >= 0 && g <= 0xffff) ? groups : null;
}

function ipv6Private(ip: string): boolean {
  const g = expandIPv6(ip);
  if (!g) return true;
  const [g0, g1, g2, g3, g4, g5, g6, g7] = g as [number, number, number, number, number, number, number, number];
  const embeddedV4 = `${g6 >> 8}.${g6 & 255}.${g7 >> 8}.${g7 & 255}`;
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0xffff) return ipv4Private(embeddedV4); // IPv4-mapped
  if (g0 === 0x64 && g1 === 0xff9b && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0) return ipv4Private(embeddedV4); // NAT64
  if (g.every((x) => x === 0)) return true; // ::
  if (g0 === 0 && g1 === 0 && g2 === 0 && g3 === 0 && g4 === 0 && g5 === 0 && g6 === 0 && g7 === 1) return true; // ::1
  if ((g0 & 0xfe00) === 0xfc00) return true; // unique local fc00::/7
  if ((g0 & 0xffc0) === 0xfe80) return true; // link-local fe80::/10
  if ((g0 & 0xff00) === 0xff00) return true; // multicast
  if (g0 === 0x2001 && g1 === 0x0db8) return true; // documentation
  return false;
}

/** True if the address is loopback, private, link-local, reserved or otherwise not a public internet address. */
export function isPrivateAddress(ip: string): boolean {
  const bare = ip.replace(/^\[|\]$/g, '');
  if (net.isIPv4(bare)) return ipv4Private(bare);
  if (net.isIPv6(bare)) return ipv6Private(bare);
  return true; // not an IP at all: treat as unsafe
}

/** Parses and vets a URL. Rejects non-web schemes, embedded credentials, odd ports, internal names and private addresses. */
export async function assertPublicHttpUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error('That is not a valid URL.');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Only http and https addresses can be inspected.');
  if (url.username || url.password) throw new Error('Addresses with a username or password are not allowed.');
  if (!ALLOWED_PORTS.has(url.port)) throw new Error('That port is not allowed (use 80, 443, 8080 or 8443).');

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (!host) throw new Error('The address has no host.');
  if (BLOCKED_NAMES.includes(host) || BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) {
    throw new Error('Internal or local host names are not allowed.');
  }
  if (net.isIP(host)) {
    if (isPrivateAddress(host)) throw new Error('Private, loopback and link-local addresses are not allowed.');
    return url;
  }
  let addresses: { address: string }[];
  try {
    addresses = await dns.lookup(host, { all: true });
  } catch {
    throw new Error('That host name could not be resolved.');
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new Error('That host name points to a private or internal address.');
  }
  return url;
}

export interface PublicFetchResult {
  status: number;
  headers: Headers;
  text: string;
  finalUrl: string;
}

/**
 * Fetches a public web page. Every redirect is vetted again, the body is capped, and time is limited.
 * Note: the name is resolved once to check it and again by fetch; a hostile DNS server could in theory
 * answer differently the second time. Run this server without access to internal networks as well.
 */
export async function fetchPublic(
  raw: string,
  options: { timeoutMs?: number; maxBytes?: number; maxRedirects?: number; userAgent?: string } = {}
): Promise<PublicFetchResult> {
  const { timeoutMs = 4500, maxBytes = 200_000, maxRedirects = 3, userAgent = 'REA-MCP-Inspector/1.0' } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let current = (await assertPublicHttpUrl(raw)).toString();
    for (let hop = 0; hop <= maxRedirects; hop++) {
      const res = await fetch(current, { signal: controller.signal, redirect: 'manual', headers: { 'User-Agent': userAgent } });
      if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        current = (await assertPublicHttpUrl(new URL(res.headers.get('location') as string, current).toString())).toString();
        await res.body?.cancel();
        continue;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      if (res.body) {
        const reader = res.body.getReader();
        while (size < maxBytes) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(Buffer.from(value));
          size += value.byteLength;
        }
        await reader.cancel().catch(() => undefined);
      }
      return { status: res.status, headers: res.headers, text: Buffer.concat(chunks).subarray(0, maxBytes).toString('utf8'), finalUrl: current };
    }
    throw new Error('Too many redirects.');
  } finally {
    clearTimeout(timer);
  }
}
