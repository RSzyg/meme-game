export default class Canvas {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
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
