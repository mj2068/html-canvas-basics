import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const ctx = canvas.getContext("2d")!;

ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fillStyle = "lightgreen";
ctx.fill();

// conclusion: translate(...) only translates coordinate system(current matrix),
// drawn shapes not affected.
ctx.translate(canvas.width / 2, canvas.height / 2);

ctx.scale(2, 2);

ctx.beginPath();
ctx.arc(0, 0, 50, 0, Math.PI * 2);
ctx.fillStyle = "pink";
ctx.fill();
