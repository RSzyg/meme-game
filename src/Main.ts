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
        Storage.miniSelfRoleCanvas.style.zIndex = "3";
        Storage.miniSelfRoleCanvas.style.position = "absolute";
        Storage.miniSelfRoleCanvas.style.right = "0px";
        Storage.miniSelfRoleCanvas.style.top = "0px";
        Storage.miniSelfRoleCanvas.height = 150;
        Storage.miniSelfRoleCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniSelfRoleCanvas);
        Storage.miniSelfRoleCtx = Storage.miniSelfRoleCanvas.getContext("2d");
        // create mini-other-role canvas
        Storage.miniOtherRoleCanvas = document.createElement("canvas");
        Storage.miniOtherRoleCanvas.style.zIndex = "3";
        Storage.miniOtherRoleCanvas.style.position = "absolute";
        Storage.miniOtherRoleCanvas.style.right = "0px";
        Storage.miniOtherRoleCanvas.style.top = "0px";
        Storage.miniOtherRoleCanvas.height = 150;
        Storage.miniOtherRoleCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniOtherRoleCanvas);
        Storage.miniOtherRoleCtx = Storage.miniOtherRoleCanvas.getContext("2d");
        // create mini-map canvas
        Storage.miniMapCanvas = document.createElement("canvas");
        Storage.miniMapCanvas.style.zIndex = "2";
        Storage.miniMapCanvas.style.position = "absolute";
        Storage.miniMapCanvas.style.right = "0px";
        Storage.miniMapCanvas.style.top = "0px";
        Storage.miniMapCanvas.height = 150;
        Storage.miniMapCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniMapCanvas);
        Storage.miniMapCtx = Storage.miniMapCanvas.getContext("2d");
        // create main canvas
        Storage.mainCanvas = document.createElement("canvas");
        Storage.mainCanvas.style.zIndex = "1";
        Storage.mainCanvas.style.position = "absolute";
        Storage.mainCanvas.height = Storage.sceneHeight;
        Storage.mainCanvas.width = Storage.sceneWidth;
        document.getElementById("display").appendChild(Storage.mainCanvas);
        Storage.mainCtx = Storage.mainCanvas.getContext("2d");
        this.renderMap();
        this.createRole("0");
        this.createRole("1");
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
            x: +id * 100,
            y: Storage.sceneHeight - 54,
            maxHealthPoint: 100,
            attackPower: 3,
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
     * 65 A
     * 87 W
     * 68 D
     * 83 S
     * 88 X
     */
    private update() {
        this.clearScene();
        // player1
        if (this.keydown[38]) {
            if (!this.roles["0"].verticalTimer) {
                this.roles["0"].jumpSpeed = this.roles["0"].initJumpSpeed;
                this.roles["0"].verticalTimer = true;
            }
        }
        if (this.keydown[37]) {
            this.roles["0"].status = "left";
            this.move("0", 0);
        }
        if (this.keydown[39]) {
            this.roles["0"].status = "right";
            this.move("0", 2);
        }
        if (this.roles["0"].verticalTimer) {
            this.move("0", 1);
            this.roles["0"].jumpSpeed--;
        } else {
            this.roles["0"].jumpSpeed = -1;
            this.roles["0"].verticalTimer = true;
        }
        if (this.keycycle[88]) {
            this.roles["0"].healthPoint -= this.roles["0"].attackPower;
            this.keycycle[88] = false;
        }
        // player2
        if (this.keydown[87]) {
            if (!this.roles["1"].verticalTimer) {
                this.roles["1"].jumpSpeed = this.roles["1"].initJumpSpeed;
                this.roles["1"].verticalTimer = true;
            }
        }
        if (this.keydown[65]) {
            this.roles["1"].status = "left";
            this.move("1", 0);
        }
        if (this.keydown[68]) {
            this.roles["1"].status = "right";
            this.move("1", 2);
        }
        if (this.roles["1"].verticalTimer) {
            this.move("1", 1);
            this.roles["1"].jumpSpeed--;
        } else {
            this.roles["1"].jumpSpeed = -1;
            this.roles["1"].verticalTimer = true;
        }
        this.renderMap();
        for (const key in this.roles) {
            if (this.roles[key]) {
                this.roles[key].render();
            }
        }
        requestAnimationFrame(() => this.update());
    }

    // move
    private move(id: string, k: number) {
        this.roles[id].y += Storage.dy[k] * this.roles[id].jumpSpeed;
        this.roles[id].x += Storage.dx[k] * this.roles[id].moveSpeed;
        const midWidth = this.roles[id].width / 2;
        const midHeight = this.roles[id].height / 2;
        this.roles[id].x = (this.roles[id].x + midWidth + Storage.sceneWidth) % Storage.sceneWidth - midWidth;
        this.roles[id].y = (this.roles[id].y + midHeight + Storage.sceneHeight) % Storage.sceneHeight - midHeight;
        let isCollide = true;
        while (isCollide) {
            isCollide = this.collisionJudge(id, k);
        }
    }

    // handle while hit
    private collisionJudge(id: string, k: number): boolean {
        if (Math.abs(Storage.dx[k])) {
            const nleft = (this.roles[id].x - 1 + Storage.sceneWidth) % Storage.sceneWidth;
            const nright = (this.roles[id].x + this.roles[id].width + Storage.sceneWidth) % Storage.sceneWidth;
            for (let r = this.roles[id].y; r < this.roles[id].y + this.roles[id].height; r++) {
                const nr = (r + Storage.sceneHeight) % Storage.sceneHeight;
                if (Storage.dx[k] > 0) {
                    if (Storage.fullyMap[nr][nright]) {
                        this.roles[id].x--;
                        return true;
                    }
                } else {
                    if (Storage.fullyMap[nr][nleft]) {
                        this.roles[id].x++;
                        return true;
                    }
                }
            }
        }
        if (Math.abs(Storage.dy[k])) {
            const nhead = (this.roles[id].y - 1 + Storage.sceneHeight) % Storage.sceneHeight;
            const nfoot = (this.roles[id].y + this.roles[id].height + Storage.sceneHeight) % Storage.sceneHeight;
            for (let c = this.roles[id].x; c < this.roles[id].x + this.roles[id].width; c++) {
                const nc = (c + Storage.sceneWidth) % Storage.sceneWidth;
                if (this.roles[id].jumpSpeed < 0) {
                    if (Storage.fullyMap[nfoot][nc]) {
                        this.roles[id].y--;
                        this.roles[id].verticalTimer = false;
                        return true;
                    }
                } else {
                    if (Storage.fullyMap[nhead][nc]) {
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
