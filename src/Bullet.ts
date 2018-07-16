import Storage from "./Storage";

export default class Bullet {
    public direction: number; // left, up, right, down
    public speed: number;
    public hostId: string;
    private selfX: number;
    private selfY: number;
    private selfWidth: number = 20;
    private selfHeight: number = 20;
    constructor(x: number, y: number, speed: number, hostId: string, direction: string) {
        this.selfX = x;
        this.selfY = y;
        this.speed = speed;
        this.hostId = hostId;
        if (direction === "left") {
            this.direction = 0;
        } else {
            this.direction = 2;
        }
    }

    public get x(): number {
        return this.selfX;
    }

    public set x(x: number) {
        this.selfX = x;
    }

    public get y(): number {
        return this.selfY;
    }

    public set y(y: number) {
        this.selfY = y;
    }

    public get width(): number {
        return this.selfWidth;
    }

    public set width(width: number) {
        this.selfWidth = width;
    }

    public get height(): number {
        return this.selfHeight;
    }

    public set height(height: number) {
        this.selfHeight = height;
    }

    public move() {
        this.x += this.speed * Storage.dx[this.direction];
        this.x = (this.x + Storage.sceneWidth) % Storage.sceneWidth;
    }

    public render() {
        Storage.main.ctx.drawImage(
            Storage.images.funny,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }
}
