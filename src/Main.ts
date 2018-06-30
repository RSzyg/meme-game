import Role from "./Role";
import Storage from "./Storage";

export default class Main {
    private map: number[];
    private roles: {[key: string]: Role};
    private interval: number = 17;
    // keyboardRecorder
    private up: number;
    private down: number;
    private left: number;
    private right: number;
    constructor() {
        this.map = [];
        this.roles = {};
        // keyboardRecorder
        this.up = undefined;
        this.down = undefined;
        this.left = undefined;
        this.right = undefined;
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
            jumpSpeed: 10,
        };
        this.roles[id] = new Role(data);
        this.roles[id].render();
    }

    private keyboardController(e: KeyboardEvent) {
        if (e.type === "keydown") {
            switch (e.keyCode) {
                case 38:
                    if (!this.up) {
                        this.up = setInterval(
                            () => this.roles["0"].move("up"),
                            this.interval,
                        );
                    }
                    break;
                case 40:
                    if (!this.down) {
                        this.down = setInterval(
                            () => this.roles["0"].move("down"),
                            this.interval,
                        );
                    }
                    break;
                case 37:
                    if (!this.left) {
                        this.left = setInterval(
                            () => this.roles["0"].move("left"),
                            this.interval,
                        );
                    }
                    break;
                case 39:
                    if (!this.right) {
                        this.right = setInterval(
                            () => this.roles["0"].move("right"),
                            this.interval,
                        );
                    }
                    break;
                case 88:
                    break;
                default:
                    break;
            }
        } else if (e.type === "keyup") {
            switch (e.keyCode) {
                case 38:
                    clearInterval(this.up);
                    this.up = undefined;
                    break;
                case 40:
                    clearInterval(this.down);
                    this.down = undefined;
                    break;
                case 37:
                    clearInterval(this.left);
                    this.left = undefined;
                    break;
                case 39:
                    clearInterval(this.right);
                    this.right = undefined;
                    break;
                case 88:
                    break;
                default:
                    break;
            }
        }
    }
}
