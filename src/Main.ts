import AIController from "./AIController";
import Bullet from "./Bullet";
import Canvas from "./Canvas";
import Role from "./Role";
import Storage from "./Storage";

/**
 * Class Main
 * The main part of the game. Including scene and roles interaction.
 * @prop {AIController} magicAI - An AI Controller
 * @prop {object} roles - All roles in the scene
 * @prop {object} bullets - All bullets in the scene
 * @prop {object} keydown - Record the key down
 * @prop {object} keycount - Record the key executed times
 * @prop {number} bulletId - The auto increment id of bullet
 */
export default class Main {
    private magicAI: AIController;
    private roles: {[key: string]: Role};
    private bullets: {[key: string]: Bullet};
    private keydown: {[key: string]: boolean};
    private keycount: {[key: string]: number};
    private bulletId: number;

    /**
     * Create main environment
     */
    constructor() {
        this.roles = {};
        this.bullets = {};
        this.keydown = {};
        this.keycount = {};
        this.bulletId = 0;
    }

    public Role(roleId: string): Role {
        return this.roles[roleId];
    }
    /**
     * Create a scene
     * The entry method
     */
    public createScene() {
        document.addEventListener("keydown", (e) => this.keyboardController(e));
        document.addEventListener("keyup", (e) => this.keyboardController(e));

        /** Create grids canvas  */
        Storage.grids = new Canvas("3", Storage.sceneHeight, Storage.sceneWidth, null);
        /** Create mini-self-role canvas */
        Storage.miniSelfRole = new Canvas("4", 150, 200, "upperRight");
        /** Create mini-other-role canvas */
        Storage.miniOtherRole = new Canvas("4", 150, 200, "upperRight");
        /** Create mini-map canvas */
        Storage.miniMap = new Canvas("3", 150, 200, "upperRight");
        /** Create bar canvas */
        Storage.bar = new Canvas("2", Storage.sceneHeight, Storage.sceneWidth, null);
        /** Create main canvas */
        Storage.main = new Canvas("1", Storage.sceneHeight, Storage.sceneWidth, null);

        this.renderMap();
        this.renderGrids();

        this.createRole("2");
        this.createRole("3");

        this.magicAI = new AIController(this.roles);
        this.renderMiniMap();
        this.update();

        this.magicAI.start();
    }
    public aiKeyboardController(type: string, keyCode: number) {
        if (type === "keydown") {
            this.keydown[keyCode] = true;
            if (!this.keycount[keyCode]) {
                this.keycount[keyCode] = 1;
            }
        } else if (type === "keyup") {
            this.keydown[keyCode] = false;
            this.keycount[keyCode] = 0;
        }
    }
    /**
     * Render the map
     */
    private renderMap() {
        for (let r = 0; r < Storage.simplifiedMap.length; r++) {
            for (let c = 0; c < Storage.simplifiedMap[r].length; c++) {
                if (Storage.simplifiedMap[r][c] === 1) {
                    Storage.main.ctx.fillStyle = "#ffffff";
                    Storage.main.ctx.fillRect(c * 40, r * 40, 40, 40);
                    Storage.main.ctx.strokeRect(c * 40, r * 40, 40, 40);
                }
            }
        }
    }

    /**
     * Render grids
     */
    private renderGrids() {
        Storage.grids.ctx.globalAlpha = 0.3;
        Storage.grids.ctx.beginPath();
        for (let r = 39; r < Storage.sceneHeight - 1; r += 40) {
            Storage.grids.ctx.moveTo(0, r);
            Storage.grids.ctx.lineTo(Storage.sceneWidth, r);
        }
        for (let c = 39; c < Storage.sceneWidth - 1; c += 40) {
            Storage.grids.ctx.moveTo(c, 0);
            Storage.grids.ctx.lineTo(c, Storage.sceneWidth);
        }
        Storage.grids.ctx.stroke();
    }

    /**
     * Render the mini-map
     */
    private renderMiniMap() {
        Storage.miniMap.ctx.globalAlpha = 0.4;
        Storage.miniMap.ctx.fillStyle = "#ffffff";
        Storage.miniMap.ctx.fillRect(0, 0, 200, 160);
        for (let r = 0; r < Storage.simplifiedMap.length; r++) {
            for (let c = 0; c < Storage.simplifiedMap[r].length; c++) {
                if (Storage.simplifiedMap[r][c] === 1) {
                    Storage.miniMap.ctx.fillStyle = "#000000";
                    Storage.miniMap.ctx.fillRect(c * 10, r * 10, 10, 10);
                }
            }
        }
    }

    /**
     * Create a role
     * @param {string} id The role's id
     */
    private createRole(id: string) {
        /**
         * Init basic infomation of roles
         */
        const data = {
            roleId: id,
            width: 40,
            height: 40,
            x: (+id - 2) * 600,
            y: Storage.sceneHeight - 54,
            maxHealthPoint: 100,
            attackPower: 3,
            attackRange: 12,
            moveSpeed: 4,
            jumpSpeed: 19,
            weapon: id === "2" ? null : "gun",
        };
        this.roles[id] = new Role(data);
    }

    /**
     * Pretreatment of keyboard event
     * @param {KeyboardEvent} e - The keyboard event
     */
    private keyboardController(e: KeyboardEvent) {
        if (e.type === "keydown") {
            this.keydown[e.code] = true;
            if (!this.keycount[e.code]) {
                this.keycount[e.code] = 1;
            }
        } else if (e.type === "keyup") {
            this.keydown[e.code] = false;
            this.keycount[e.code] = 0;
        }
    }

    /**
     * Clear the scene
     */
    private clearScene() {
        Storage.main.canvas.height = Storage.main.canvas.height;
        Storage.bar.canvas.height = Storage.bar.canvas.height;
        Storage.miniSelfRole.canvas.height = Storage.miniSelfRole.canvas.height;
        Storage.miniSelfRole.ctx.globalAlpha = 0.5;
        Storage.miniOtherRole.canvas.height = Storage.miniOtherRole.canvas.height;
        Storage.miniOtherRole.ctx.globalAlpha = 0.5;
    }

    /**
     * Update the scene 60fps
     * ------------------------------------
     * Player1
     * code: ArrowUp - Jump
     * code: ArrowLeft - Move left
     * code: ArrowRight - Move right
     * code: KeyZ - Attack
     * code: KeyX - Defense
     * ------------------------------------
     * Player2(AI?)
     * code: Jump - Jump
     * code: MoveLeft - Move left
     * code: MoveRight - Move right
     * code: Attack - Attack
     * code: Defense - Defense
     */
    private update() {
        this.clearScene();
        /**
         * Player1
         * id: "2"
         */
        if (this.roles["2"].action !== "dead") {
            if (this.keydown.ArrowUp) {
                /**
                 * key: ↑
                 * code: ArrowUp
                 * action: jump
                 */
                if (!this.roles["2"].verticalTimer) {
                    this.roles["2"].jumpSpeed = this.roles["2"].initJumpSpeed;
                    this.roles["2"].verticalTimer = true;
                }
            }
            if (this.keydown.ArrowLeft) {
                /**
                 * key: ←
                 * code: ArrowLeft
                 * action: move left
                 */
                if (!this.keydown.ArrowRight) {
                    this.roles["2"].horizonDirection = "left";
                    this.move("2", 0);
                }
            }
            if (this.keydown.ArrowRight) {
                /**
                 * key: →
                 * code: ArrowRight
                 * action: move right
                 */
                if (!this.keydown.ArrowLeft) {
                    this.roles["2"].horizonDirection = "right";
                    this.move("2", 2);
                }
            }
            if (this.roles["2"].verticalTimer) {
                if (this.roles["2"].jumpSpeed > 0) {
                    this.roles["2"].status = "up";
                    this.move("2", 1);
                } else {
                    this.roles["2"].status = "down";
                    this.move("2", 3);
                }
                this.roles["2"].jumpSpeed--;
            } else {
                this.roles["2"].y++;
                if (!this.collisionJudge(this.roles["2"], 3)) {
                    this.roles["2"].y--;
                    this.roles["2"].jumpSpeed = -1;
                    this.roles["2"].verticalTimer = true;
                }
            }
            if (this.roles["2"].action === undefined && this.keycount.KeyZ === 1) {
                /**
                 * key: z
                 * code: KeyZ
                 * action: attack
                 */
                this.roles["2"].action = "attack";
                this.roles["2"].attackKeepTimer = 10;
                switch (this.roles["2"].weapon) {
                    case "gun":
                        this.bullets[this.bulletId++] = new Bullet(
                            this.roles["2"].x + 20,
                            this.roles["2"].y + this.roles["2"].height / 2,
                            300,
                            6,
                            "2",
                            this.roles["2"].horizonDirection,
                        );
                        break;
                    default:
                        for (const aid of this.roles["2"].attackId) {
                            if (this.roles[aid].action !== "defense") {
                                this.roles[aid].healthPoint -= this.roles["2"].attackPower;
                            }
                        }
                        break;
                }
                this.keycount.KeyZ++;
            }
            if (this.keydown.KeyX) {
                /**
                 * key: x
                 * code: KeyX
                 * action: defense
                 */
                if (this.roles["2"].action === undefined) {
                    this.roles["2"].action = "defense";
                }
            } else if (this.roles["2"].action === "defense") {
                this.roles["2"].action = undefined;
            }
        }
        /**
         * Player2
         * id: "3"
         */
        if (this.roles["3"].action !== "dead") {
            if (this.keydown.Jump) {
                /**
                 * key: undefined
                 * code: Jump
                 * action: jump
                 */
                if (!this.roles["3"].verticalTimer) {
                    this.roles["3"].jumpSpeed = this.roles["3"].initJumpSpeed;
                    this.roles["3"].verticalTimer = true;
                }
            }
            if (this.keydown.MoveLeft) {
                /**
                 * key: undefined
                 * code: MoveLeft
                 * action: move left
                 */
                if (!this.keydown.MoveRight) {
                    this.roles["3"].horizonDirection = "left";
                    this.move("3", 0);
                }
            }
            if (this.keydown.MoveRight) {
                /**
                 * key: undefined
                 * code: MoveRight
                 * action: move right
                 */
                if (!this.keydown.MoveLeft) {
                    this.roles["3"].horizonDirection = "right";
                    this.move("3", 2);
                }
            }
            if (this.roles["3"].verticalTimer) {
                if (this.roles["3"].jumpSpeed > 0) {
                    this.roles["3"].status = "up";
                    this.move("3", 1);
                } else {
                    this.roles["3"].status = "down";
                    this.move("3", 3);
                }
                this.roles["3"].jumpSpeed--;
            } else {
                this.roles["3"].y++;
                if (!this.collisionJudge(this.roles["3"], 3)) {
                    this.roles["3"].y--;
                    this.roles["3"].jumpSpeed = -1;
                    this.roles["3"].verticalTimer = true;
                }
            }
            if (this.roles["3"].action === undefined && this.keycount.Attack === 1) {
                /**
                 * key: undefined
                 * code: Attack
                 * action: attack
                 */
                this.roles["3"].action = "attack";
                this.roles["3"].attackKeepTimer = 10;
                switch (this.roles["3"].weapon) {
                    case "gun":
                        this.bullets[this.bulletId++] = new Bullet(
                            this.roles["3"].x + 20,
                            this.roles["3"].y + this.roles["3"].height / 2,
                            6,
                            300,
                            "3",
                            this.roles["3"].horizonDirection,
                        );
                        break;
                    default:
                        for (const aid of this.roles["3"].attackId) {
                            if (this.roles[aid].action !== "defense") {
                                this.roles[aid].healthPoint -= this.roles["3"].attackPower;
                            }
                        }
                        break;
                }
                this.keycount.Attack++;
            }
            if (this.keydown.Defense) {
                /**
                 * key: undefined
                 * code: Defense
                 * action: defense
                 */
                if (this.roles["3"].action === undefined) {
                    this.roles["3"].action = "defense";
                }
            } else if (this.roles["3"].action === "defense") {
                this.roles["3"].action = undefined;
            }
        }
        this.renderMap();
        /**
         * Control all roles
         */
        for (const key in this.roles) {
            if (this.roles[key]) {
                /** Check the role if dead */
                this.roles[key].deadthController();
                /** Control attack action keep time */
                if (!this.roles[key].attackKeepTimer && this.roles[key].action === "attack") {
                    this.roles[key].action = undefined;
                } else {
                    this.roles[key].attackKeepTimer--;
                }
                /** render the role */
                this.roles[key].render();
                /** Check attack range */
                if (this.ifInAttackRange(key)) {
                    this.roles[key].renderRange();
                }
            }
        }
        /**
         * Control all bullets
         */
        for (const key in this.bullets) {
            if (this.bullets[key]) {
                this.bullets[key].render();
                this.bullets[key].move();
                if (this.collisionJudge(this.bullets[key], this.bullets[key].direction)) {
                    delete this.bullets[key];
                }
                if (this.bullets[key]) {
                    if (this.ifOverDistance(key)) {
                        delete this.bullets[key];
                    }
                }
            }
        }
        requestAnimationFrame(() => this.update());
    }

    /**
     * Check if other roles in the attack range
     * @param {string} id The role's id
     * @returns {boolean} Judgement
     */
    private ifInAttackRange(id: string): boolean {
        let judge: boolean = false;
        /** Clear the role's attackId */
        this.roles[id].attackId = [];

        if (this.roles[id].horizonDirection === "left") {
            /** While moving left */
            const nleft = this.roles[id].x - this.roles[id].attackRange;
            const nc = (nleft + Storage.sceneWidth) % Storage.sceneWidth;
            const nhead = this.roles[id].y;
            const nfoot = this.roles[id].y + this.roles[id].height;
            /**
             * Check if other players in the attack range
             */
            for (let r = nhead; r < nfoot; r++) {
                const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                if (Storage.fullyMap[nr][nc] > 1) {
                    let ifExist: boolean = false;
                    for (const aid of this.roles[id].attackId) {
                        if (+aid === Storage.fullyMap[nr][nc]) {
                            ifExist = true;
                            break;
                        }
                    }
                    if (!ifExist) {
                        this.roles[id].attackId.push(Storage.fullyMap[nr][nc].toString());
                    }
                    judge = true;
                }
            }
        } else if (this.roles[id].horizonDirection === "right") {
            /** While moving right */
            const nright = this.roles[id].x + this.roles[id].width - 1 + this.roles[id].attackRange;
            const nc = (nright + Storage.sceneWidth) % Storage.sceneWidth;
            const nhead = this.roles[id].y;
            const nfoot = this.roles[id].y + this.roles[id].height;
            /**
             * Check if other players in the attack range
             */
            for (let r = nhead; r < nfoot; r++) {
                const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                if (Storage.fullyMap[nr][nc] > 1) {
                    let ifExist: boolean = false;
                    for (const aid of this.roles[id].attackId) {
                        if (+aid === Storage.fullyMap[nr][nc]) {
                            ifExist = true;
                            break;
                        }
                    }
                    if (!ifExist) {
                        this.roles[id].attackId.push(Storage.fullyMap[nr][nc].toString());
                    }
                    judge = true;
                }
            }
        }
        return judge;
    }

    /**
     * Control the role moving
     * @param {string} id The role's id
     * @param {number} k Direction index of Storage.dx or Storage.dy
     */
    private move(id: string, k: number) {
        const nx = this.roles[id].x;
        const ny = this.roles[id].y;
        const nk = (k === 3) ? 1 : k;
        this.roles[id].y += Storage.dy[nk] * this.roles[id].jumpSpeed;
        this.roles[id].x += Storage.dx[nk] * this.roles[id].moveSpeed;
        const midWidth = this.roles[id].width / 2;
        const midHeight = this.roles[id].height / 2;
        this.roles[id].x = (this.roles[id].x + midWidth + Storage.sceneWidth) % Storage.sceneWidth - midWidth;
        this.roles[id].y = (this.roles[id].y + midHeight + Storage.sceneHeight) % Storage.sceneHeight - midHeight;
        let isCollide = true;
        /**
         * Correct the role's position
         */
        while (isCollide) {
            isCollide = this.collisionJudge(this.roles[id], k);
        }
        /** Remove the role's flag in the map */
        this.roles[id].removeFlag(nx, ny, k);
    }

    /**
     * Check if the bullet over distance
     * @param {string} key The key of the bullet
     * @returns {boolean} Judgement
     */
    private ifOverDistance(key: string): boolean {
        if (this.bullets[key]) {
            let dis: number;
            if (Storage.dx[this.bullets[key].direction] === 1) {
                dis = this.bullets[key].x - this.bullets[key].startX + Storage.sceneWidth;
                dis %= Storage.sceneWidth;
            } else {
                dis = this.bullets[key].startX - this.bullets[key].x + Storage.sceneWidth;
                dis %= Storage.sceneWidth;
            }
            if (dis > this.bullets[key].maxDistance) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if colliding someone
     * @param {object} obj Role or Bullet
     * @param {number} k Direction index of Storage.dx or Storage.dy
     * @returns {boolean} Judgement
     */
    private collisionJudge(obj: {[key: string]: any}, k: number): boolean {
        if (Math.abs(Storage.dx[k])) {
            const nleft = (obj.x + Storage.sceneWidth) % Storage.sceneWidth;
            const nright = (obj.x - 1 + obj.width + Storage.sceneWidth) % Storage.sceneWidth;
            for (let r = obj.y; r < obj.y + obj.height; r++) {
                const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                if (Storage.dx[k] > 0) {
                    /** While moving right */
                    if (obj.roleId) {
                        /** The obj is a role */
                        if (Storage.fullyMap[nr][nright] && Storage.fullyMap[nr][nright] !== +obj.roleId) {
                            obj.x--;
                            return true;
                        }
                    } else if (obj.hostId) {
                        const id: number = Storage.fullyMap[nr][nright];
                        /** The obj is a bullet */
                        if (id && id !== +obj.hostId) {
                            if (id !== 1) {
                                this.roles[id].healthPoint -= this.roles[obj.hostId].attackPower;
                            }
                            return true;
                        }
                    }
                } else {
                    /** While moving left */
                    if (obj.roleId) {
                        /** The obj is a role */
                        if (Storage.fullyMap[nr][nleft] && Storage.fullyMap[nr][nleft] !== +obj.roleId) {
                            obj.x++;
                            return true;
                        }
                    } else if (obj.hostId) {
                        const id: number = Storage.fullyMap[nr][nleft];
                        /** The obj is a bullet */
                        if (id && id !== +obj.hostId) {
                            if (id !== 1) {
                                this.roles[id].healthPoint -= this.roles[obj.hostId].attackPower;
                            }
                            return true;
                        }
                    }
                }
            }
        }
        if (Math.abs(Storage.dy[k])) {
            const nhead = (obj.y + Storage.sceneHeight) % Storage.sceneHeight;
            const nfoot = (obj.y + obj.height - 1 + Storage.sceneHeight) % Storage.sceneHeight;
            for (let c = obj.x; c < obj.x + obj.width; c++) {
                const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                if (obj.jumpSpeed &&  obj.jumpSpeed < 0) {
                    /** While moving down */
                    if (obj.roleId) {
                        /** The obj is a role */
                        if (Storage.fullyMap[nfoot][nc] && Storage.fullyMap[nfoot][nc] !== +obj.roleId) {
                            obj.y--;
                            obj.verticalTimer = false;
                            obj.status = "walk";
                            return true;
                        }
                    } else if (obj.hostId) {
                        const id: number = Storage.fullyMap[nfoot][nc];
                        /** The obj is a bullet */
                        if (id && id !== +obj.hostId) {
                            if (id !== 1) {
                                this.roles[id].healthPoint -= this.roles[obj.hostId].attackPower;
                            }
                            return true;
                        }
                    }
                } else {
                    /** While moving up */
                    if (obj.roleId) {
                        /** The obj is a role */
                        if (Storage.fullyMap[nhead][nc] && Storage.fullyMap[nhead][nc] !== +obj.roleId) {
                            obj.y++;
                            obj.jumpSpeed = 1;
                            return true;
                        }
                    } else if (obj.hostId) {
                        const id: number = Storage.fullyMap[nhead][nc];
                        /** The obj is a bullet */
                        if (id && id !== +obj.hostId) {
                            if (id !== 1) {
                                this.roles[id].healthPoint -= this.roles[obj.hostId].attackPower;
                            }
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
