import "./style.css";
import { Color, color } from "chroma.ts";

/** debug panel */
const debugFontSize = 18;
let showDebugPanel = true;
const debugPanelButton = document.querySelector("#debug-panel-button")!;
debugPanelButton.addEventListener(
    "click",
    () => (showDebugPanel = !showDebugPanel),
);

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let w = canvas.width,
    h = canvas.height,
    cx = w / 2,
    cy = h / 2;

addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = canvas.width;
    h = canvas.height;
    cx = w / 2;
    cy = h / 2;
});

let zoom = 1;
const m = { x: NaN, y: NaN };
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom = Math.max(0.25, Math.min(4, (zoom -= Math.sign(e.deltaY) * 0.25)));
});
canvas.addEventListener("mousemove", (e) => {
    m.x = e.offsetX;
    m.y = e.offsetY;
});

const ctx = canvas.getContext("2d")!;

const p1 = { x: 0, y: 0, r: 50 };
const p2 = { x: cx, y: cy, r: 50 };
const p3 = { x: 400, y: 400, r: 50 };
const p4 = { x: 500, y: 500, r: 50 };
const p5 = { x: 500, y: 300, r: 30 };
const p6 = { x: 300, y: 500, r: 60 };

function animate() {
    ctx.restore();
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    ctx.scale(zoom, zoom);

    // drawPoint(p1);
    // drawPoint(
    //     { x: p2.x / zoom, y: p2.y / zoom, r: p2.r },
    //     { fillStyle: "green" },
    // );

    drawPoint({
        x: p3.x - ((zoom - 1) / zoom) * m.x,
        y: p3.y - ((zoom - 1) / zoom) * m.y,
        r: p3.r,
    });
    drawPoint(
        { x: p3.x, y: p3.y, r: p3.r },
        { strokeStyle: "pink", stroke: true, lineWidth: 4, fill: false },
    );

    drawPoint(
        {
            x: p4.x - ((zoom - 1) / zoom) * m.x,
            y: p4.y - ((zoom - 1) / zoom) * m.y,
            r: p4.r,
        },
        { fillStyle: "lightblue" },
    );
    drawPoint(
        {
            x: p4.x,
            y: p4.y,
            r: p4.r,
        },
        { fill: false, stroke: true, strokeStyle: "lightblue" },
    );

    drawPoint(
        {
            x: p5.x - ((zoom - 1) / zoom) * m.x,
            y: p5.y - ((zoom - 1) / zoom) * m.y,
            r: p5.r,
        },
        { fillStyle: color("goldenrod") },
    );

    drawPoint(
        {
            x: p6.x - ((zoom - 1) / zoom) * m.x,
            y: p6.y - ((zoom - 1) / zoom) * m.y,
            r: p6.r,
        },
        { fillStyle: color("linen") },
    );

    if (showDebugPanel) {
        drawDebugPanel([
            `canvas size: ${w}, ${h}`,
            `current zoom: ${zoom.toFixed(2)}`,
            `view mouse position:   ${m.x}, ${m.y}`,
            `canvas mouse position: ${(m.x / zoom).toFixed(0)}, ${(m.y / zoom).toFixed(0)}`,
        ]);
    }

    requestAnimationFrame(animate);
}

function drawDebugPanel(info: string[]) {
    ctx.resetTransform();
    ctx.font = `${debugFontSize}px monospace`;
    ctx.textAlign = "start";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#ddd";
    for (let i = 0; i < info.length; i++) {
        ctx.fillText(info[i], 0, h - i * debugFontSize);
    }
}

function drawPoint(
    p: typeof p1,
    {
        fill = true,
        stroke = false,
        fillStyle = "pink",
        strokeStyle = "magenta",
        lineWidth = 1,
    }: { [index: string]: any; fillStyle?: string | Color } = {},
) {
    if (fill || stroke) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (fill) {
            ctx.fillStyle = fillStyle.toString();
            ctx.fill();
        }
        if (stroke) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
        }
    }

    const fontSize = 12;
    const padding = 2;
    ctx.fillStyle = "black";
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const t = `${p.x.toFixed(0)}, ${p.y.toFixed(0)}`;
    const tm = ctx.measureText(t);
    ctx.fillRect(
        p.x - tm.width / 2 - padding,
        p.y - (fontSize + padding * 2) / 2,
        tm.width + padding * 2,
        fontSize + padding * 2,
    );

    ctx.fillStyle = "white";
    ctx.fillText(t, p.x, p.y);
}

animate();
