function useCanvas(elementID: string) {
    const canvasElm = document.querySelector<HTMLCanvasElement>(elementID);
    if (null === canvasElm)
        throw new Error(`couldn't find canvas element withe id: ${elementID}.`);

    let canvasWidth = (canvasElm.width = window.innerWidth);
    let canvasHeight = (canvasElm.height = window.innerHeight);

    addEventListener("resize", function () {
        canvasWidth = canvasElm.width = window.innerWidth;
        canvasHeight = canvasElm.height = window.innerHeight;
    });

    const ctx = canvasElm.getContext("2d");
    if (null === ctx) throw new Error(`couldn't get context.`);

    return { canvas: canvasElm, ctx, canvasWidth, canvasHeight };
}

export { useCanvas };
