export default class Main {
  private height: number = 600;
  private width: number = 800;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    document.getElementById("display").appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  public createScene() {
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, 30, 30);
  }
}
