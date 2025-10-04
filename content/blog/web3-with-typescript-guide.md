---
title: "Web3 with TypeScript: A Practical, End‑to‑End Guide"
date: "2024-11-20"
tags: ["Nodejs", "Solidity", "hardhat", "Web3"]
excerpt: "Kicking off my blog with a tiny Markdown‑powered setup."
---

Whether you’re shipping a dapp, a backend indexer, or contract tooling, TypeScript (TS) gives you strong types, safer refactors, and a smoother DX across the whole Web3 stack. This guide walks you end‑to‑end: contracts → scripts → frontend. Copy–paste friendly, opinionated, and up‑to‑date.

---

## TL;DR
- Use **TypeScript** everywhere: Hardhat scripts/tests, Node tools, and React frontends.
- Prefer **typed ABIs** (e.g., with `as const`, viem’s `Abi` types, or typechain) to eliminate class‑of‑bugs in contract calls.
- For frontends, **wagmi + viem** is a clean TS‑first stack.
- Keep secrets in `.env`, never in code.
- Test locally (Hardhat/Anvil), then on a public testnet (e.g., Sepolia/Holesky), then mainnet.

---

## Why TypeScript for Web3?
Web3 apps integrate multiple moving parts: JSON‑RPC providers, contract ABIs, wallets, chain IDs, and custom serialization. TS catches mistakes early, makes contract calls discoverable, and auto‑documents your system via types.

**Big wins:**
- **Strongly typed ABIs** → compile‑time checks on function names/args/return types.
- **Safer refactors** → rename functions or contracts and let TS surface all the breakage.
- **IDE superpowers** → IntelliSense for contract calls and event filters.

---

## Prerequisites
- Node 18+ or Bun
- `git`, a code editor (VS Code recommended)
- Basic Solidity familiarity

---

## Project Layout
Monorepo or single‑repo both work. Here’s a simple single‑repo layout you can expand later.

```
web3-ts-guide/
├─ contracts/
│  └─ Counter.sol
├─ scripts/
│  ├─ deploy.ts
│  └─ interact.ts
├─ test/
│  └─ Counter.test.ts
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx
│  │  └─ wagmi.ts
│  ├─ index.html (if Vite)
│  └─ package.json
├─ hardhat.config.ts
├─ tsconfig.json
├─ package.json
└─ .env
```

> You can also replace Hardhat with Foundry for contract dev, and keep TypeScript for scripts/frontends. This guide shows a TypeScript‑first Hardhat flow and a React frontend powered by wagmi + viem.

---

## 1) Initialize & Install
From the repo root:

```bash
npm init -y
# Core tooling
npm i -D typescript ts-node @types/node dotenv
# Hardhat + toolbox (ethers, chai, etc.)
npm i -D hardhat @nomicfoundation/hardhat-toolbox
# Runtime libs for scripts
npm i ethers viem
```

Create TS config:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["node"],
    "outDir": "dist"
  },
  "include": ["./**/*.ts", "./**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

Create `.env` (do **not** commit this):

```bash
RPC_URL="https://sepolia.infura.io/v3/<infura-or-alchemy-key>"
PRIVATE_KEY="0x...dev-key-for-testing..."
``` 

> Use a **throwaway** account on testnets. Never hardcode private keys.

---

## 2) Hardhat Setup (TypeScript)
Create a minimal `hardhat.config.ts`:

```ts
import { config as dotenv } from "dotenv";
dotenv();
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

const RPC_URL = process.env.RPC_URL ?? "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
```

Initialize Hardhat once (generates artifacts on first compile):

```bash
npx hardhat compile
```

---

## 3) A Tiny Contract: `Counter.sol`
Create `contracts/Counter.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    event Increment(address indexed by, uint256 newValue);
    event Decrement(address indexed by, uint256 newValue);

    uint256 private _value;

    function current() external view returns (uint256) {
        return _value;
    }

    function inc() external {
        unchecked { _value += 1; }
        emit Increment(msg.sender, _value);
    }

    function dec() external {
        require(_value > 0, "UNDERFLOW");
        _value -= 1;
        emit Decrement(msg.sender, _value);
    }
}
```

Compile:

```bash
npx hardhat compile
```

---

## 4) Deploy with TypeScript
Create `scripts/deploy.ts`:

```ts
import { config as dotenv } from "dotenv";
dotenv();
import { ethers } from "ethers";
import * as CounterArtifact from "../artifacts/contracts/Counter.sol/Counter.json";

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const factory = new ethers.ContractFactory(
    CounterArtifact.abi,
    CounterArtifact.bytecode,
    wallet
  );

  const contract = await factory.deploy();
  console.log("Deploy tx:", contract.deploymentTransaction()?.hash);
  const address = await contract.getAddress();
  console.log("Counter deployed at:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Run it against Sepolia:

```bash
npx ts-node scripts/deploy.ts
```

> You can also deploy to the local `hardhat` network by running `npx hardhat node` and changing `RPC_URL` accordingly (e.g., `http://127.0.0.1:8545`).

---

## 5) Interact from TypeScript (Node)
Create `scripts/interact.ts`:

```ts
import { config as dotenv } from "dotenv";
dotenv();
import { ethers } from "ethers";
import { Abi } from "viem";

// Minimal ABI typed with viem's Abi for safer calls
const counterAbi = [
  { "type": "function", "name": "current", "stateMutability": "view", "inputs": [], "outputs": [{"type":"uint256"}] },
  { "type": "function", "name": "inc", "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
  { "type": "function", "name": "dec", "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
] as const satisfies Abi;

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const COUNTER_ADDRESS = process.env.COUNTER_ADDRESS!; // set after deploy

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const counter = new ethers.Contract(COUNTER_ADDRESS, counterAbi, signer);

  const before = await counter.current();
  console.log("current:", before.toString());

  const tx = await counter.inc();
  console.log("inc tx:", tx.hash);
  await tx.wait();

  const after = await counter.current();
  console.log("current:", after.toString());
}

main().catch(console.error);
```

Run:

```bash
COUNTER_ADDRESS=0x... npx ts-node scripts/interact.ts
```

---

## 6) Frontend (React + wagmi + viem)
Create a Vite React app (or Next.js). Here’s Vite for brevity:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm i wagmi viem @tanstack/react-query
```

Make a simple wagmi config in `frontend/src/wagmi.ts`:

```ts
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia],
  transports: { [sepolia.id]: http(import.meta.env.VITE_RPC_URL) },
  connectors: [injected()]
});
```

Add a minimal dapp UI in `frontend/src/App.tsx`:

```tsx
import { useState } from "react";
import { WagmiProvider, useAccount, useReadContract, useWriteContract } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./wagmi";
import type { Abi } from "viem";

const counterAbi = [
  { type: "function", name: "current", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "inc", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "dec", stateMutability: "nonpayable", inputs: [], outputs: [] },
] as const satisfies Abi;

const COUNTER_ADDRESS = import.meta.env.VITE_COUNTER_ADDRESS as `0x${string}`;

function CounterWidget() {
  const { address, isConnected } = useAccount();

  const { data: current, refetch } = useReadContract({
    abi: counterAbi,
    address: COUNTER_ADDRESS,
    functionName: "current",
  });

  const { writeContractAsync, isPending } = useWriteContract();

  async function mutate(fn: "inc" | "dec") {
    await writeContractAsync({ abi: counterAbi, address: COUNTER_ADDRESS, functionName: fn });
    await refetch();
  }

  if (!isConnected) return <p>Connect your wallet in the browser extension.</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>Connected as {address}</div>
      <div>Current: {current?.toString() ?? "…"}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={isPending} onClick={() => mutate("inc")}>+1</button>
        <button disabled={isPending} onClick={() => mutate("dec")}>-1</button>
      </div>
    </div>
  );
}

const qc = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <div style={{ padding: 24 }}>
          <h1>Counter dApp</h1>
          <CounterWidget />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

Create `frontend/.env`:

```bash
VITE_RPC_URL="https://sepolia.infura.io/v3/<key>"
VITE_COUNTER_ADDRESS="0x..."
```

Run the app:

```bash
npm run dev
```

Open the browser, connect your wallet (MetaMask), and try increment/decrement.

---

## 7) Type‑Safe ABIs: Three Approaches
1) **`as const` + `Abi` (viem)** — Lightweight and framework‑agnostic.
2) **TypeChain** — Generates TS types from your compiled artifacts.
3) **Zod/Valibot schema guards** — Runtime validation if you ingest unknown ABIs.

**TypeChain setup (optional):**

```bash
npm i -D typechain @typechain/ethers-v6
```

Add a script after `npx hardhat compile`:

```bash
npx typechain --target ethers-v6 --out-dir typechain "artifacts/**/*.json"
```

Now you can import strongly typed factories/contracts from `typechain/`.

---

## 8) Testing Strategy
- **Unit tests (TS):** call public/external functions via Hardhat or viem + anvil.
- **Event assertions:** verify emitted events and args.
- **Property/fuzz tests:** broaden your inputs; catch edge cases.
- **Fork tests:** simulate real mainnet state with a forked RPC to test integrations.

Minimal test example `test/Counter.test.ts`:

```ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", () => {
  it("increments and decrements", async () => {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.waitForDeployment();

    expect(await counter.current()).to.equal(0n);
    await (await counter.inc()).wait();
    expect(await counter.current()).to.equal(1n);
    await (await counter.dec()).wait();
    expect(await counter.current()).to.equal(0n);
  });
});
```

Run tests:

```bash
npx hardhat test
```

---

## 9) Production Notes & Security
- **Secrets:** use `.env` and deployment‐time env injection. Never commit keys.
- **RPC hygiene:** retries/backoff; consider multiple providers or a fallback chain list.
- **Chain IDs:** always pass explicit `chainId` when signing to avoid replay.
- **Gas:** let the client estimate; override with care. Use EIP‑1559 (maxFee, maxPriorityFee).
- **Frontends:** prevent re‑entrancy in UI flows (disable buttons during pending txs).
- **Allowance patterns:** prefer `permit` or exact‑amount approvals; avoid unlimited approvals.
- **Upgrades:** if using proxies, document upgrade authority and add transparent pause/kill‑switch processes.
- **Monitoring:** track events + tx statuses; surface failures in the UI with human‑readable reasons.

---

## 10) Common Pitfalls
- Mixing Ethers v5 and v6 import styles/signatures.
- Forgetting to `await tx.wait()` before reading updated state.
- Using the wrong chain in wallet vs provider.
- Not typing ABIs → easy to mistype function names.
- Hardcoding contract addresses per env — use env variables or a small registry JSON.

---

## 11) Next Steps
- Add an **indexer** (TS) that listens to `Increment/Decrement` and writes to a database.
- Generate **subgraphs** or use log‑based state machines.
- Expand to **multi‑chain** with wagmi’s multi‑chain config.
- Integrate **account abstraction** (EIP‑4337) SDKs for smart accounts.

---

## Appendix: Handy Snippets

**EIP‑1559 transaction (Ethers v6):**

```ts
await signer.sendTransaction({
  to: "0x...",
  value: ethers.parseEther("0.01"),
  maxFeePerGas: ethers.parseUnits("30", "gwei"),
  maxPriorityFeePerGas: ethers.parseUnits("1.5", "gwei"),
});
```

**Listen to an event (Node):**

```ts
counter.on("Increment", (by: string, newValue: bigint) => {
  console.log("increment by", by, "→", newValue);
});
```

**Fetch logs with viem:**

```ts
import { createPublicClient, http, parseAbiItem } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({ chain: sepolia, transport: http(process.env.RPC_URL) });

const event = parseAbiItem("event Increment(address indexed by, uint256 newValue)");
const logs = await client.getLogs({ address: COUNTER_ADDRESS as `0x${string}`, events: [event], fromBlock: 0n });
```

---

**You now have a typed, end‑to‑end Web3 stack:** Solidity contracts, TypeScript deploy/interact scripts, and a React frontend using wagmi + viem. Clone this layout, swap in your own contracts, and ship. Happy hacking! 🚀
