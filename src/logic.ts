import type { RuneClient } from "rune-games-sdk/multiplayer"

const BULLET_COUNT: number = 100;
const TARGET_COUNT: number = 16;

export type Bullet = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  id: number;
}

export type Target = {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
}

export interface GameState {
  targets: Target[];
  bullets: Bullet[];
  nextId: number;
}

type GameActions = {
  fireBullet: () => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

function createBullet(game: GameState) {
  game.bullets.push({
    id: game.nextId++,
    x: 20 + (Math.random() * 60),
    y: 20 + (Math.random() * 60),
    radius: (Math.random() * 1) + 1,
    vx: (Math.random() * 4) - 2,
    vy: (Math.random() * 4) - 2,
})
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 1,
  setup: () => {
    const state: GameState = {
      targets: [],
      bullets: [],
      nextId: 1
    }

    const step = Math.ceil(Math.sqrt(TARGET_COUNT));
    const space = 80 / step;
    for (let i=0;i<TARGET_COUNT;i++) {
      state.targets.push({
        x: ((i % step) * space) + space,
        y: (Math.floor(i / step) * space) + space,
        radius: space/4,
        hit: false
      });
    }

    for (let i=0;i<BULLET_COUNT;i++) {
      createBullet(state);
    }

    return state;
  },
  updatesPerSecond: 30,
  update: (context) => {
    for (const target of context.game.targets) {
      target.hit = false;
    }

    for (const bullet of context.game.bullets) {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      if (bullet.x > 100 || bullet.x < 0) {
        bullet.vx = -bullet.vx;
      }
      if (bullet.y > 100 || bullet.y < 0) {
        bullet.vy = -bullet.vy;
      }

      for (const target of context.game.targets) {
        const dx = target.x - bullet.x;
        const dy = target.y - bullet.y;
        const rad = target.radius + bullet.radius;
        if ((dx*dx)+(dy*dy) < (rad * rad)) {
          target.hit = true;
          break;
        }
      }
    }
  },
  actions: {
    fireBullet: (_, context) => {
      for (let i=0;i<10;i++) {
        createBullet(context.game);
      }
    }
  },
})
