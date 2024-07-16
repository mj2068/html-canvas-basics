import { drawText } from "../utils/draw";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;
let W = canvas.width,
    H = canvas.height;
const cos = Math.cos,
    sin = Math.sin,
    tan = Math.tan,
    rdm = Math.random;

canvas.addEventListener("mousemove", (_e) => {});
{
    // grid lines
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
    for (let i = 0.5; i <= W; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
    }
    for (let i = 0.5; i <= H; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(W, i);
        ctx.stroke();
    }
}

const text: [string, number, number] = ["hello", 400, 400];
const a = Math.PI / 4;
const scale = [5, 5];
drawText(ctx, ...text, { fillStyle: "red", textAlign: "center" });
ctx.transform(
    scale[0] * cos(a),
    scale[0] * sin(a),
    scale[1] * -sin(a),
    scale[1] * cos(a),
    -text[1] * scale[0] * cos(a) + text[2] * scale[1] * sin(a) + text[1],
    -text[1] * scale[0] * sin(a) - text[2] * scale[1] * cos(a) + text[2],
);
drawText(ctx, ...text, { fillStyle: "yellow", textAlign: "center" });

ctx.strokeStyle = "blue";
ctx.lineWidth = 1;
for (let i = 0.5; i <= W; i += 100) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
}
for (let i = 0.5; i <= H; i += 100) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(W, i);
    ctx.stroke();
}
