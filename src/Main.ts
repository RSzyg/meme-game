import Role from "./Role";
import Storage from "./Storage";

export default class Main {
    private roles: {[key: string]: Role};
    private keydown: {[key: number]: boolean};
    private keycycle: {[key: number]: boolean};
    constructor() {
        this.roles = {};
        this.keydown = {};
        this.keycycle = {};
    }

    public createScene() {
        // create mini-self-role canvas
        Storage.miniSelfRoleCanvas = document.createElement("canvas");
        Storage.miniSelfRoleCanvas.style.zIndex = "4";
        Storage.miniSelfRoleCanvas.style.position = "absolute";
        Storage.miniSelfRoleCanvas.style.right = "0px";
        Storage.miniSelfRoleCanvas.style.top = "0px";
        Storage.miniSelfRoleCanvas.height = 150;
        Storage.miniSelfRoleCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniSelfRoleCanvas);
        Storage.miniSelfRoleCtx = Storage.miniSelfRoleCanvas.getContext("2d");
        // create mini-other-role canvas
        Storage.miniOtherRoleCanvas = document.createElement("canvas");
        Storage.miniOtherRoleCanvas.style.zIndex = "4";
        Storage.miniOtherRoleCanvas.style.position = "absolute";
        Storage.miniOtherRoleCanvas.style.right = "0px";
        Storage.miniOtherRoleCanvas.style.top = "0px";
        Storage.miniOtherRoleCanvas.height = 150;
        Storage.miniOtherRoleCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniOtherRoleCanvas);
        Storage.miniOtherRoleCtx = Storage.miniOtherRoleCanvas.getContext("2d");
        // create mini-map canvas
        Storage.miniMapCanvas = document.createElement("canvas");
        Storage.miniMapCanvas.style.zIndex = "3";
        Storage.miniMapCanvas.style.position = "absolute";
        Storage.miniMapCanvas.style.right = "0px";
        Storage.miniMapCanvas.style.top = "0px";
        Storage.miniMapCanvas.height = 150;
        Storage.miniMapCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniMapCanvas);
        Storage.miniMapCtx = Storage.miniMapCanvas.getContext("2d");
        // create bar canvas
        Storage.barCanvas = document.createElement("canvas");
        Storage.barCanvas.style.zIndex = "2";
        Storage.barCanvas.style.position = "absolute";
        Storage.barCanvas.height = Storage.sceneHeight;
        Storage.barCanvas.width = Storage.sceneWidth;
        document.getElementById("display").appendChild(Storage.barCanvas);
        Storage.barCtx = Storage.barCanvas.getContext("2d");
        // create main canvas
        Storage.mainCanvas = document.createElement("canvas");
        Storage.mainCanvas.style.zIndex = "1";
        Storage.mainCanvas.style.position = "absolute";
        Storage.mainCanvas.height = Storage.sceneHeight;
        Storage.mainCanvas.width = Storage.sceneWidth;
        document.getElementById("display").appendChild(Storage.mainCanvas);
        Storage.mainCtx = Storage.mainCanvas.getContext("2d");
        this.renderMap();
        this.createRole("2");
        this.createRole("3");
        this.renderMiniMap();
        this.update();

        document.addEventListener("keydown", (e) => this.keyboardController(e));
        document.addEventListener("keyup", (e) => this.keyboardController(e));
    }

    private renderMap() {
        for (let r = 0; r < Storage.simplifiedMap.length; r++) {
            for (let c = 0; c < Storage.simplifiedMap[r].length; c++) {
                if (Storage.simplifiedMap[r][c] === 1) {
                    Storage.mainCtx.fillStyle = "#ffffff";
                    Storage.mainCtx.fillRect(c * 40, r * 40, 40, 40);
                    Storage.mainCtx.strokeRect(c * 40, r * 40, 40, 40);
                }
            }
        }
    }

    private renderMiniMap() {
        Storage.miniMapCtx.globalAlpha = 0.4;
        Storage.miniMapCtx.fillStyle = "#ffffff";
        Storage.miniMapCtx.fillRect(0, 0, 200, 150);
        for (let r = 0; r < Storage.simplifiedMap.length; r++) {
            for (let c = 0; c < Storage.simplifiedMap[r].length; c++) {
                if (Storage.simplifiedMap[r][c] === 1) {
                    Storage.miniMapCtx.fillStyle = "#000000";
                    Storage.miniMapCtx.fillRect(c * 10, r * 10, 10, 10);
                }
            }
        }
    }

    private createRole(id: string) {
        const data = {
            roleId: id,
            width: 54,
            height: 54,
            x: (+id - 2) * 100,
            y: Storage.sceneHeight - 54,
            maxHealthPoint: 100,
            attackPower: 3,
            attackRange: 12,
            moveSpeed: 4,
            jumpSpeed: 19,
        };
        this.roles[id] = new Role(data);
    }

    private keyboardController(e: KeyboardEvent) {
        if (e.type === "keydown") {
            this.keydown[e.keyCode] = true;
        } else if (e.type === "keyup") {
            this.keydown[e.keyCode] = false;
            this.keycycle[e.keyCode] = true;
        }
    }

    private clearScene() {
        Storage.mainCanvas.height = Storage.mainCanvas.height;
        Storage.barCanvas.height = Storage.barCanvas.height;
        Storage.miniSelfRoleCanvas.height = Storage.miniSelfRoleCanvas.height;
        Storage.miniSelfRoleCtx.globalAlpha = 0.5;
        Storage.miniOtherRoleCanvas.height = Storage.miniOtherRoleCanvas.height;
        Storage.miniOtherRoleCtx.globalAlpha = 0.5;
    }

    /**
     * 37 ←
     * 38 ↑
     * 39 →
     * 40 ↓
     * 68 D
     * 82 R
     * 71 G
     * 70 F
     * 192 `
     * 191 /
     */
    private update() {
        this.clearScene();
        // player1
        if (this.roles["2"].roleStatus !== "dead") {
            if (this.keydown[38]) {
                if (!this.roles["2"].verticalTimer) {
                    this.roles["2"].jumpSpeed = this.roles["2"].initJumpSpeed;
                    this.roles["2"].verticalTimer = true;
                }
            }
            if (this.keydown[37]) {
                if (!this.keydown[39]) {
                    this.roles["2"].horizontalStatus = "left";
                    this.move("2", 0);
                }
            }
            if (this.keydown[39]) {
                if (!this.keydown[37]) {
                    this.roles["2"].horizontalStatus = "right";
                    this.move("2", 2);
                }
            }
            if (this.roles["2"].verticalTimer) {
                if (this.roles["2"].jumpSpeed > 0) {
                    this.roles["2"].verticalStatus = "up";
                    this.move("2", 1);
                } else {
                    this.roles["2"].verticalStatus = "down";
                    this.move("2", 3);
                }
                this.roles["2"].jumpSpeed--;
            } else {
                this.roles["2"].jumpSpeed = -1;
                this.roles["2"].verticalTimer = true;
            }
            if (this.keycycle[191]) {
                this.roles["2"].roleStatus = "attack";
                this.roles["2"].attackTimer = 10;
                for (const aid of this.roles["2"].attackId) {
                    this.roles[aid].healthPoint -= this.roles["2"].attackPower;
                    this.roles[aid].deadthController();
                }
                this.keycycle[191] = false;
            }
        }
        // player2
        if (this.roles["3"].roleStatus !== "dead") {
            if (this.keydown[82]) {
                if (!this.roles["3"].verticalTimer) {
                    this.roles["3"].jumpSpeed = this.roles["3"].initJumpSpeed;
                    this.roles["3"].verticalTimer = true;
                }
            }
            if (this.keydown[68]) {
                if (!this.keydown[71]) {
                    this.roles["3"].horizontalStatus = "left";
                    this.move("3", 0);
                }
            }
            if (this.keydown[71]) {
                if (!this.keydown[68]) {
                    this.roles["3"].horizontalStatus = "right";
                    this.move("3", 2);
                }
            }
            if (this.roles["3"].verticalTimer) {
                if (this.roles["3"].jumpSpeed > 0) {
                    this.roles["3"].verticalStatus = "up";
                    this.move("3", 1);
                } else {
                    this.roles["3"].verticalStatus = "down";
                    this.move("3", 3);
                }
                this.roles["3"].jumpSpeed--;
            } else {
                this.roles["3"].jumpSpeed = -1;
                this.roles["3"].verticalTimer = true;
            }
            if (this.keycycle[192]) {
                this.roles["3"].roleStatus = "attack";
                this.roles["3"].attackTimer = 10;
                for (const aid of this.roles["3"].attackId) {
                    this.roles[aid].healthPoint -= this.roles["3"].attackPower;
                    this.roles[aid].deadthController();
                }
                this.keycycle[192] = false;
            }
        }
        this.renderMap();
        for (const key in this.roles) {
            if (this.roles[key]) {
                if (!this.roles[key].attackTimer && this.roles[key].roleStatus === "attack") {
                    this.roles[key].roleStatus = undefined;
                } else {
                    this.roles[key].attackTimer--;
                }
                this.roles[key].render();
                if (this.ifInAttackRange(key)) {
                    this.roles[key].renderRange();
                }
            }
        }
        requestAnimationFrame(() => this.update());
    }

    private ifInAttackRange(id: string): boolean {
        let judge: boolean = false;
        this.roles[id].attackId = [];
        if (this.roles[id].horizontalStatus === "left") {
            const nleft = this.roles[id].x - this.roles[id].attackRange;
            const nc = (nleft + Storage.sceneWidth) % Storage.sceneWidth;
            const nhead = this.roles[id].y;
            const nfoot = this.roles[id].y + this.roles[id].height;
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
        } else if (this.roles[id].horizontalStatus === "right") {
            const nright = this.roles[id].x + this.roles[id].width - 1 + this.roles[id].attackRange;
            const nc = (nright + Storage.sceneWidth) % Storage.sceneWidth;
            const nhead = this.roles[id].y;
            const nfoot = this.roles[id].y + this.roles[id].height;
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

    // move
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
        while (isCollide) {
            isCollide = this.collisionJudge(id, k);
        }
        this.roles[id].removeFlag(nx, ny, k);
    }

    // handle while hit
    private collisionJudge(id: string, k: number): boolean {
        if (Math.abs(Storage.dx[k])) {
            const nleft = (this.roles[id].x + Storage.sceneWidth) % Storage.sceneWidth;
            const nright = (this.roles[id].x - 1 + this.roles[id].width + Storage.sceneWidth) % Storage.sceneWidth;
            for (let r = this.roles[id].y; r < this.roles[id].y + this.roles[id].height; r++) {
                const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                if (Storage.dx[k] > 0) {
                    if (Storage.fullyMap[nr][nright] && Storage.fullyMap[nr][nright] !== +id) {
                        this.roles[id].x--;
                        return true;
                    }
                } else {
                    if (Storage.fullyMap[nr][nleft] && Storage.fullyMap[nr][nleft] !== +id) {
                        this.roles[id].x++;
                        return true;
                    }
                }
            }
        }
        if (Math.abs(Storage.dy[k])) {
            const nhead = (this.roles[id].y + Storage.sceneHeight) % Storage.sceneHeight;
            const nfoot = (this.roles[id].y + this.roles[id].height - 1 + Storage.sceneHeight) % Storage.sceneHeight;
            for (let c = this.roles[id].x; c < this.roles[id].x + this.roles[id].width; c++) {
                const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                if (this.roles[id].jumpSpeed < 0) {
                    if (Storage.fullyMap[nfoot][nc] && Storage.fullyMap[nfoot][nc] !== +id) {
                        this.roles[id].y--;
                        this.roles[id].verticalTimer = false;
                        this.roles[id].verticalStatus = undefined;
                        return true;
                    }
                } else {
                    if (Storage.fullyMap[nhead][nc] && Storage.fullyMap[nhead][nc] !== +id) {
                        this.roles[id].y++;
                        this.roles[id].jumpSpeed = 1;
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
