# Symvibe + REA — Spatial Workspace & Adapter Module for Veloce `AgenticOS`

Symvibe + REA is architected as a **Standalone-Capable Spatial Workspace & Adapter Module for Veloce `AgenticOS` (`local-AgenticOS`)**. It runs independently today—so development is never blocked while Veloce `AgenticOS` completes its core milestones—and mounts into `AgenticOS` via a strict **Reuse / Extend / Build Adapter Contract** that connects to existing `AgenticOS` primitives rather than duplicating them.

It combines **Symvibe's** infinite multi-agent board with **REA's** reverse-engineering MCP engine and incorporates the strongest patterns from your repository ecosystem (**`AgentOS`**, **`ResearchOS-Web`**, **`AI Website Cloner`**, **`OpenDesign`**, **`Graphify`**, **`Paperclip`**, **`ChatDev 2.0`**, **`OpenGoat`**, **`Claude Swarm`**, and **`Repomix`**), powered by **Gemini 4 Argon (`gemini-4-argon`)** for deep reasoning/tool calling and **Gemini 3.8 TTS (`gemini-3.8-flash-lite-tts`)** for voice output.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Veloce `AgenticOS` Reuse / Extend / Build Matrix (Aligned with Codex Survey)**
> Rather than rebuilding what `local-AgenticOS` already does, the architecture enforces a 3-tier adapter boundary with explicit runtime availability badges (`CONNECTED`, `PARTIAL / FALLBACK`, `STANDALONE`):
> 1. **REUSE (Connect via `AgenticOS` Adapter, Do Not Rebuild)**: Connects directly to `local-AgenticOS` for **Memory**, **Tasks**, **Agent Sessions**, and **Multi-Model Routing (`Claude-code-multi-model`)**. When running standalone before `AgenticOS` is mounted, a lightweight local contract store emulates the exact `AgenticOS` schema so state migrates 1:1.
> 2. **EXTEND (Harden `AgentOS` Tool & MCP Gateway Layer)**: Wraps your **`AgentOS`** tool discovery, auth, execution proxy, and MCP gateway while closing the three unfinished gaps identified in `AgentOS` (**persistent storage**, **token refresh**, and **rate-limit enforcement**) and exposing live capability availability states.
> 3. **BUILD (New Spatial & Reverse-Engineering Capabilities)**: Focuses exclusively on the missing layer: the **Infinite Canvas**, **REA MCP Inspector with Provenance**, **Evidence Piping**, **4-Stage Reconstruction & Visual QA Preview Studio**, **Repomix Context Packer**, and **Voice/Graph Orchestration**.

- **Confirmed Decision 1 — Hybrid Gemini Model Architecture (`gemini-4-argon` + `gemini-3.8-flash-lite-tts`)**:
  - Uses **`gemini-4-argon`** for multi-agent planning, REA reverse-engineering synthesis, component spec extraction, and MCP tool calling (with `paid_model_flow` key selection support and seamless fallback to `gemini-3.8-flash`).
  - Uses **`gemini-3.8-flash-lite-tts`** for spoken Voice Planner responses and **`gemini-3.5-transcribe`** for audio transcription, addressing the fact that `gemini-4-argon` is a reasoning/tool model without direct audio output.
- **Confirmed Decision 2 — Ecosystem Pattern Synthesis**:
  - **`ResearchOS-Web` + `Graphify`**: Every REA finding carries **SHA-256 artifact hash verification**, byte/line provenance, and explicit **`EXTRACTED` vs `INFERRED`** evidence classification inside an interactive dependency graph.
  - **`AI Website Cloner` + `OpenDesign`**: Implements the 4-stage reconstruction pipeline (**1. Reference Inspection → 2. Component Specs → 3. Isolated Builds → 4. Visual QA**) inside the **Live Preview & Artifact Studio Node**.
  - **`Paperclip` + `OpenGoat` + `Claude Swarm`**: Agent terminals and Team Frames track **session continuity**, **task ownership**, **token/cost budgets**, **dependency scheduling**, **conflict detection**, and **session replay**.
  - **`Repomix`**: Built-in repository context packer that bundles selected files from `dev4-gpt/local-AgenticOS` (or any target repo) into token-counted context snapshots for `gemini-4-argon`.

---

### 1. Overview & Core Concept

- **What It Does**: Provides an infinite multi-agent spatial workspace that functions both as an independent mission control and as a drop-in spatial adapter for **Veloce `AgenticOS`**. Engineers can inspect targets with **REA MCP nodes** (verified with `ResearchOS-Web` SHA-256 provenance and `Graphify` extracted/inferred dependency graphs), pack repo slices via **Repomix**, pipe specs into **Codex / Claude Code / Gemini 4 Argon** agent terminals managed with **Paperclip/Swarm** budgets and conflict detection, and reconstruct working UI/code inside an **OpenDesign + AI Website Cloner** 4-stage Live Preview Studio.
- **Target Audience / Persona**: You and the Veloce `AgenticOS` engineering workflow—coordinating Codex, Claude Code, and Gemini 4 Argon across reverse-engineering and product-building tasks without waiting on slow upstream OS completion.
- **Key Value**: Zero duplication of `local-AgenticOS` core primitives, zero git collisions with Codex's active work, and immediate completion of the missing spatial canvas, REA evidence pipeline, and `AgentOS` gateway hardening.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Veloce `AgenticOS` Adapter & Availability Inspector**: Open the **Reuse / Extend / Build Adapter Matrix Drawer** -> inspect live connection status to `local-AgenticOS` (Memory, Tasks, Sessions, Multi-Model Router) and `AgentOS` MCP Gateway (with live controls for **Persistent Storage**, **Token Refresh**, and **Rate-Limit Enforcement**) -> pack selected files from `dev4-gpt/local-AgenticOS` using the built-in **Repomix Context Packer** for Gemini 4 Argon.
  2. **REA Inspector + `ResearchOS-Web` Provenance + `Graphify` Evidence Graph**: Drop a URL, HAR capture, JS bundle, or binary into an **REA MCP Inspector Node** -> inspect extracted endpoints, symbols, hex offsets, and a **Graphify Dependency Graph** where every edge and finding is explicitly tagged as **`EXTRACTED` (deterministic parser verified + SHA-256 artifact hash)** or **`INFERRED` (Gemini 4 Argon hypothesis)**.
  3. **`AI Website Cloner` + `OpenDesign` 4-Stage Reconstruction Studio**: Pipe REA evidence into the **Reconstruction & Live Preview Node** which steps through:
     - *Stage 1: Reference Inspection* (DOM/API/Binary evidence & tokens)
     - *Stage 2: Component Specs* (structured JSON/TypeScript contract generated by `gemini-4-argon`)
     - *Stage 3: Isolated Build* (live sandboxed HTML/React/Tailwind preview)
     - *Stage 4: Visual & Functional QA* (automated spec-vs-output verification checklist)
  4. **`Paperclip` + `Claude Swarm` + `OpenGoat` Multi-Agent Terminals**: Run side-by-side **Codex**, **Claude Code**, and **Gemini 4 Argon** terminal nodes grouped inside **OpenGoat Team Frames** with explicit role ownership, live token/cost budget meters, file-lock conflict detection, dependency DAG ordering (`ChatDev 2.0` style), and action replay history.
  5. **Hybrid Voice Planner (`gemini-4-argon` + `gemini-3.8-flash-lite-tts`)**: Speak or type a board-level directive -> `gemini-4-argon` computes the DAG plan and mutates the canvas -> `gemini-3.8-flash-lite-tts` synthesizes spoken WAV confirmation.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Precision macOS dark spatial studio—flat 1px structural borders (`#1F2937`), carbon-slate dot-matrix canvas (`#0B0F17`), and high-density tabular data grids.
  - *Color Palette & Mood*:
    - **60% Dominant Neutral Canvas**: Deep carbon-slate infinite board (`#0B0F17`) with subtle radial coordinate dots (`#1E293B`).
    - **30% Structural Surfaces**: Slate node containers (`#111827`), obsidian terminal wells (`#070A0F`), crisp 1px borders (`#1F2937`), and high-legibility text (`#F8FAFC` / `#94A3B8`).
    - **10% Accent Budget**: Electric indigo (`#6366F1`) for active node selection and DAG pipes, paired with semantic status labels: Nominal/Extracted (`#16A34A`), Inferred/Partial (`#D97706`), and Conflict/Rate-Limited (`#DC2626`).
  - *Typography & Hierarchy*:
    - **Display & Navigation**: `Plus Jakarta Sans` (SemiBold 600 / Bold 700).
    - **Body & Specs**: `DM Sans` (Regular 400 / Medium 500).
    - **Terminals, SHA-256 Hashes, Budgets & Offsets**: `JetBrains Mono` (`tabular-nums`).
  - *Component Styling & Layout*:
    - **Top Bar Contract**: Strict 1-row, 3-zone header separated by `gap-8`:
      1. *Brand Zone*: Single-line `Symvibe` wordmark.
      2. *Navigation Zone*: 4 single-line links (`Spatial Canvas`, `AgenticOS Adapter`, `REA Provenance`, `Swarm & Budgets`).
      3. *Primary Action Zone*: 1 primary action button (`Voice Planner`).
    - **Zero-Pill Metadata**: All node metadata (e.g., `SHA-256: 8f3a…9c1b · EXTRACTED · $0.04 / $2.00 Budget · 148ms`) uses clean unboxed inline text with `·` separators.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Strict Reuse / Extend / Build Adapter Contract for Veloce `AgenticOS`**
  - *Chosen Approach*: Expose a formal TypeScript adapter interface (`VeloceAgenticOSAdapter`) that maps **Memory**, **Tasks**, **Agent Sessions**, and **Model Routing** to `local-AgenticOS` endpoints when connected, and uses a hot-swappable local state provider when running standalone.
  - *Why*: Follows Codex's exact recommendation—avoiding duplicate infrastructure while letting you build, test, and use the spatial workspace immediately without waiting on Veloce `AgenticOS` completion.

- **Decision 2 — Closing `AgentOS` Gateway Gaps (Persistence, Token Refresh, Rate Limiting)**
  - *Chosen Approach*: Implement the three missing `AgentOS` gateway middlewares directly in the Express backend: JSON-backed persistent storage (`workspace-store.json`), OAuth/session token refresh lifecycle tracking, and per-agent/per-tool token bucket rate-limit enforcement.
  - *Why*: Directly resolves the unfinished items flagged in the `AgentOS` README so the MCP tool proxy is production-grade.

- **Decision 3 — `ResearchOS-Web` Provenance + `Graphify` Extracted/Inferred Distinction**
  - *Chosen Approach*: Every artifact analyzed by REA computes a real **SHA-256 digest** on the backend, and every node/edge in the analysis output is tagged as either `EXTRACTED` (backed by deterministic byte/AST/network parser offset) or `INFERRED` (synthesized by `gemini-4-argon`).
  - *Why*: Prevents AI hallucination during reverse engineering and gives downstream coding agents high-confidence specs.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     Top Bar (3-Zone Contract: Symvibe · Nav Links · CTA)                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────── Infinite Spatial Canvas (ChatDev 2.0 DAG) ──────────────────┐  │
│  │                                                                                    │  │
│  │  ┌────────────────────────┐   ┌─────────────────────────┐   ┌───────────────────┐  │  │
│  │  │ Veloce AgenticOS &     │   │ REA + ResearchOS +      │   │ Paperclip / Swarm │  │  │
│  │  │ Repomix Context Node   │──►│ Graphify Inspector Node │──►│ Agent Terminal    │  │  │
│  │  │ • Reuse/Extend/Build   │   │ • SHA-256 Provenance    │   │ • Codex / Claude  │  │  │
│  │  │ • Repo Context Packer  │   │ • EXTRACTED vs INFERRED │   │   / Gemini 4 Argon│  │  │
│  │  └───────────┬────────────┘   └────────────┬────────────┘   └─────────┬─────────┘  │  │
│  │              │                             │                          │            │  │
│  │              ▼                             ▼                          ▼            │  │
│  │  ┌────────────────────────┐   ┌─────────────────────────────────────────────────┐  │  │
│  │  │ OpenGoat & Swarm Board │   │ AI Website Cloner + OpenDesign Artifact Studio  │  │  │
│  │  │ • Role Ownership       │◄─►│ 1. Inspection ─► 2. Component Specs ─►          │  │  │
│  │  │ • Budgets & Conflicts  │   │ 3. Isolated Build ─► 4. Visual QA Preview       │  │  │
│  │  └────────────────────────┘   └─────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ REST / MCP Proxy / Audio WAV
┌────────────────────────────────────────────▼─────────────────────────────────────────────┐
│                   Express Backend & Hardened AgentOS Gateway (Port 3000)                 │
├────────────────────────────┬──────────────────────────────┬──────────────────────────────┤
│  AgenticOS & AgentOS Layer │   REA + Provenance + Graph   │  Gemini 4 Argon + Voice Hub  │
│  • Reuse/Extend/Build API  │   • /api/rea/inspect         │  • gemini-4-argon (Planning, │
│  • Persistent Store        │   • SHA-256 Artifact Hasher  │    Specs, Tool Calling)      │
│  • Token Refresh Manager   │   • Graphify AST/Byte Parser │  • gemini-3.8-flash-lite-tts │
│  • Rate-Limit Enforcer     │   • Repomix Repo Bundler     │    (Spoken WAV Replies)      │
└────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

- **Data Model & State**:
  - `AdapterCapabilityMap`: Tracks every subsystem across the **Reuse** (`memory`, `tasks`, `sessions`, `modelRouter`), **Extend** (`agentOsMcpDiscovery`, `persistentStorage`, `tokenRefresh`, `rateLimiter`), and **Build** (`spatialCanvas`, `reaProvenance`, `clonerPipeline`, `swarmScheduler`, `repomixPacker`) tiers with live health, call counts, and rate-limit quotas.
  - `ProvenanceEvidence`: `{ id, sha256, sourceArtifact, offsetOrLine, confidenceType: 'EXTRACTED' | 'INFERRED', category, finding, codeSpec }`.
  - `SwarmSession`: `{ agentId, runner: 'codex' | 'claude-code' | 'gemini-4-argon', teamRole, ownerTask, budgetLimitUsd, budgetUsedUsd, lockedFiles[], actionHistory[] }`.
  - `ClonerPipelineState`: Holds the 4 stages (`referenceInspection`, `componentSpecs`, `isolatedBuildHtml`, `visualQaChecks[]`) for each Live Preview & Artifact Studio node.

- **Interactive Component & State Mapping**:
  - **Veloce `AgenticOS` Adapter & `Repomix` Drawer**: Displays the interactive Reuse / Extend / Build matrix, tests live sync with `dev4-gpt/local-AgenticOS`, demonstrates hardened `AgentOS` rate-limiting & token refresh, packs selected repo files into a Repomix digest, and exports the drop-in `VeloceAgenticOSAdapter` module.
  - **REA + `ResearchOS` + `Graphify` Node**: Runs real URL/HAR/Bundle/Binary analysis, computes SHA-256 hashes, renders an interactive SVG dependency graph filtering `EXTRACTED` vs `INFERRED` nodes, and pipes verified component specs to downstream nodes.
  - **`Paperclip` + `Claude Swarm` Terminal & Team Nodes**: Executes prompts and sandboxed commands using `gemini-4-argon` (with automatic `paid_model_flow` trigger or `gemini-3.8-flash` fallback), enforces token budgets, flags file-lock conflicts when two agents target the same file, and supports step-by-step session replay.
  - **`AI Website Cloner` + `OpenDesign` Preview Studio Node**: Lets users step through Reference Inspection → Component Specs → Isolated Build → Visual QA, edit or regenerate isolated builds via `gemini-4-argon`, and verify visual/functional parity inside a live sandboxed iframe.
