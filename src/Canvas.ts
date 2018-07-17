/**
 * @prop {HTMLCanvasElement} canvas
 * @prop {CanvasRenderingContext2D} ctx
 */
export default class Canvas {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    /**
     * Create a canvas
     * @param zIndex - z-index of the canvas
     * @param height - height of the canvas
     * @param width - width of the canvas
     * @param position - position of the canvas(upperRight or default)
     */
    constructor(zIndex: string, height: number, width: number, position: string) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.zIndex = zIndex;
        this.canvas.style.position = "absolute";
        this.canvas.height = height;
        this.canvas.width = width;
        switch (position) {
            case "upperRight":
                this.canvas.style.right = "0px";
                this.canvas.style.top = "0px";
                break;
            default:
                break;
        }
        document.getElementById("display").appendChild(this.canvas);
    }
}
