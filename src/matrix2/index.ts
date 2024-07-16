import { useCanvas } from "../utils/canvas";

const { canvas, ctx } = useCanvas("canvas");
const canvasContainerDiv = document.querySelector("#canvas-container")!;
canvas.width = canvasContainerDiv.clientWidth;
canvas.height = canvasContainerDiv.clientHeight;
let canvasEvenWidthCrispFix = canvas.width % 2 === 0 ? 0.5 : 0;
let canvasEvenHeightCrispFix = canvas.height % 2 === 0 ? 0.5 : 0;
addEventListener("resize", function () {
    canvas.width = canvasContainerDiv.clientWidth;
    canvas.height = canvasContainerDiv.clientHeight;
    canvasEvenWidthCrispFix = canvas.width % 2 === 0 ? 0.5 : 0;
    canvasEvenHeightCrispFix = canvas.height % 2 === 0 ? 0.5 : 0;
});

function drawGrid() {
    // vertical grid lines
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + canvasEvenWidthCrispFix, 0);
    ctx.lineTo(canvas.width / 2 + canvasEvenWidthCrispFix, canvas.height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    for (let i = 100; i < canvas.width / 2; i += 100) {
        ctx.moveTo(canvas.width / 2 + i + canvasEvenWidthCrispFix, 0);
        ctx.lineTo(
            canvas.width / 2 + i + canvasEvenWidthCrispFix,
            canvas.height,
        );
        ctx.moveTo(canvas.width / 2 - i + canvasEvenWidthCrispFix, 0);
        ctx.lineTo(
            canvas.width / 2 - i + canvasEvenWidthCrispFix,
            canvas.height,
        );
    }
    ctx.strokeStyle = "white";
    ctx.stroke();

    // horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 + canvasEvenHeightCrispFix);
    ctx.lineTo(canvas.width, canvas.height / 2 + canvasEvenHeightCrispFix);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.beginPath();
    for (let i = 100; i < canvas.height / 2; i += 100) {
        ctx.moveTo(0, canvas.height / 2 + i + canvasEvenHeightCrispFix);
        ctx.lineTo(
            canvas.width,
            canvas.height / 2 + i + canvasEvenHeightCrispFix,
        );
        ctx.moveTo(0, canvas.height / 2 - i + canvasEvenHeightCrispFix);
        ctx.lineTo(
            canvas.width,
            canvas.height / 2 - i + canvasEvenHeightCrispFix,
        );
    }
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function animate() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    ctx.setTransform(a, b, c, d, e + canvas.width / 2, f + canvas.height / 2);
    ctx.fillStyle = "lightblue";
    ctx.fillRect(-100, -100, 200, 200);
    ctx.fillStyle = "gold";
    ctx.fillRect(200, 200, 100, 100);

    requestAnimationFrame(animate);
}

const matrixARangeLabel = document.querySelector<HTMLLabelElement>(
    "#matrix-a-range-label",
)!;
const matrixARangeInput =
    document.querySelector<HTMLInputElement>("#matrix-a-range")!;
matrixARangeInput.addEventListener("input", (e) => {
    if (e.target instanceof HTMLInputElement) {
        a = parseFloat(e.target.value);
        matrixARangeLabel.textContent = e.target.value;
    }
});

const matrixBRangeLabel = document.querySelector<HTMLLabelElement>(
    "#matrix-b-range-label",
)!;
const matrixBRangeInput =
    document.querySelector<HTMLInputElement>("#matrix-b-range")!;
matrixBRangeInput.addEventListener("input", (e) => {
    if (e.target instanceof HTMLInputElement) {
        b = parseFloat(e.target.value);
        matrixBRangeLabel.textContent = e.target.value;
    }
});

const matrixCRangeLabel = document.querySelector<HTMLLabelElement>(
    "#matrix-c-range-label",
)!;
const matrixCRangeInput =
    document.querySelector<HTMLInputElement>("#matrix-c-range")!;
matrixCRangeInput.addEventListener("input", (e) => {
    if (e.target instanceof HTMLInputElement) {
        c = parseFloat(e.target.value);
        matrixCRangeLabel.textContent = e.target.value;
    }
});

const matrixDRangeLabel = document.querySelector<HTMLLabelElement>(
    "#matrix-d-range-label",
)!;
const matrixDRangeInput =
    document.querySelector<HTMLInputElement>("#matrix-d-range")!;
matrixDRangeInput.addEventListener("input", (e) => {
    if (e.target instanceof HTMLInputElement) {
        d = parseFloat(e.target.value);
        matrixDRangeLabel.textContent = e.target.value;
    }
});

const matrixERangeLabel = document.querySelector<HTMLLabelElement>(
    "#matrix-e-range-label",
)!;
const matrixERangeInput =
    document.querySelector<HTMLInputElement>("#matrix-e-range")!;
matrixERangeInput.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement) {
        e = event.target.valueAsNumber;
        matrixERangeLabel.textContent = event.target.value;
    }
});

const matrixFRangeLabel = document.querySelector<HTMLLabelElement>(
    "#matrix-f-range-label",
)!;
const matrixFRangeInput =
    document.querySelector<HTMLInputElement>("#matrix-f-range")!;
matrixFRangeInput.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement) {
        f = event.target.valueAsNumber;
        matrixFRangeLabel.textContent = event.target.value;
    }
});

matrixARangeLabel.textContent = matrixARangeInput.value;
matrixBRangeLabel.textContent = matrixBRangeInput.value;
matrixCRangeLabel.textContent = matrixCRangeInput.value;
matrixDRangeLabel.textContent = matrixDRangeInput.value;
matrixERangeLabel.textContent = matrixERangeInput.value;
matrixFRangeLabel.textContent = matrixFRangeInput.value;
let a = Number(matrixARangeInput.value),
    b = Number(matrixBRangeInput.value),
    c = Number(matrixCRangeInput.value),
    d = Number(matrixDRangeInput.value),
    e = Number(matrixERangeInput.value),
    f = Number(matrixFRangeInput.value);

animate();
