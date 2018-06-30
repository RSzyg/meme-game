import Role from "./Role";

export default class Main {
    public images: { [key: string]: HTMLImageElement };
    private canvasHeight: number = 600;
    private canvasWidth: number = 800;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: number[];
    private roles: {[key: string]: Role};
    private interval: number = 17;
    // keyboardRecorder
    private up: number;
    private down: number;
    private left: number;
    private right: number;
    constructor() {
        this.images = {};
        this.canvas = document.createElement("canvas");
        this.canvas.height = this.canvasHeight;
        this.canvas.width = this.canvasWidth;
        document.getElementById("display").appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.map = [];
        this.roles = {};
        // keyboardRecorder
        this.up = undefined;
        this.down = undefined;
        this.left = undefined;
        this.right = undefined;
    }

    public createScene() {
        this.createRole("0");

        document.addEventListener("keydown", (e) => this.keyboardController(e));
        document.addEventListener("keyup", (e) => this.keyboardController(e));
    }

    private createRole(id: string) {
        const data = {
            width: 54,
            height: 54,
            x: 0,
            y: this.canvasHeight - 54,
            maxHealthPoint: 100,
            attackPower: 3,
            moveSpeed: 4,
            jumpSpeed: 10,
        };
        this.roles[id] = new Role(data);
        this.roles[id].images = this.images;
        this.roles[id].canvas = this.canvas;
        this.roles[id].ctx = this.ctx;
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
