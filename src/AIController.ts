import Role from "./Role";
import Storage from "./Storage";
/**
 * The Controller of AI
 * @prop {object} roles - All roles in the scene
 * @prop {object[]} commandList - The list of AI command
 * @prop {object} keyTimer - Record key timer
 */
export default class AIController {
    public roles: {[key: string]: Role};
    private commandList: Array<{[key: string]: any}>;
    private keyTimer: {[key: string]: number};
    constructor(roles: {[key: string]: Role}) {
        this.roles = roles;
        this.commandList = [
            {
                code: "MoveRight",
                frames: 20,
            },
            {
                code: "Jump",
                frames: 20,
            },
            {
                code: "MoveRight",
                frames: 1000,
            },
        ];
        this.keyTimer = {};
    }
    public start() {
        this.main();
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
