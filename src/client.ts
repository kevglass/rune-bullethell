import { GameState } from "./logic";
import "./styles.css"

const canvas = document.getElementById("gamecanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let currentGame: GameState;
let fps: number = 0;
let frameCount: number = 0;
let lastFPS: number = performance.now();
let fired: boolean = false;

requestAnimationFrame(render);

function render() {
  requestAnimationFrame(render);
  if (currentGame) {
    frameCount++;
    if (performance.now() - lastFPS > 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFPS = performance.now();
    }
    
    ctx.save();
    ctx.scale(5, 5);
    ctx.fillStyle = fired ? "yellow" : "black";
    fired = false;
    ctx.fillRect(0, 0, 100, 100);
    for (const target of currentGame.targets) {
      ctx.fillStyle = target.hit ? "red" : "white";
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const bullet of currentGame.bullets) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0,0,500,25);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("BULLETS: " + currentGame.bullets.length + " FPS: " + fps, 10, 20);
  }
}

window.addEventListener("mousedown", () => {
  fired = true;
  Rune.actions.fireBullet();
})

Rune.initClient({
  onChange: ({ game }) => {
    currentGame = game;
  },
})
