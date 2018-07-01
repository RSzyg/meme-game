import Storage from "./Storage";

export default class Role {
    // keyboardRecorder
    public keyboardRecorder: {[key: string]: number};
    // timer
    public verticalTimer: boolean;
    // basic properties
    public healthPoint: number;
    public maxHealthPoint: number;
    public attackPower: number;
    public moveSpeed: number;
    public initJumpSpeed: number;
    public jumpSpeed: number;
    private selfStatus: string; // left, right, up, down and blabla(default left)
    private tempStatus: string;
    // element properties
    private selfHeight: number;
    private selfWidth: number;
    private selfX: number;
    private selfY: number;

    constructor(data: { [key: string]: number }) {
        // keyboardRecorder
        this.keyboardRecorder = {};
        // timer
        this.verticalTimer = false;
        // element properties
        this.selfHeight = data.height;
        this.selfWidth = data.width;
        this.selfX = data.x;
        this.selfY = data.y;
        // basic properties
        this.selfStatus = "left";
        this.tempStatus = "left";
        this.healthPoint = this.maxHealthPoint = data.maxHealthPoint;
        this.attackPower = data.attackPower;
        this.moveSpeed = data.moveSpeed;
        this.initJumpSpeed = this.jumpSpeed = data.jumpSpeed;
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
        Storage.ctx.drawImage(
            Storage.images[this.selfStatus],
            this.selfX,
            this.selfY,
            this.selfWidth,
            this.selfHeight,
        );
    }

    // move
    public move(k: number) {
        this.y += Storage.dy[k] * this.jumpSpeed;
        this.x += Storage.dx[k] * this.moveSpeed;
        const midWidth = this.width / 2;
        const midHeight = this.height / 2;
        this.x = (this.x + midWidth + Storage.sceneWidth) % Storage.sceneWidth - midWidth;
        this.y = (this.y + midHeight + Storage.sceneHeight) % Storage.sceneHeight - midHeight;
        this.hitController();
    }

    // handle while hit
    public hitController() {
        if (this.y + this.height >= Storage.sceneHeight) {
            this.jumpSpeed = this.initJumpSpeed;
            this.verticalTimer = false;
        }
    }
}
