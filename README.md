# alg

算法可视化学习平台 - A pure-frontend Vue 3 application for visualizing algorithm execution.

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build        # Type-check with vue-tsc then build for production
npm run preview      # Preview production build locally
```

## Project Structure

```
src/
├── algorithms/      # Algorithm definitions (plugin-style)
│   ├── sort/        # Sorting algorithms
│   ├── search/      # Search algorithms
│   └── tree/        # Tree algorithms
├── components/      # Vue components
├── stores/          # Pinia stores
└── utils/           # Utility functions
```

## Adding Algorithms

1. Create `src/algorithms/{category}/{algorithm}.ts`
2. Import and add to `src/algorithms/{category}/index.ts`

Routes and navigation are auto-generated.

## Keyboard Controls

- `ArrowRight` - Step forward
- `ArrowLeft` - Step backward
- `Space` - Play/pause
