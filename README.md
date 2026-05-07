# 🚀 Rocket Battle

> Two players. One screen. No mercy.

A local multiplayer space shooter built with Next.js and PixiJS. Two players share the same keyboard and battle it out in space — dodge, aim, and destroy your opponent's rocket.

You can play the game and see how it works here: [https://rocket-battle.vercel.app](https://rocket-battle.vercel.app)

---

![Main Menu](docs/preview.png)

---

## Gameplay

- **Health system** — each rocket starts at 100 HP, bullets deal damage on hit
- **Wrap-around movement** — fly off one edge and reappear on the opposite side
- **Countdown start** — 3-2-1-GO! before each round, no shooting early
- **Animated background** — planets drift slowly across the space battlefield

---

## Controls

<table>
  <tr>
    <th>Action</th>
    <th>🔴 Player 1</th>
    <th>🔵 Player 2</th>
  </tr>
  <tr>
    <td>Rotate</td>
    <td><kbd>A</kbd> / <kbd>D</kbd></td>
    <td><kbd>←</kbd> / <kbd>→</kbd></td>
  </tr>
  <tr>
    <td>Thrust</td>
    <td><kbd>W</kbd></td>
    <td><kbd>↑</kbd></td>
  </tr>
  <tr>
    <td>Brake</td>
    <td><kbd>S</kbd></td>
    <td><kbd>↓</kbd></td>
  </tr>
  <tr>
    <td>Fire</td>
    <td><kbd>F</kbd></td>
    <td><kbd>Space</kbd></td>
  </tr>
</table>

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Rendering | PixiJS 7 + @pixi/react |
| Styling | Tailwind CSS |
| Language | TypeScript |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the main menu will appear. Click **Press Start** to play.

---

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx            # Main menu
│   └── offlinegame/        # Game page
├── widgets/
│   └── game-canvas/        # Main game canvas & loop orchestration
├── features/
│   ├── game-loop/          # Per-player RAF game loop
│   └── keyboard-controls/  # Keyboard input (e.code based)
├── entities/
│   ├── rocket/             # Rocket model + PIXI view
│   └── bullet/             # Bullet model + PIXI view
└── shared/
    ├── constants/          # Canvas size fallback constants
    └── ui/                 # HealthBar component
```
