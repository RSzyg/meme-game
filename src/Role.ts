import Storage from "./Storage";

export default class Role {
    private static healthBarHeight: number = 8;
    private static healthBarWidth: number = 80;
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
        const color: string[] = ["#C62828", "#EF6C00", "#43A047", "#43A047"];
        const index: number = Math.floor((this.healthPoint + 0.2 * this.maxHealthPoint) / (0.4 * this.maxHealthPoint));
        Storage.roleCtx.strokeRect(
            this.x - (Role.healthBarWidth - this.width) / 2,
            this.y - 12,
            Role.healthBarWidth,
            Role.healthBarHeight,
        );
        Storage.roleCtx.fillStyle = color[index];
        Storage.roleCtx.fillRect(
            this.x - (Role.healthBarWidth - this.width) / 2 + 1,
            this.y - 11,
            this.healthPoint / this.maxHealthPoint * Role.healthBarWidth * 0.98,
            Role.healthBarHeight - 2,
        );
        Storage.roleCtx.drawImage(
            Storage.images[this.selfStatus],
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }
}
