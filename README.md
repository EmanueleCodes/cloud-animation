# Cloud Animation

The finished ChatGPT-style cloud animation — compound motion, phase distribution, tail, and three render modes.

**Read the full tutorial:** [emanuelecodes.com/cloud-tutorial](https://emanuelecodes.com/cloud-tutorial)

## Branches

| Branch | What's inside |
| --- | --- |
| **`starter`** | Empty TanStack Start project — clone this to follow the tutorial step by step |
| **`main`** (this branch) | Complete cloud animation with all render modes |

Want to build it yourself? Start from the starter branch:

```bash
git clone -b starter https://github.com/EmanueleCodes/cloud-animation.git
```

Or download the starter directly: [starter branch zip](https://github.com/EmanueleCodes/cloud-animation/archive/refs/heads/starter.zip)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the cloud with mode toggles (filled, outline, outline + fill).

## What's included

- `src/components/AnimatedCloud.tsx` — core cloud component with all animation logic
- `src/hooks/useIsVisible.ts` — pauses animation when off-screen
- Three render modes: `filled`, `outline`, `outlineFill`

## Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- [Motion](https://motion.dev/) for animation
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Author

Built by [Emanuele](https://emanuelecodes.com) — code, design, and engineering.
