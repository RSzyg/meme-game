import Role from "./Role";

export default class Main {
  public images: {[key: string]: HTMLImageElement};
  private canvasHeight: number = 600;
  private canvasWidth: number = 800;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private map: number[];
  private roles: Role[];
  constructor() {
    this.images = {};
    this.canvas = document.createElement("canvas");
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
    document.getElementById("display").appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.map = [];
    this.roles = [];
  }

  public createScene() {
    const data = {
      width: 54,
      height: 54,
      x: 0,
      y: this.canvasHeight - 54,
      maxHealthPoint: 100,
      attackPower: 3,
      moveSpeed: 6,
      jumpSpeed: 10,
    };
    this.roles[0] = new Role(data);
    this.roles[0].images = this.images;
    this.roles[0].canvas = this.canvas;
    this.roles[0].ctx = this.ctx;
    this.roles[0].render();
  }
}
