let canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d")!;

// let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraOffset = { x: 0, y: 0 };
let cameraZoom = 1;
let MAX_ZOOM = 160;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;

let mousePos = { x: 0, y: 0 };
let origin = { x: 0, y: 0 };
let lastDragPos = { x: 0, y: 0 };
let isDragging = false;

function draw() {
    // clear the last frame
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // or (be aware that this way will introduce a resize issue and remember to handle it in resize events)
    // ctx.setTransform(1, 0, 0, 1, 0, 0)
    // ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

    // zooming
    ctx.setTransform(cameraZoom, 0, 0, cameraZoom, origin.x, origin.y);

    // panning
    ctx.translate(cameraOffset.x, cameraOffset.y);

    // or combine zooming and panning into a single transform
    // ctx.setTransform(cameraZoom, 0, 0, cameraZoom, origin.x + cameraZoom * cameraOffset.x, origin.y + cameraZoom * cameraOffset.y)

    ctx.fillStyle = "orange";
    ctx.fillRect(-50, -50, 100, 100);

    ctx.resetTransform();
    ctx.font = "16px monospace";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";
    ctx.fillText(`${mousePos.x}, ${mousePos.y}`, 0, canvas.height);

    requestAnimationFrame(draw);
}

function onPointerDown(e: MouseEvent) {
    isDragging = true;

    lastDragPos.x = e.clientX / cameraZoom;
    lastDragPos.y = e.clientY / cameraZoom;
}

function onPointerUp(_e: MouseEvent) {
    isDragging = false;
}

function onPointerMove(e: MouseEvent) {
    const { x, y } = { x: e.clientX, y: e.clientY };
    mousePos.x = x;
    mousePos.y = y;
    if (isDragging) {
        // zzm: lastDragPos is only used for updating cameraOffset
        const deltaX = x / cameraZoom - lastDragPos.x;
        const deltaY = y / cameraZoom - lastDragPos.y;
        cameraOffset.x += deltaX;
        cameraOffset.y += deltaY;
        lastDragPos.x = x / cameraZoom;
        lastDragPos.y = y / cameraZoom;
    }
}

const clamp = (val: number, min: number, max: number) =>
    Math.max(Math.min(val, max), min);

function adjustZoom(zoomAmount: number, zoomFactor: number) {
    if (!isDragging) {
        let newZoom = cameraZoom;
        if (zoomAmount) {
            newZoom = clamp(cameraZoom + zoomAmount, MIN_ZOOM, MAX_ZOOM);
        } else if (zoomFactor) {
            newZoom = clamp(cameraZoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);
        }
        const oldOrigin = {
            x: origin.x,
            y: origin.y,
        };
        const scaleBy = newZoom / cameraZoom;
        origin = {
            x: mousePos.x - (mousePos.x - oldOrigin.x) * scaleBy,
            y: mousePos.y - (mousePos.y - oldOrigin.y) * scaleBy,
        };
        cameraZoom = newZoom;
    }
}

canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("wheel", (e) => {
    // adjustZoom(-e.deltaY*SCROLL_SENSITIVITY)
    e.deltaY < 0 ? adjustZoom(0, 1.1) : adjustZoom(0, 0.9);
});

// Ready, set, go
draw();

export {};
