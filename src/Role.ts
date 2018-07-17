import Storage from "./Storage";

/**
 * Class Role
 * This class include role's properties
 * @prop {number} healthBarHeight
 * @prop {number} healthBarWidth
 * @prop {number} attackKeepTimer - Record attack keep time
 * @prop {boolean} verticalTimer - Record vertical move time
 * @prop {string} weapon - Record role's weapon type
 * @prop {number} healthPoint - Role's HP
 * @prop {number} maxHealthPoint - Role's max HP
 * @prop {number} attackPower - Role's attack power
 * @prop {number} attackRange - Role's attack range
 * @prop {number} moveSpeed - Role's move speed
 * @prop {number} initJumpSpeed - Role's initial jump speed
 * @prop {number} jumpSpeed - Role's jump speed
 * @prop {string[]} attackId - Other roles' id in this role's attack range
 * @prop {string} horizonDirection - Role's move direction in horizon
 * @prop {string} status - Role's move status(up, down, walk)
 * @prop {string} action - Role's action status
 * @prop {string} roleId - Role's id
 * @prop {number} selfHeight - Role's height
 * @prop {number} selfWidth - Role's width
 * @prop {number} selfX - Role's x axis
 * @prop {number} selfY - Role's y axis
 */
export default class Role {
    private static healthBarHeight: number = 8;
    private static healthBarWidth: number;
    // timer
    public attackKeepTimer: number;
    public verticalTimer: boolean;
    // basic properties
    public weapon: string;
    public healthPoint: number;
    public maxHealthPoint: number;
    public attackPower: number;
    public attackRange: number;
    public moveSpeed: number;
    public initJumpSpeed: number;
    public jumpSpeed: number;
    public attackId: string[];
    public horizonDirection: string; // left, right (default right)
    public status: string; // up, down, walk(default walk)
    public action: string; // dead, attack (default undefined)
    // element properties
    private roleId: string;
    private selfHeight: number;
    private selfWidth: number;
    private selfX: number;
    private selfY: number;

    /**
     * Create a role
     * @param {object} data - Initial data of role
     */
    constructor(data: { [key: string]: any }) {
        this.roleId = data.roleId;
        // timer
        this.attackKeepTimer = 0;
        this.verticalTimer = false;
        // element properties
        this.selfHeight = data.height;
        this.selfWidth = Role.healthBarWidth = data.width;
        this.selfX = data.x;
        this.selfY = data.y;
        // basic properties
        this.weapon = data.weapon;
        this.horizonDirection = "left";
        this.status = "walk";
        this.action = undefined;
        this.healthPoint = this.maxHealthPoint = data.maxHealthPoint;
        this.attackPower = data.attackPower;
        this.attackRange = data.attackRange;
        this.moveSpeed = data.moveSpeed;
        this.initJumpSpeed = this.jumpSpeed = data.jumpSpeed;
        this.attackId = [];
    }

    /**
     * Get x axis
     * @returns {number}
     */
    public get x(): number {
        return this.selfX;
    }
    /**
     * Set x axis
     * @param {number} x
     */
    public set x(x: number) {
        this.selfX = x;
    }

    /**
     * Get y axis
     * @returns {number}
     */
    public get y(): number {
        return this.selfY;
    }
    /**
     * Set y axis
     * @param {number} y
     */
    public set y(y: number) {
        this.selfY = y;
    }

    /**
     * Get role's height
     * @returns {number}
     */
    public get height(): number {
        return this.selfHeight;
    }
    /**
     * Set role's height
     * @param {number} height
     */
    public set height(height: number) {
        this.selfHeight = height;
    }

    /**
     * Get role's width
     * @returns {number} width
     */
    public get width(): number {
        return this.selfWidth;
    }
    /**
     * Set role's width
     * @param {number} width
     */
    public set width(width: number) {
        this.selfWidth = width;
    }

    /**
     * Get prior status of role
     * @returns {string}
     */
    public get priStatus(): string {
        if (this.action) {
            return this.action;
        } else if (this.status) {
            return this.status;
        }
    }

    /**
     * Control the role's deadth
     */
    public deadthController() {
        if (this.healthPoint < 0) {
            this.healthPoint = 0;
            this.action = "dead";
        }
    }

    /**
     * Rendering about role
     */
    public render() {
        this.renderRole();
        this.renderHealthBar();
        this.renderMiniRole();
    }

    /**
     * Remove the flag of the role in the map
     * @param {number} x - Old x axis
     * @param {number} y - Old y axis
     * @param {number} k - Direction index of Storage.dx or Storage.dy
     */
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

    /**
     * Rendering the attack range
     */
    public renderRange() {
        if (this.horizonDirection === "left") {
            Storage.bar.ctx.fillStyle = "rgba(102, 204, 255, 0.6)";
            Storage.bar.ctx.beginPath();
            Storage.bar.ctx.moveTo(this.x - this.attackRange, this.y - 8);
            Storage.bar.ctx.lineTo(this.x - this.attackRange, this.y + this.height + 7);
            Storage.bar.ctx.lineTo(this.x, this.y + this.height - 1);
            Storage.bar.ctx.lineTo(this.x, this.y);
            Storage.bar.ctx.fill();
        } else if (this.horizonDirection === "right") {
            Storage.bar.ctx.fillStyle = "rgba(102, 204, 255, 0.6)";
            Storage.bar.ctx.beginPath();
            Storage.bar.ctx.moveTo(this.x + this.width + this.attackRange - 1, this.y - 8);
            Storage.bar.ctx.lineTo(this.x + this.width + this.attackRange - 1, this.y + this.height + 7);
            Storage.bar.ctx.lineTo(this.x + this.width, this.y + this.height - 1);
            Storage.bar.ctx.lineTo(this.x + this.width, this.y);
            Storage.bar.ctx.fill();
        }
    }

    /**
     * Rendering the role
     */
    private renderRole() {
        let name: string = this.priStatus + "-" + this.horizonDirection;
        if (this.priStatus === "dead") {
            name = "dead";
        }
        Storage.main.ctx.drawImage(
            Storage.images[name],
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }

    /**
     * Rendering the health bar of the role
     */
    private renderHealthBar() {
        const index: number = Math.floor((this.healthPoint + 0.2 * this.maxHealthPoint) / (0.4 * this.maxHealthPoint));
        Storage.bar.ctx.strokeStyle = "#000000";
        Storage.bar.ctx.strokeRect(
            this.x - (Role.healthBarWidth - this.width) / 2,
            this.y - 16,
            Role.healthBarWidth,
            Role.healthBarHeight,
        );
        Storage.bar.ctx.fillStyle = Storage.healthBarColor[index];
        Storage.bar.ctx.fillRect(
            this.x - (Role.healthBarWidth - this.width) / 2 + 1,
            this.y - 15,
            this.healthPoint / this.maxHealthPoint * Role.healthBarWidth * 0.98,
            Role.healthBarHeight - 2,
        );
    }

    /**
     * Rendering the mini-role
     */
    private renderMiniRole() {
        let ctx: CanvasRenderingContext2D;
        let color: string;
        if (this.roleId === "2") {
            ctx = Storage.miniSelfRole.ctx;
            color = "green";
        } else {
            ctx = Storage.miniOtherRole.ctx;
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
