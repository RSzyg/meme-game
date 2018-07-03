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
        // create mini-role canvas
        Storage.miniRoleCanvas = document.createElement("canvas");
        Storage.miniRoleCanvas.style.zIndex = "3";
        Storage.miniRoleCanvas.style.position = "absolute";
        Storage.miniRoleCanvas.style.right = "0px";
        Storage.miniRoleCanvas.style.top = "0px";
        Storage.miniRoleCanvas.height = 150;
        Storage.miniRoleCanvas.width = 200;
        document.getElementById("display").appendChild(Storage.miniRoleCanvas);
        Storage.miniRoleCtx = Storage.miniRoleCanvas.getContext("2d");
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
        this.renderMiniMap();

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
        Storage.miniMapCtx.globalAlpha = 0.3;
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
            width: 54,
            height: 54,
            x: 0,
            y: Storage.sceneHeight - 54,
            maxHealthPoint: 100,
            attackPower: 3,
            moveSpeed: 4,
            jumpSpeed: 19,
        };
        this.roles[id] = new Role(data);
        this.update();
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
        Storage.miniRoleCanvas.height = Storage.miniRoleCanvas.height;
        Storage.miniRoleCtx.globalAlpha = 0.4;
    }

    private update() {
        this.clearScene();
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
        if (this.keydown[40]) {
            console.log("down");
        }
        if (this.keycycle[88]) {
            this.roles["0"].healthPoint -= this.roles["0"].attackPower;
            this.keycycle[88] = false;
        }
        this.renderMap();
        this.roles["0"].render();
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
        let isHit = true;
        while (isHit) {
            isHit = this.hitJudge(id, k);
        }
    }

    // handle while hit
    private hitJudge(id: string, k: number): boolean {
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
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
