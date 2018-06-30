export default class Role {
    public images: { [key: string]: HTMLImageElement };
    // canvas
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    // basic properties
    public healthPoint: number;
    public maxHealthPoint: number;
    public attackPower: number;
    public moveSpeed: number;
    public jumpSpeed: number;
    private selfStatus: string; // left, right, up, down and blabla(default left)
    // element properties
    private selfHeight: number;
    private selfWidth: number;
    private selfX: number;
    private selfY: number;

    constructor(data: { [key: string]: number }) {
        // element properties
        this.selfHeight = data.height;
        this.selfWidth = data.width;
        this.selfX = data.x;
        this.selfY = data.y;
        // basic properties
        this.selfStatus = "left";
        this.healthPoint = this.maxHealthPoint = data.maxHealthPoint;
        this.attackPower = data.attackPower;
        this.moveSpeed = data.moveSpeed;
        this.jumpSpeed = data.jumpSpeed;
    }

    // element properties setter & getter
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

    public get height(): number {
        return this.selfHeight;
    }
    public set height(height: number) {
        this.selfHeight = height;
    }

    public get width(): number {
        return this.selfWidth;
    }
    public set width(width: number) {
        this.selfWidth = width;
    }

    public get status(): string {
        return this.selfStatus;
    }
    public set status(status: string) {
        this.selfStatus = status;
    }

    // rendering
    public render() {
        this.ctx.drawImage(
            this.images[this.selfStatus],
            this.selfX,
            this.selfY,
            this.selfWidth,
            this.selfHeight,
        );
    }

    // remove
    public remove() {
        this.ctx.fillStyle = "#C0C0C0";
        this.ctx.fillRect(
            this.selfX,
            this.selfY,
            this.selfWidth,
            this.selfHeight,
        );
    }

    // move
    public move(dir: string) {
        this.remove();
        this.status = dir;
        switch (dir) {
            case "up":
                break;
            case "down":
                break;
            case "left":
                this.selfX -= this.moveSpeed;
                break;
            case "right":
                this.selfX += this.moveSpeed;
                break;
            default:
                break;
        }
        this.render();
    }
}
