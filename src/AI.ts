import Main from "./Main";
import Position from "./Position";
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
    private keyMap: {[key: string]: {[key: string]: string}};
    private comPos: Position;
    private pleyerPos: Position;
    private timeout: any[];
    private vis: number[][];

    constructor(main: Main, roleId: string) {
        this.main = main;
        this.route = [0];
        this.computer = main.Role(roleId);
        if (roleId === "2") {
            this.player = main.Role("3");
        } else {
            this.player = main.Role("2");
        }
        this.roleId = roleId;
        this.comPos = new Position();
        this.pleyerPos = new Position();
        this.timeout = [];
        this.keyMap = {
            2: {
                up: "ArrowUp",
                right: "ArrowRight",
                left: "ArrowLeft",
                attack: "KeyZ",
                defense: "KeyX",
            },
            3: {
                up: "Jump",
                right: "MoveRight",
                left: "MoveLeft",
                attack: "Attack",
                defense: "Defense",
            },
        };
    }
    public start() {
        setTimeout(() => {
            this.run();
            this.attack();
        }, 2000);
    }
    private attack() {
        this.simulateKeyboardEvent("keydown", this.keyMap[this.roleId].attack);
        setTimeout(() => this.simulateKeyboardEvent("keyup", this.keyMap[this.roleId].attack), 1);
        setTimeout(() => this.attack(), Math.ceil(Math.random() * 250) + 100);
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
    private run() {
        console.log(this.comPos.BlockX, this.comPos.BlockY, this.pleyerPos.BlockX, this.pleyerPos.BlockY);
        this.clearSetTimeOut();
        this.search ();
        this.helpMove(0, 0);
        setTimeout(() => this.run(), 1000);
    }
    private helpMove(idx: number, time: number) {
        // console.log(time);
        if (idx === this.route.length) {
            return;
        }
        // 1 for up, 2 for down, 3 for right, 4 for left and 0 for adjust position
        switch (this.route[idx]) {
            case 0:
                if (this.computer.horizonDirection === "left") {
                    time += this.move(this.comPos.PixelX % 40, this.keyMap[this.roleId].left, time);
                } else {
                    time += this.move((40 - this.comPos.PixelX % 40) % 40, this.keyMap[this.roleId].right, time);
                }
                break;
            case 1:
                if (this.computer.horizonDirection === "left") {
                    this.move(20, this.keyMap[this.roleId].left, Math.max(1, time - 10));
                } else {
                    this.move(20, this.keyMap[this.roleId].right, Math.max(1, time - 10));
                }
                this.move(4, this.keyMap[this.roleId].up, Math.max(1, time + 10));
                time += 40;
                break;
            case 2:
                time -= 10;
                // time += this.move(40, this.keyMap[this.roleId].down);
                break;
            case 3:
                time += this.move(40, this.keyMap[this.roleId].right, time);
                break;
            case 4:
                time += this.move(40, this.keyMap[this.roleId].left, time);
                break;
        }
        this.helpMove(idx + 1, time + 10);
        // this.timeout.push(setTimeout (() => this.helpMove(idx + 1, 0), time + 10));
    }
    private clearSetTimeOut() {
        for (const time of this.timeout) {
            clearTimeout(time);
        }
    }
    private search() {
        this.vis = [];
        for (const row of Storage.simplifiedMap) {
            const tmpArr = [];
            for (const el of row) {
                tmpArr.push(el);
            }
            this.vis.push(tmpArr);
        }
        this.route = [0];
        this.comPos.setPos(this.computer.x, this.computer.y + this.computer.height);
        this.pleyerPos.setPos(this.player.x, this.player.y + this.player.height);
        this.bfs(this.comPos.BlockX, this.comPos.BlockY, this.pleyerPos.BlockX, this.pleyerPos.BlockY);
        console.log(this.route);
    }
    private checkValidMove(targetX: number, targetY: number, nxtMove: number, route: number[]): boolean {
        if (this.vis[targetY][targetX] === 1) {
            return false;
        }
        if (nxtMove === 0) {
            if (this.vis[(targetY + 1) % 15][targetX] === 1
            || this.vis[(targetY + 2) % 15][targetX] === 1) {
                return false;
            }
            // if (route.length >= 3
            //     && route[route.length - 1] === 0
            //     && route[route.length - 2] === 0
            //     && route[route.length - 3] === 0) {
            //     return false;
            // }
        }
        return true;
    }
    private getArr(arr: number[], dir: number): number[] {
        const tar = [];
        for (const i of arr) {
            tar.push(i);
        }
        tar.push(dir);
        return tar;
    }
    private bfs(startX: number, startY: number, targetX: number, targetY: number) {
        // 1 for up, 2 for down, 3 for right, 4 for left and 0 for adjust position
        const dx: number[] = [0, 0, 1, -1];
        const dy: number[] = [-3, 1, 0, 0];
        const queue = [];
        this.vis[(startY + 15) % 15][(startX + 20) % 20] = 1;
        queue.push({
            x: startX,
            y: startY,
            dis: 0,
            route: [0],
        });
        while (queue.length > 0) {
            const now: {[key: string]: any} = queue.shift();
            if (now.x === targetX && now.y === targetY) {
                this.route = [0];
                now.route.shift();
                for (const i of now.route) {
                    this.route.push(i + 1);
                }
                return;
            }
            for (let i = 0; i < 4; i++) {
                const nxtY: number = (now.y + dy[i] + 15) % 15;
                const nxtX: number = (now.x + dx[i] + 20) % 20;
                if (this.checkValidMove(nxtX, nxtY, i, now.route)) {
                    this.vis[nxtY][nxtX] = 1;
                    queue.push({
                        x: nxtX,
                        y: nxtY,
                        dis: now.dis + 1,
                        route: this.getArr(now.route, i),
                    });
                }
            }
        }
    }
    private dfs(startX: number, startY: number, targetX: number, targetY: number) {
        // to do
    }
    private move(len: number, dir: string, timeout: number): number {
        this.timeout.push(setTimeout(() => {
            this.makeMove(len, dir);
        }, timeout));
        return this.getMoveTime(len);
    }
    private getMoveTime(len: number): number {
        return len * 25 / 6 + 1;
    }
    private makeMove(len: number, dir: string, now: number = 0) {
        if (dir === this.keyMap[this.roleId].up) {
            this.simulateKeyboardEvent("keydown", dir);
            setTimeout(() => {
                this.simulateKeyboardEvent("keyup", dir);
            }, 20);
            return;
        }
        if (now >= len) {
            return;
        }
        this.simulateKeyboardEvent("keydown", dir);
        requestAnimationFrame(() => {
            this.simulateKeyboardEvent("keyup", dir);
            this.makeMove(len, dir, now + 4);
        });
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
}
