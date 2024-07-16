import "./style.css";
import { Color, color } from "chroma.ts";

/** debug panel */
const debugFontSize = 18;
let showDebugPanel = true;
const debugPanelButton = document.querySelector("#debug-panel-button");
const resetOffsetButton = document.querySelector<HTMLButtonElement>(
    "#reset-offset-button",
);
const resetZoomButton =
    document.querySelector<HTMLButtonElement>("#reset-zoom-button");
const getTransformButton = document.querySelector<HTMLButtonElement>(
    "#get-transform-button",
);
// @ts-ignore
const canvasContainerDiv =
    document.querySelector<HTMLDivElement>("#canvas-container")!;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
canvas.width = canvasContainerDiv.clientWidth;
canvas.height = canvasContainerDiv.clientHeight;
const ctx = canvas.getContext("2d")!;
let centerX = canvas.width / 2,
    centerY = canvas.height / 2;
let isDragging = false;
let zoom = 1;
const offset = { x: canvas.width / 2, y: canvas.height / 2 };
const viewportMouse = { x: NaN, y: NaN };
const canvasMouse = { x: NaN, y: NaN };
const p1 = { x: 0, y: 0, r: 50 };

debugPanelButton &&
    debugPanelButton.addEventListener(
        "click",
        () => (showDebugPanel = !showDebugPanel),
    );
resetOffsetButton &&
    resetOffsetButton.addEventListener("click", () => {
        offset.x = 0;
        offset.y = 0;
    });
resetZoomButton && resetZoomButton.addEventListener("click", () => (zoom = 1));
getTransformButton &&
    getTransformButton.addEventListener("click", () =>
        console.log(ctx.getTransform()),
    );
addEventListener("keyup", (e) => {
    switch (e.key) {
        case "r":
            offset.x = 0;
            offset.y = 0;
            break;
    }
});

addEventListener("resize", () => {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.addEventListener(
    "wheel",
    (e) => {
        e.preventDefault();
        // the hardest part of this feature(zooming under mouse cursor), in my
        // opinion, is each zoom action actually changes the offset. imagine
        // zoom in when the mouse is in the center, the left corner of the
        // canvas is being pushed out.

        const scrollDirection = Math.sign(e.deltaY);
        const previousZoom = zoom;
        zoom = Math.max(0.25, Math.min(4, zoom * (1 - scrollDirection * 0.1)));
        const ratio = zoom / previousZoom;

        // these following two lines are the thing that stumped me to almost 3
        // days.
        // it says, for every mouse movement,
        //   1st, take the mouse position with zoom considered;
        //   2nd, take 1st part again times it to the (new / old) zoom ratio;
        //   3nd, add to offset the difference of 1st and 2nd.
        //   fuck, this took me too long to understand.
        offset.x += viewportMouse.x / zoom - (viewportMouse.x / zoom) * ratio;
        offset.y += viewportMouse.y / zoom - (viewportMouse.y / zoom) * ratio;
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

    canvasMouse.x = viewportMouse.x / zoom - offset.x;
    canvasMouse.y = viewportMouse.y / zoom - offset.y;
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
    const matrix = ctx.getTransform();
    ctx.resetTransform();
    ctx.font = `${debugFontSize}px monospace`;
    ctx.textAlign = "start";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "magenta";
    for (let i = 0; i < info.length; i++) {
        ctx.fillText(info[i], 0, canvas.height - i * debugFontSize);
    }
    ctx.setTransform(matrix);
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

const points: any = [];
for (let _ = 0; _ < 50; _++) {
    const magnitude = Math.random() * 1600;
    const radian = Math.random() * Math.PI * 2;
    points.push({
        p: {
            x: Math.cos(radian) * magnitude,
            y: Math.sin(radian) * magnitude,
            r: Math.random() * 50 + 50,
        },
        color:
            `rgb(` +
            `${Math.floor(Math.random() * 256)} ` +
            `${Math.floor(Math.random() * 256)} ` +
            `${Math.floor(Math.random() * 256)}` +
            `)`,
    });
}

function animate() {
    // reset the transform matrix at the start of each frame, and then clear the
    // canvas
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    const vc = canvas.height / 2 - 0.5,
        hc = canvas.width / 2 - 0.5;
    ctx.moveTo(0, vc);
    ctx.lineTo(canvas.width, vc);
    ctx.moveTo(hc, 0);
    ctx.lineTo(hc, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color("whitesmoke").toString();
    ctx.stroke();

    ctx.setTransform({
        a: zoom,
        d: zoom,
        e: offset.x * zoom,
        f: offset.y * zoom,
    });

    drawPoint({ x: p1.x, y: p1.y, r: p1.r }, { fillStyle: "lightgreen" });

    for (const p of points) {
        drawPoint(p.p, {
            fillStyle: p.color,
        });
    }

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
