import "./style.css";
import { Color, color } from "chroma.ts";

/** debug panel */
const debugFontSize = 18;
let showDebugPanel = true;
const debugPanelButton = document.querySelector("#debug-panel-button")!;
const resetOffsetButton = document.querySelector<HTMLButtonElement>(
    "#reset-offset-button",
)!;
// @ts-ignore
const canvasContainerDiv =
    document.querySelector<HTMLDivElement>("#canvas-container")!;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;
let centerX = canvas.width / 2,
    centerY = canvas.height / 2;
let isDragging = false;
let zoom = 1;
const offset = { x: 0, y: 0 };
const viewportMouse = { x: NaN, y: NaN };
const canvasMouse = { x: NaN, y: NaN };
const p0 = { x: -50, y: -50, r: 50 };
const p1 = { x: 50, y: 50, r: 50 };
const p2 = { x: 150, y: 150, r: 50 };
const p3 = { x: 400, y: 400, r: 50 };
const p4 = { x: 300, y: 500, r: 60 };

debugPanelButton.addEventListener(
    "click",
    () => (showDebugPanel = !showDebugPanel),
);
resetOffsetButton.addEventListener("click", () => {
    offset.x = 0;
    offset.y = 0;
});
addEventListener("keyup", (e) => {
    switch (e.key) {
        case "r":
            offset.x = 0;
            offset.y = 0;
            break;
    }
});

addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.addEventListener(
    "wheel",
    (e) => {
        e.preventDefault();

        zoom = Math.max(
            0.25,
            Math.min(4, (zoom -= Math.sign(e.deltaY) * 0.25)),
        );
    },
    { passive: false },
);

canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        offset.x += e.movementX / zoom;
        offset.y += e.movementY / zoom;
    }

    viewportMouse.x = e.offsetX;
    viewportMouse.y = e.offsetY;

    canvasMouse.x = (viewportMouse.x - offset.x) / zoom;
    canvasMouse.y = (viewportMouse.y - offset.y) / zoom;
});

canvas.addEventListener("mousedown", (e) => {
    if (0 === e.button || 1 === e.button) {
        isDragging = true;
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (0 === e.button || 1 === e.button) {
        isDragging = false;
    }
});

function drawDebugPanel(info: string[]) {
    ctx.resetTransform();
    ctx.font = `${debugFontSize}px monospace`;
    ctx.textAlign = "start";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#ddd";
    for (let i = 0; i < info.length; i++) {
        ctx.fillText(info[i], 0, canvas.height - i * debugFontSize);
    }
}

function drawPoint(
    p: typeof p1,
    {
        fillStyle = "pink",
        strokeStyle = null,
        lineWidth = 4,
    }: {
        fillStyle?: string | Color | null;
        strokeStyle?: string | Color | null;
        lineWidth?: number;
    } = {},
) {
    if (null !== fillStyle || null !== strokeStyle) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (null !== strokeStyle) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = strokeStyle.toString();
            ctx.stroke();
        }
        if (null !== fillStyle) {
            ctx.fillStyle = fillStyle.toString();
            ctx.fill();
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

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const vc = canvas.height / 2,
        hc = canvas.width / 2;
    ctx.moveTo(0, vc);
    ctx.lineTo(canvas.width, vc);
    ctx.moveTo(hc, 0);
    ctx.lineTo(hc, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color("whitesmoke").toString();
    ctx.stroke();

    ctx.setTransform({ m11: zoom, m22: zoom, m41: offset.x, m42: offset.y });

    drawPoint(p0, { fillStyle: color("burlywood") });
    drawPoint({ x: p1.x, y: p1.y, r: p1.r }, { fillStyle: "lightgreen" });
    drawPoint({ x: p2.x, y: p2.y, r: p2.r });
    drawPoint({ x: p3.x, y: p3.y, r: p3.r }, { fillStyle: "lightblue" });
    drawPoint({ x: p4.x, y: p4.y, r: p4.r }, { fillStyle: "blueviolet" });

    if (showDebugPanel) {
        drawDebugPanel([
            `viewport size:  ${canvas.width}, ${canvas.height}`,
            `scaled size:    ${(canvas.width / zoom).toFixed(0)}, ` +
                `${(canvas.height / zoom).toFixed(0)}`,
            `current zoom:   ${zoom.toFixed(2)}`,
            `viewport mouse: ${viewportMouse.x}, ${viewportMouse.y}`,
            `canvas mouse:   ${canvasMouse.x.toFixed(0)}, ` +
                `${canvasMouse.y.toFixed(0)}`,
            `offset:         ${offset.x.toFixed(0)}, ${offset.y.toFixed(0)}`,
        ]);
    }

    requestAnimationFrame(animate);
}

animate();
