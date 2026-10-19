import assert from 'node:assert/strict';
import test from 'node:test';
import { assertPublicHttpUrl, isPrivateAddress } from './netguard.ts';

test('private, loopback, link-local and reserved IPv4 addresses are refused', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '224.0.0.1', '255.255.255.255', '198.18.0.1']) {
    assert.equal(isPrivateAddress(ip), true, ip);
  }
});

test('ordinary public IPv4 addresses are allowed', () => {
  for (const ip of ['93.184.216.34', '8.8.8.8', '172.15.0.1', '172.32.0.1', '100.63.0.1', '1.1.1.1']) {
    assert.equal(isPrivateAddress(ip), false, ip);
  }
});

test('IPv6 loopback, unique-local, link-local, multicast and mapped private addresses are refused', () => {
  for (const ip of ['::1', '::', 'fc00::1', 'fd12:3456::1', 'fe80::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:7f00:1', '::ffff:10.0.0.1', '64:ff9b::a00:1', '2001:db8::1', '[::1]']) {
    assert.equal(isPrivateAddress(ip), true, ip);
  }
});

test('a public IPv6 address is allowed, including a mapped public IPv4', () => {
  assert.equal(isPrivateAddress('2606:4700:4700::1111'), false);
  assert.equal(isPrivateAddress('::ffff:8.8.8.8'), false);
});

test('anything that is not an IP address is treated as unsafe', () => {
  assert.equal(isPrivateAddress('example.com'), true);
  assert.equal(isPrivateAddress(''), true);
});

test('URLs that point inside are rejected before any request is made', async () => {
  for (const url of [
    'http://127.0.0.1/',
    'http://localhost:3000/api',
    'http://[::1]/',
    'http://10.0.0.5/',
    'http://169.254.169.254/latest/meta-data/',
    'http://metadata.google.internal/computeMetadata/v1/',
    'http://2130706433/', // 127.0.0.1 written as one number
    'http://0x7f.0.0.1/', // hex form
    'http://printer.local/',
    'http://service.internal/',
    'http://[::ffff:127.0.0.1]/'
  ]) {
    await assert.rejects(() => assertPublicHttpUrl(url), (e: unknown) => e instanceof Error, url);
  }
});

test('other schemes, embedded credentials and odd ports are rejected', async () => {
  await assert.rejects(() => assertPublicHttpUrl('file:///etc/passwd'));
  await assert.rejects(() => assertPublicHttpUrl('ftp://93.184.216.34/'));
  await assert.rejects(() => assertPublicHttpUrl('http://user:pass@93.184.216.34/'));
  await assert.rejects(() => assertPublicHttpUrl('http://93.184.216.34:22/'));
  await assert.rejects(() => assertPublicHttpUrl('not a url'));
});

test('a public IP-literal URL on a normal port is accepted without any lookup', async () => {
  const url = await assertPublicHttpUrl('https://93.184.216.34/page?x=1');
  assert.equal(url.hostname, '93.184.216.34');
  const alt = await assertPublicHttpUrl('http://93.184.216.34:8080/');
  assert.equal(alt.port, '8080');
});
