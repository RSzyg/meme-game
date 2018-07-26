import Role from "./Role";
import Storage from "./Storage";
import PriorityQueue from "./ToolKit/PriorityQueue";
/**
 * The Controller of AI
 * @prop {object} roles - All roles in the scene
 * @prop {object[]} commandList - The list of AI command
 * @prop {object} keyTimer - Record key timer
 * @prop {number[][]} magicMap - The map of AI
 */
export default class AIController {
    private readonly roles: {[key: string]: Role};
    private commandList: Array<{[key: string]: any}>;
    private keyTimer: {[key: string]: number};
    private magicMap: number[][];
    private routeFlag: {[key: string]: boolean};
    constructor(roles: {[key: string]: Role}) {
        this.roles = roles;
        this.commandList = [];
        this.keyTimer = {};
        this.magicMap = [];
        this.routeFlag = {};
        for (let r = 0; r < Storage.fullyMap.length; r++) {
            this.magicMap[r] = Storage.fullyMap[r].slice(0);
        }
    }

    public start() {
        this.main();
        setTimeout(() => {
            this.followHim();
        }, 3000);
        // this.moveController(2, 100);
        // this.moveController(1, 20);
    }

    private main() {
        while (this.commandList.length) {
            let command: {[key: string]: any};
            command = this.commandList.shift();
            this.moveController(command.code, command.frames, command.offsets);
        }
        requestAnimationFrame(() => this.main());
    }

    private followHim() {
        let count = 0;
        const endX = this.roles["2"].x;
        const endY = this.roles["2"].y;
        const moveSpeed: number = this.roles["3"].moveSpeed;
        const queue: PriorityQueue = new PriorityQueue(endX, endY);

        queue.push_back({
            x: this.roles["3"].x,
            y: this.roles["3"].y,
            inAir: this.roles["3"].verticalTimer,
            jumpSpeed: this.roles["3"].jumpSpeed,
            steps: 0,
            route: [],
        });

        while (queue.size) {
            count++;
            const node: {[key: string]: any} = queue.pop();
            for (let xrange = 10; xrange >= 0; xrange--) {
                const endLeft = endX - this.roles["3"].width - xrange;
                const endRight = endX + this.roles["2"].width + xrange;
                if (
                    (node.x === endLeft || node.x === endRight) &&
                    Math.abs(node.y - endY) < 10
                ) {
                    // resolve node.route
                    this.resolveRoute(node.route);
                    console.log(node.route);
                    console.log(count);
                    return;
                }
            }
            for (let dir = 0; dir < 3; dir++) {
                let isCollide: boolean;
                const x: number = node.x;
                const y: number = node.y;
                const inAir: boolean = node.inAir;
                const jumpSpeed: number = node.jumpSpeed;
                const steps: number = node.steps + 1;
                const next: {[key: string]: any} = {
                    x,
                    y,
                    inAir,
                    jumpSpeed,
                    steps,
                };

                if (Math.abs(Storage.dy[dir])) {
                    if (!next.inAir) {
                        next.inAir = true;
                        next.jumpSpeed = this.roles["3"].initJumpSpeed;
                    }
                }

                next.x += moveSpeed * Storage.dx[dir];
                next.x = (next.x + Storage.sceneWidth) % Storage.sceneWidth;
                isCollide = true;
                if (Math.abs(Storage.dx[dir])) {
                    while (isCollide) {
                        isCollide = this.collide(dir, next);
                    }
                }

                if (next.inAir) {
                    next.steps++;
                    next.y -= next.jumpSpeed;
                    if (next.jumpSpeed > 0) {
                        isCollide = true;
                        while (isCollide) {
                            isCollide = this.collide(1, next);
                        }
                    } else {
                        isCollide = true;
                        while (isCollide) {
                            isCollide = this.collide(3, next);
                        }
                    }
                    next.jumpSpeed--;
                } else {
                    next.y++;
                    if (!this.collide(3, next)) {
                        next.y--;
                        next.jumpSpeed = -1;
                        next.inAir = true;
                    }
                }
                next.y = (next.y + Storage.sceneHeight) % Storage.sceneHeight;

                const route: Array<{[key: string]: any}> = node.route.slice(0);
                route.push({ x: next.x, y: next.y, jumpSpeed: next.jumpSpeed, direction: dir });
                next.route = route;

                const flagKey: string = JSON.stringify({ x, y, jumpSpeed, dir });
                if (!this.routeFlag[flagKey]) {
                    this.routeFlag[flagKey] = true;
                    queue.push_back(next);
                }
            }
        }
    }

    private collide(dir: number, next: {[key: string]: any}): boolean {
        if (Math.abs(Storage.dx[dir])) {
            const nleft: number = (next.x + Storage.sceneWidth) % Storage.sceneWidth;
            const nright: number = (next.x - 1 + this.roles["3"].width + Storage.sceneWidth) % Storage.sceneWidth;
            for (let r = next.y; r < next.y + this.roles["3"].height; r++) {
                const nr: number = (r + Storage.sceneHeight) % Storage.sceneHeight;
                if (Storage.dx[dir] > 0) {
                    if (this.magicMap[nr][nright]) {
                        next.x--;
                        return true;
                    }
                } else {
                    if (this.magicMap[nr][nleft]) {
                        next.x++;
                        return true;
                    }
                }
            }
        } else if (Math.abs(Storage.dy[dir])) {
            const nhead = (next.y + Storage.sceneHeight) % Storage.sceneHeight;
            const nfoot = (next.y + this.roles["3"].height - 1 + Storage.sceneHeight) % Storage.sceneHeight;
            for (let c = next.x; c < next.x + this.roles["3"].width; c++) {
                const nc: number = (c + Storage.sceneWidth) % Storage.sceneWidth;
                if (next.jumpSpeed < 0) {
                    if (this.magicMap[nfoot][nc]) {
                        next.y--;
                        next.inAir = false;
                        return true;
                    }
                } else {
                    if (this.magicMap[nhead][nc]) {
                        next.y++;
                        next.jumpSpeed = 1;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private resolveRoute(route: Array<{[key: string]: any}>) {
        this.commandList = [];
        let temp: number = -1;
        let code: string;
        let frames: number = 0;
        let offsets: number = 0;
        Storage.grids.ctx.beginPath();
        for (const node of route) {
            const drawX: number = (node.x + this.roles["3"].width / 2 + Storage.sceneWidth) % Storage.sceneWidth;
            const drawY: number = (node.y + this.roles["3"].height / 2 + Storage.sceneHeight) % Storage.sceneHeight;
            const radius: number = 6;
            Storage.grids.ctx.moveTo(drawX + radius, drawY);
            Storage.grids.ctx.arc(drawX, drawY, 6, 0, 2 * Math.PI);
            switch (temp) {
                case 0:
                    code = "MoveLeft";
                    break;
                case 1:
                    code = "Jump";
                    break;
                case 2:
                    code = "MoveRight";
                    break;
                default:
                    code = "";
                    break;
            }
            if (temp === -1) {
                temp = node.direction;
            } else if (node.direction !== temp) {
                this.commandList.push({ code, frames, offsets });
                offsets += frames;
                temp = node.direction;
                frames = 0;
            }
            frames++;
        }
        this.commandList.push({ code, frames, offsets });
        Storage.grids.ctx.fillStyle = "red";
        Storage.grids.ctx.fill();
    }

    private simulateKeyboardEvent(type: string, code: string) {
        const event: KeyboardEvent = new KeyboardEvent(
            type,
            {
                bubbles: true,
                key: code,
                code,
            },
        );
        document.body.dispatchEvent(event);
    }

    private run(code: string, frames: number) {
        if (frames === 0) {
            this.simulateKeyboardEvent("keyup", code);
            return;
        }
        this.keyTimer[code] = requestAnimationFrame(() => this.run(code, frames - 1));
    }

    /**
     * Control the AI role moving
     * @param {number} direction - left->up->right
     */
    private moveController(code: string, frames: number, offsets: number) {
        if (offsets === 0) {
            if (this.keyTimer[code]) {
                cancelAnimationFrame(this.keyTimer[code]);
            }
            this.simulateKeyboardEvent("keydown", code);
            this.run(code, frames);
        } else {
            requestAnimationFrame(() => this.moveController(code, frames, offsets - 1));
        }
    }
}
