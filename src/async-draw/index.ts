import { color } from "chroma.ts";
import { useCanvas } from "../utils/canvas";
import { drawGrid } from "../utils/draw";

const {
    canvas: cnv,
    ctx,
    canvasWidth: W,
    canvasHeight: H,
} = useCanvas("#canvas");
const cos = Math.cos,
    sin = Math.sin,
    tan = Math.tan,
    rdm = Math.random,
    TAU = Math.PI * 2,
    PI = Math.PI;

let mx = NaN,
    my = NaN;

// simulate a costly function
function sleep(s: number) {
    const sleepStart = performance.now();
    while (performance.now() - sleepStart < s) {}
}

let working = (function* (): Generator<number, void, undefined> {
    yield* [];
})();

function animate() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, W, H);

    drawGrid(ctx);

    // sleep(100);

    // ctx.setTransform({ a: 1, b: 0, c: 0, d: 1, e: W / 2, f: H / 2 });
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, TAU);
    ctx.fillStyle = color("lightgreen").toString();
    ctx.fill();

    const res = working.next();
    if (!res.done) {
        // ctx.font = "16px 'Fira Code'";
        // ctx.textBaseline = "top";
        // ctx.fillStyle = "white";
        // ctx.fillText(res.value.toFixed(), mx, my - 12);

        ctx.beginPath();
        ctx.arc(mx, my, 24, -PI / 2, -PI / 2 + (res.value / 1000) * TAU);
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    requestAnimationFrame(animate);
}

cnv.addEventListener("mousemove", (e) => {
    mx = e.offsetX;
    my = e.offsetY;
});

addEventListener("keyup", (e) => {
    if ("a" === e.key) {
        const start = performance.now();

        function waiting() {
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "white";
            ctx.textBaseline = "top";
            ctx.fillText(`${performance.now() - start}`, 0, 0);

            if (performance.now() - start < 1000) {
                requestAnimationFrame(waiting);
            }
        }
        requestAnimationFrame(waiting);
    } else {
        const start = performance.now();
        working = (function* () {
            while (performance.now() - start < 1000) {
                yield performance.now() - start;
            }
        })();
    }
});

animate();
