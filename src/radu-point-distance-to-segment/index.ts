import { color } from "chroma.ts";
import { clear, drawPoint, drawSegment, drawText } from "../utils/draw";
import Vector from "../primitives/vector";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;

canvas.addEventListener("mousemove", (e) => {
    M.x = e.offsetX;
    M.y = e.offsetY;

    redraw();
});
canvas.addEventListener("click", (e) => {
    A.x = e.offsetX;
    A.y = e.offsetY;

    redraw();
});

const M = new Vector(NaN, NaN);
const A = new Vector(600, 300);
const B = new Vector(900, 450);

function redraw() {
    clear(ctx);

    drawPoint(ctx, A, "A");
    drawPoint(ctx, B, "B");
    drawPoint(ctx, M, "M", { fillStyle: "lightgreen" });
    drawSegment(ctx, A, B);
    // drawSegment(ctx, A, M);

    const result = distanceFromPointToSegment(M, A, B);
    drawPoint(ctx, result.point, "P", {
        radius: 2,
        fillStyle: color("gold").toString(),
    });
    drawSegment(ctx, result.point, M, {
        strokeStyle: color("greenyellow").toString(),
    });

    // *********************** debug *************************
    const AB = Vector.subtract(B, A);
    const AM = Vector.subtract(M, A);
    const nAB = AB.toNormalized();
    const nAM = AM.toNormalized();
    const debugStrings = [
        `           AB.magnitude: ${AB.magnitude}`,
        `           AM.magnitude: ${AM.magnitude}`,
        `                AM · AB: ${Vector.dot(AM, AB)}`,
        `               nAM · AB: ${Vector.dot(nAM, AB)}`,
        `              nAM · nAB: ${Vector.dot(nAM, nAB)}`,
        `               AM · nAB: ${Vector.dot(AM, nAB)}`,
        `AM · nAB / AB.magnitude: ${Vector.dot(AM, nAB) / AB.magnitude}`,
        `           PM.magnitude: ${result.value}`,
    ];
    // debugStrings.push(
    //     `             PM.magnitude: ${Vector.subtract(M, P).magnitude}`,
    // );
    // debugStrings.push(`PM.magnitude: ${Vector.subtract(M, A).magnitude}`);
    // debugStrings.push(`PM.magnitude: ${Vector.subtract(M, B).magnitude}`);
    drawLines(debugStrings);
}

function distanceFromPointToSegment(
    point: Vector,
    segmentStart: Vector,
    segmentEnd: Vector,
) {
    const { P, t } = projectPointToSegment(point, segmentStart, segmentEnd);

    if (t > 0 && t < 1) {
        return { point: P, value: P.distanceTo(point) };
    } else if (t <= 0) {
        return { point: segmentStart, value: segmentStart.distanceTo(point) };
    } else {
        return { point: segmentEnd, value: segmentEnd.distanceTo(point) };
    }
}

function projectPointToSegment(M: Vector, A: Vector, B: Vector) {
    const AB = Vector.subtract(B, A);
    const AM = Vector.subtract(M, A);

    // const nAB = AB.toNormalized();
    const nAB = Vector.normalizedOf(AB);

    const scalar = Vector.dot(AM, nAB);
    const t = Vector.dot(AM, nAB) / AB.magnitude;

    return { P: Vector.add(A, Vector.scale(nAB, scalar)), t };
}

function drawLines(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
        drawText(ctx, lines[i], 8, i * 24 + 8);
    }
}

redraw();
