import Role from "./Role";
import Storage from "./Storage";

export default class Main {
    private roles: {[key: string]: Role};
    private keydown: {[key: number]: boolean};
    constructor() {
        this.roles = {};
        this.keydown = {};
    }

    public createScene() {
        Storage.canvas = document.createElement("canvas");
        Storage.canvas.height = Storage.sceneHeight;
        Storage.canvas.width = Storage.sceneWidth;
        document.getElementById("display").appendChild(Storage.canvas);
        Storage.ctx = Storage.canvas.getContext("2d");
        this.createRole("0");

        document.addEventListener("keydown", (e) => this.keyboardController(e));
        document.addEventListener("keyup", (e) => this.keyboardController(e));
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
            jumpSpeed: 20,
        };
        this.roles[id] = new Role(data);
        this.update();
    }

    private keyboardController(e: KeyboardEvent) {
        if (e.type === "keydown") {
            this.keydown[e.keyCode] = true;
        } else if (e.type === "keyup") {
            this.keydown[e.keyCode] = false;
        }
    }

    private clearRoles() {
        Storage.ctx.fillStyle = "#C0C0C0";
        Storage.ctx.fillRect(0, 0, Storage.sceneWidth, Storage.sceneHeight);
    }

    private update() {
        this.clearRoles();
        if (this.keydown[37]) {
            this.roles["0"].status = "left";
            this.roles["0"].move(0);
        }
        if (this.keydown[38]) {
            if (!this.roles["0"].verticalTimer) {
                this.roles["0"].jumpSpeed = this.roles["0"].initJumpSpeed;
                this.roles["0"].verticalTimer = true;
            }
        }
        if (this.roles["0"].verticalTimer) {
            this.roles["0"].jumpSpeed--;
            this.roles["0"].move(1);
        }
        if (this.keydown[39]) {
            this.roles["0"].status = "right";
            this.roles["0"].move(2);
        }
        if (this.keydown[40]) {
            console.log("down");
        }
        this.roles["0"].render();
        requestAnimationFrame(() => this.update());
    }
}
