import Role from "./Role";
import Storage from "./Storage";
import ToolKit from "./ToolKit";
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
        setTimeout(() => this.followHim(), 3000);
        // this.moveController(2, 100);
        // this.moveController(1, 20);
    }

    private main() {
        while (this.commandList.length) {
            let command: {[key: string]: any};
            command = this.commandList.shift();
            if (this.keyTimer[command.code]) {
                cancelAnimationFrame(this.keyTimer[command.code]);
            }
            this.moveController(command.code, command.frames);
        }
        requestAnimationFrame(() => this.main());
    }

    private followHim() {
        const queue: Array<{[key: string]: any}> = [];
        const finalX: number = this.roles["2"].x;
        const finalY: number = this.roles["2"].y;
        const moveSpeed: number = this.roles["3"].moveSpeed;

        queue.push({
            x: this.roles["3"].x,
            y: this.roles["3"].y,
            inAir: this.roles["3"].verticalTimer,
            jumpSpeed: this.roles["3"].jumpSpeed,
            route: [],
        });

        while (queue.length) {
            const last: {[key: string]: any} = queue.shift();
            if (
                (last.x === finalX - this.roles["3"].width ||
                last.x === finalX + this.roles["2"].width) &&
                last.y === finalY
            ) {
                // resolve node.route
                console.log(last.route);
                return;
            }
            for (let dir = 0; dir < 3; dir++) {
                let isCollide: boolean;
                const x: number = last.x + moveSpeed * Storage.dx[dir];
                const y: number = last.y;
                const inAir: boolean = last.inAir;
                const jumpSpeed: number = last.jumpSpeed;
                const next: {[key: string]: any} = {
                    x,
                    y,
                    inAir,
                    jumpSpeed,
                };
                if (next.inAir) {
                    next.y -= next.jumpSpeed;
                    next.jumpSpeed--;
                    isCollide = true;
                    if (next.jumpSpeed > 0) {
                        while (isCollide) {
                            isCollide = this.collide(1, next, last);
                        }
                    } else {
                        while (isCollide) {
                            isCollide = this.collide(3, next, last);
                        }
                    }
                } else {
                    next.y++;
                    if (!this.collide(3, next, last)) {
                        next.jumpSpeed = -1;
                        next.inAir = true;
                    }
                    if (!next.inAir && Math.abs(Storage.dy[dir])) {
                        next.inAir = true;
                        next.jumpSpeed = this.roles["3"].initJumpSpeed;
                    }
                }
                next.x = (next.x + Storage.sceneWidth) % Storage.sceneWidth;
                next.y = (next.y + Storage.sceneHeight) % Storage.sceneHeight;
                isCollide = true;
                while (isCollide) {
                    isCollide = this.collide(dir, next, last);
                }
                const route: Array<{[key: string]: any}> = last.route.slice(0);
                route.push({
                    x: next.x,
                    y: next.y,
                    direction: this.resolveDirection(dir),
                });
                next.route = route;

                const flagKey: string = JSON.stringify({ x, y, jumpSpeed, dir });
                if (!this.routeFlag[flagKey]) {
                    this.routeFlag[flagKey] = true;
                    queue.push(next);
                }
            }
        }
        console.log(finalY, finalX);
        // horizon
        // let rightDis: number;
        // let leftDis: number;
        // if (this.roles["2"].x > this.roles["3"].x) {
        //     rightDis = this.roles["2"].x - this.roles["3"].x;
        //     leftDis = (Storage.sceneWidth - rightDis) % Storage.sceneWidth;
        // } else {
        //     leftDis = this.roles["3"].x - this.roles["2"].x;
        //     rightDis = (Storage.sceneWidth - leftDis) % Storage.sceneWidth;
        // }

        // if (leftDis < rightDis) {
        //     this.commandList.push({
        //         code: "MoveLeft",
        //         frames: Math.floor(leftDis / 4),
        //     });
        // } else {
        //     this.commandList.push({
        //         code: "MoveRight",
        //         frames: Math.floor(rightDis / 4),
        //     });
        // }
    }

    private collide(dir: number, next: {[key: string]: any}, last: {[key: string]: any}): boolean {
        if (Math.abs(Storage.dx[dir])) {
            const nleft: number = (next.x + Storage.sceneWidth) % Storage.sceneWidth;
            const nright: number = (next.x - 1 + this.roles["3"].width + Storage.sceneWidth) % Storage.sceneWidth;
            for (let r = last.y; r < last.y + this.roles["3"].height; r++) {
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
            for (let c = last.x; c < last.x + this.roles["3"].width; c++) {
                const nc: number = (c + Storage.sceneWidth) % Storage.sceneWidth;
                if (Storage.dy[dir] > 0) {
                    if (this.magicMap[nfoot][nc]) {
                        next.y--;
                        next.inAir = false;
                        return true;
                    }
                } else {
                    if (this.magicMap[nhead][nc]) {
                        next.y++;
                        next.jumpSpeed = 0;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private resolveDirection(dir: number): string {
        switch (dir) {
            case 0:
                return "MoveLeft";
            case 1:
                return "Jump";
            case 2:
                return "MoveRight";
            case 3:
                return "MoveDown";
            default:
                break;
        }
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
    private moveController(code: string, frames: number) {
        this.simulateKeyboardEvent("keydown", code);
        this.run(code, frames);
    }
}
