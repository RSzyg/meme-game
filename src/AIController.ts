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
    public roles: {[key: string]: Role};
    private commandList: Array<{[key: string]: any}>;
    private keyTimer: {[key: string]: number};
    private magicMap: number[][];
    constructor(roles: {[key: string]: Role}) {
        this.roles = roles;
        this.commandList = [];
        this.keyTimer = {};
        this.magicMap = [];
        for (const r of Storage.fullyMap) {
            const temp: number[] = [];
            for (const c of r) {
                temp.push(c);
            }
            this.magicMap.push(temp);
        }
    }

    public start() {
        this.main();
        // this.moveController(2, 100);
        // this.moveController(1, 20);
    }

    private clearMagicMap() {
        for (const r of this.magicMap) {
            for (let c of r) {
                if (c === 6) {
                    c = 0;
                }
            }
        }
    }

    private updateMagicMap(dir: number, nx: number, ny: number, oldx: number, oldy: number) {
        const dx: number = Storage.dx[dir];
        const dy: number = Storage.dy[dir];
        if (Math.abs(dx)) {
            for (let r = ny; r < ny + this.roles["3"].height; r++) {
                const nr: number = (r + Storage.sceneHeight) % Storage.sceneHeight;
                for (let c = Math.min(nx, oldx); c < Math.max(nx, oldx); c++) {
                    const nc: number = (c + Storage.sceneWidth) % Storage.sceneWidth;
                    if (this.magicMap[nr][nc] === 0) {
                        this.magicMap[nr][nc] = 6;
                    }
                }
            }
        } else if (Math.abs(dy)) {
            for (let r = Math.min(ny, oldy); r < Math.max(ny, oldy); r++) {
                const nr: number = (r + Storage.sceneHeight) % Storage.sceneHeight;
                for (let c = nx; c < nx + this.roles["3"].width; c++) {
                    const nc: number = (c + Storage.sceneWidth) % Storage.sceneWidth;
                    if (this.magicMap[nr][nc] === 0) {
                        this.magicMap[nr][nc] = 6;
                    }
                }
            }
        }
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
        // horizon
        let rightDis: number;
        let leftDis: number;
        if (this.roles["2"].x > this.roles["3"].x) {
            rightDis = this.roles["2"].x - this.roles["3"].x;
            leftDis = (Storage.sceneWidth - rightDis) % Storage.sceneWidth;
        } else {
            leftDis = this.roles["3"].x - this.roles["2"].x;
            rightDis = (Storage.sceneWidth - leftDis) % Storage.sceneWidth;
        }

        if (leftDis < rightDis) {
            this.commandList.push({
                code: "MoveLeft",
                frames: Math.floor(leftDis / 4),
            });
        } else {
            this.commandList.push({
                code: "MoveRight",
                frames: Math.floor(rightDis / 4),
            });
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
