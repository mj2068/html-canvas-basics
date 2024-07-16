import { color } from "chroma.ts";
import { Vector } from "../primitives/vector";

const PI = Math.PI;
const TAU = Math.PI * 2;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;

ctx.fillStyle = "#222";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const width = 80;
const vm = new Vector(600, 400);
const v1 = new Vector(300, 300);
const v2 = new Vector(800, 100);

function drawRect(
    v1: Vector,
    v2: Vector,
    width: number,
    color1 = "lightgreen",
    color2 = "lightblue",
) {
    const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
    console.log(angle);
    const v1EndL = new Vector(
        v1.x + (Math.cos(angle - PI / 2) * width) / 2,
        v1.y + (Math.sin(angle - PI / 2) * width) / 2,
    );
    const v1EndR = new Vector(
        v1.x + Math.cos(angle + PI / 2) * (width / 2),
        v1.y + Math.sin(angle + PI / 2) * (width / 2),
    );

    const v2EndL = new Vector(
        v2.x + (Math.cos(angle - PI / 2) * width) / 2,
        v2.y + (Math.sin(angle - PI / 2) * width) / 2,
    );
    const v2EndR = new Vector(
        v2.x + Math.cos(angle + PI / 2) * (width / 2),
        v2.y + Math.sin(angle + PI / 2) * (width / 2),
    );

    ctx.beginPath();
    ctx.arc(v2.x, v2.y, width / 2, PI / 2, angle + PI / 2);
    ctx.strokeStyle = "red";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(v2.x, v2.y, width / 2, angle - PI / 2, PI / 2);
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(...v1EndL.tuple);
    ctx.lineTo(...v2EndL.tuple);
    ctx.moveTo(...v1EndR.tuple);
    ctx.lineTo(...v2EndR.tuple);
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.arc(...v1EndL.tuple, 6, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(...v1EndR.tuple, 6, 0, TAU);
    ctx.fill();

    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.arc(...v2EndL.tuple, 6, 0, TAU);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(...v2EndR.tuple, 6, 0, TAU);
    ctx.fill();
}

ctx.moveTo(...vm.tuple);
ctx.lineTo(...v1.tuple);
ctx.moveTo(...vm.tuple);
ctx.lineTo(...v2.tuple);
ctx.strokeStyle = "white";
ctx.stroke();

drawRect(v1, vm, width);
drawRect(v2, vm, width);
