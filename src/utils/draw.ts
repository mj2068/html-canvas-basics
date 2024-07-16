import Vector from "../primitives/vector";

function clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawGrid(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas;
    const canvasEvenWidthCrispFix = canvas.width % 2 === 0 ? 0.5 : 0,
        canvasEvenHeightCrispFix = canvas.height % 2 === 0 ? 0.5 : 0;

    ctx.lineWidth = 1;

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
    ctx.strokeStyle = "gray";
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
    ctx.strokeStyle = "grey";
    ctx.stroke();
}

function drawSegment(
    ctx: CanvasRenderingContext2D,
    p1: Vector,
    p2: Vector,
    { strokeStyle = "lightblue" } = {},
) {
    ctx.beginPath();

    ctx.moveTo(...p1.tuple);
    ctx.lineTo(...p2.tuple);
    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
}

function drawPoint(
    ctx: CanvasRenderingContext2D,
    p: Vector,
    tag?: string,
    { radius = 4, fillStyle = "magenta" } = {},
) {
    ctx.beginPath();
    ctx.arc(...p.tuple, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();

    if (tag) {
        drawText(ctx, tag, p.x - 4, p.y + 4, { textAlign: "right" });
    }
}

function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x?: number,
    y?: number,
    {
        textAlign = "left",
        fillStyle = "white",
    }: { textAlign?: CanvasTextAlign; fillStyle?: string } = {},
) {
    ctx.font = "24px monospace";
    ctx.fillStyle = fillStyle;
    ctx.textBaseline = "middle";
    ctx.textAlign = textAlign;
    ctx.fillText(text, x ?? 4, y ?? 4);
}

export { drawSegment, drawPoint, clear, drawText, drawGrid };
