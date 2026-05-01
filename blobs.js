const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w, h;
let blobs = [];
let mouse = { x: 0.5, y: 0.5 };
let time = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Blob {
  constructor(x, y, r, color) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;

    this.points = [];
    this.count = 12;
    this.seed = Math.random() * 1000;

    for (let i = 0; i < this.count; i++) {
      this.points.push({
        angle: (Math.PI * 2 / this.count) * i,
        offset: Math.random() * 100
      });
    }
  }

  update(t) {
    this.x = this.baseX + Math.sin(t * 0.2 + this.seed) * 40;
    this.y = this.baseY + Math.cos(t * 0.15 + this.seed) * 40;
  }

  draw(ctx, t) {
    ctx.beginPath();

    for (let i = 0; i < this.count; i++) {
      const p = this.points[i];
      const next = this.points[(i + 1) % this.count];

      const wave1 = Math.sin(t + p.offset);
      const wave2 = Math.sin(t * 0.5 + p.offset * 2);
      const r1 = this.r + wave1 * 20 + wave2 * 10;

      const wave1n = Math.sin(t + next.offset);
      const wave2n = Math.sin(t * 0.5 + next.offset * 2);
      const r2 = this.r + wave1n * 20 + wave2n * 10;

      const x1 = this.x + Math.cos(p.angle) * r1;
      const y1 = this.y + Math.sin(p.angle) * r1;

      const x2 = this.x + Math.cos(next.angle) * r2;
      const y2 = this.y + Math.sin(next.angle) * r2;

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;

      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(x1, y1, mx, my);
    }

    ctx.closePath();

    const gradient = ctx.createRadialGradient(
      this.x, this.y, this.r * 0.2,
      this.x, this.y, this.r * 1.2
    );

    gradient.addColorStop(0, this.color.replace("0.3", "0.6"));
    gradient.addColorStop(1, this.color.replace("0.3", "0"));

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function createBlobs() {
  blobs = [
    new Blob(w * 0.15, h * 0.5, 220, "rgba(255, 0, 128, .2)"),
    new Blob(w * 0.15, h * 0.5, 110, "rgba(255, 0, 128, .3)"),

    new Blob(w * 0.7, h * 0.4, 260, "rgba(0, 200, 255, .1)"),
    new Blob(w * 0.7, h * 0.4, 120, "rgba(0, 200, 255, .3)"),
    
    new Blob(w * 0.5, h * 0.7, 350, "rgba(0, 255, 180, .2)"),
    new Blob(w * 0.5, h * 0.7, 150, "rgba(0, 255, 180, .3)")
  ];
}
createBlobs();

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#0f0f1f");
  gradient.addColorStop(1, "#1a1a2e");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function animate() {
  time += 0.05;

  ctx.clearRect(0, 0, w, h);

  drawBackground();

  ctx.filter = "blur(80px)";
  ctx.globalCompositeOperation = "lighter";

  blobs.forEach(blob => {
    blob.update(time);
    blob.draw(ctx, time);
  });

  ctx.filter = "none";
  ctx.globalCompositeOperation = "source-over";

  requestAnimationFrame(animate);
}

animate();