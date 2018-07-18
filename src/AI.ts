import Main from "./Main";
import Role from "./Role";
import Storage from "./Storage";

/**
 * @export
 * @class AI
 */
export default class AI {
    private player: Role;
    private computer: Role;
    private main: Main;
    private route: number[]; // 1 for up, 2 for down, 3 for right, 4 for left and 0 for adjust position
    private roleId: string;
    private keyMap: {[key: string]: {[key: string]: number}};
    constructor(main: Main, roleId: string) {
        this.main = main;
        this.route = [0];
        this.computer = main.Role[roleId];
        this.roleId = roleId;
        this.keyMap = {
            2: {
                up: 38,
                right: 37,
                left: 39,
                attack: 191,
                defense: 190,
            },
            3: {
                up: 82,
                right: 71,
                left: 68,
                attack: 49,
                defense: 192,
            },
        };
    }
    /**
     * 37 ← 2
     * 38 ↑ 2
     * 39 → 2
     * 68 D left 3
     * 82 R up 3
     * 71 G right 3
     * 49 1 attack 3
     * 190 . defense 2
     * 192 ` defense 3
     * 191 / attack 2
     */
    public run() {
        this.search ();
        // to do
        this.main.aiKeyboardController("keydown", this.keyMap[this.roleId].attack);
        setTimeout(() => this.main.aiKeyboardController("keyup", this.keyMap[this.roleId].attack), 1);
        // setTimeout(() => this.run(), 2);
        // this.main.aiKeyboardController("keydown", 38);
        // for (const dir of this.route) {
        //     switch (dir) {
        //         // case 1:
        //     }
        // }
    }
    private search() {
        // to do
        this.route = [1, 1, 1, 1, 1];
    }
}
