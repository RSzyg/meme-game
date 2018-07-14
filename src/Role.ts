import Storage from "./Storage";

export default class Role {
    private static healthBarHeight: number = 8;
    private static healthBarWidth: number;
    // keyboardRecorder
    public keyboardRecorder: {[key: string]: number};
    // timer
    public attackTimer: number;
    public verticalTimer: boolean;
    // basic properties
    public healthPoint: number;
    public maxHealthPoint: number;
    public attackPower: number;
    public attackRange: number;
    public moveSpeed: number;
    public initJumpSpeed: number;
    public jumpSpeed: number;
    public attackId: string[];
    public horizontalStatus: string; // left, right (default right)
    public verticalStatus: string; // up, down (default undefined)
    public roleStatus: string; // dead, attack (default undefined)
    // element properties
    private roleId: string;
    private selfHeight: number;
    private selfWidth: number;
    private selfX: number;
    private selfY: number;

    constructor(data: { [key: string]: any }) {
        this.roleId = data.roleId;
        // keyboardRecorder
        this.keyboardRecorder = {};
        // timer
        this.attackTimer = 0;
        this.verticalTimer = false;
        // element properties
        this.selfHeight = data.height;
        this.selfWidth = Role.healthBarWidth = data.width;
        this.selfX = data.x;
        this.selfY = data.y;
        // basic properties
        this.horizontalStatus = "left";
        this.verticalStatus = undefined;
        this.roleStatus = undefined;
        this.healthPoint = this.maxHealthPoint = data.maxHealthPoint;
        this.attackPower = data.attackPower;
        this.attackRange = data.attackRange;
        this.moveSpeed = data.moveSpeed;
        this.initJumpSpeed = this.jumpSpeed = data.jumpSpeed;
        this.attackId = [];
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

    public get priStatus(): string {
        if (this.roleStatus) {
            return this.roleStatus;
        } else if (this.verticalStatus) {
            return this.verticalStatus;
        } else {
            return this.horizontalStatus;
        }
    }

    // handle while dead
    public deadthController() {
        if (this.healthPoint < 0) {
            this.healthPoint = 0;
            this.roleStatus = "dead";
        }
    }

    // rendering
    public render() {
        this.renderRole();
        this.renderHealthBar();
        this.renderMiniRole();
    }

    // remove
    public removeFlag(x: number, y: number, k: number) {
        for (let r = this.y; r < this.y + this.height; r++) {
            const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
            for (let c = this.x; c < this.x + this.width; c++) {
                const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                if (Storage.fullyMap[nr][nc] === 0) {
                    Storage.fullyMap[nr][nc] = +this.roleId;
                }
            }
        }
        if (Math.abs(Storage.dx[k])) {
            if (Storage.dx[k] > 0) {
                for (let r = this.y; r < this.y + this.height; r++) {
                    const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                    const nx = (x > this.x) ? (this.x + Storage.sceneWidth) : this.x;
                    for (let c = x; c < nx; c++) {
                        const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                        if (Storage.fullyMap[nr][nc] === +this.roleId) {
                            Storage.fullyMap[nr][nc] = 0;
                        }
                    }
                }
            } else {
                for (let r = this.y; r < this.y + this.height; r++) {
                    const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                    const nx = (x < this.x) ? (x + Storage.sceneWidth) : x;
                    for (let c = this.x + this.width; c < nx + this.width; c++) {
                        const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                        if (Storage.fullyMap[nr][nc] === +this.roleId) {
                            Storage.fullyMap[nr][nc] = 0;
                        }
                    }
                }
            }
        } else if (Math.abs(Storage.dy[k])) {
            if (Storage.dy[k] > 0) {
                const ny = (y > this.y) ? (this.y + Storage.sceneHeight) : this.y;
                for (let r = y; r < ny; r++) {
                    const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                    for (let c = this.x; c < this.x + this.width; c++) {
                        const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                        if (Storage.fullyMap[nr][nc] === +this.roleId) {
                            Storage.fullyMap[nr][nc] = 0;
                        }
                    }
                }
            } else {
                const ny = (y < this.y) ? (y + Storage.sceneHeight) : y;
                for (let r = this.y + this.height; r < ny + this.height; r++) {
                    const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                    for (let c = this.x; c < this.x + this.width; c++) {
                        const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                        if (Storage.fullyMap[nr][nc] === +this.roleId) {
                            Storage.fullyMap[nr][nc] = 0;
                        }
                    }
                }
            }
        }
    }

    // render the range of attack
    public renderRange() {
        if (this.horizontalStatus === "left") {
            Storage.barCtx.fillStyle = "rgba(102, 204, 255, 0.6)";
            Storage.barCtx.beginPath();
            Storage.barCtx.moveTo(this.x - this.attackRange, this.y - 8);
            Storage.barCtx.lineTo(this.x - this.attackRange, this.y + this.height + 7);
            Storage.barCtx.lineTo(this.x, this.y + this.height - 1);
            Storage.barCtx.lineTo(this.x, this.y);
            Storage.barCtx.fill();
        } else if (this.horizontalStatus === "right") {
            Storage.barCtx.fillStyle = "rgba(102, 204, 255, 0.6)";
            Storage.barCtx.beginPath();
            Storage.barCtx.moveTo(this.x + this.width + this.attackRange - 1, this.y - 8);
            Storage.barCtx.lineTo(this.x + this.width + this.attackRange - 1, this.y + this.height + 7);
            Storage.barCtx.lineTo(this.x + this.width, this.y + this.height - 1);
            Storage.barCtx.lineTo(this.x + this.width, this.y);
            Storage.barCtx.fill();
        }
    }

    private renderRole() {
        Storage.mainCtx.drawImage(
            Storage.images[this.priStatus],
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }

    private renderHealthBar() {
        const index: number = Math.floor((this.healthPoint + 0.2 * this.maxHealthPoint) / (0.4 * this.maxHealthPoint));
        Storage.barCtx.strokeStyle = "#000000";
        Storage.barCtx.strokeRect(
            this.x - (Role.healthBarWidth - this.width) / 2,
            this.y - 16,
            Role.healthBarWidth,
            Role.healthBarHeight,
        );
        Storage.barCtx.fillStyle = Storage.healthBarColor[index];
        Storage.barCtx.fillRect(
            this.x - (Role.healthBarWidth - this.width) / 2 + 1,
            this.y - 15,
            this.healthPoint / this.maxHealthPoint * Role.healthBarWidth * 0.98,
            Role.healthBarHeight - 2,
        );
    }

    private renderMiniRole() {
        let ctx: CanvasRenderingContext2D;
        let color: string;
        if (this.roleId === "2") {
            ctx = Storage.miniSelfRoleCtx;
            color = "green";
        } else {
            ctx = Storage.miniOtherRoleCtx;
            color = "red";
        }
        ctx.arc(
            (this.x + this.width / 2) / Storage.sceneWidth * 200,
            (this.y + this.height / 2) / Storage.sceneHeight * 150,
            (this.width / 2) / Storage.sceneWidth * 200,
            0,
            2 * Math.PI,
        );
        ctx.fillStyle = color;
        ctx.fill();
    }
}
