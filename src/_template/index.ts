import { color } from "chroma.ts";
import { useCanvas } from "../utils/canvas";

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
