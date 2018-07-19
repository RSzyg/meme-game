export default class Position {
    private x: number;
    private y: number;
    private blockX: number;
    private blockY: number;

    constructor() {
        this.x = this.y = this.blockX = this.blockY = 0;
    }

    public setX(x: number) {
        this.x = x;
        this.blockX = Math.floor(x / 40);
    }
    public setY(y: number) {
        this.y = y;
        this.blockY = Math.floor(y / 40);
    }
    public setPos(x: number, y: number) {
        this.setX(x);
        this.setY(y);
    }
    public get PixelX(): number {
        return this.x;
    }
    public get PixelY(): number {
        return this.y;
    }
    public get BlockX(): number {
        return this.blockX;
    }
    public get BlockY(): number {
        return this.blockY;
    }
}
