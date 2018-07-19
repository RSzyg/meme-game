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
    private timeout: number[];
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
        this.clearSetTimeOut();
        this.search ();
        this.helpMove(0, 0);
        this.simulateKeyboardEvent("keydown", this.keyMap[this.roleId].attack);
        setTimeout(() => this.simulateKeyboardEvent("keyup", this.keyMap[this.roleId].attack), 1);
        setTimeout(() => this.run(), 1000);
    }
    private helpMove(idx: number, time: number) {
        if (idx === this.route.length) {
            return;
        }
        // 1 for up, 2 for down, 3 for right, 4 for left and 0 for adjust position
        switch (this.route[idx]) {
            case 0:
                let dx: number;
                if (this.computer.horizonDirection === "left") {
                    dx = this.comPos.BlockX * 40 - this.comPos.PixelX;
                } else {
                    dx = (this.comPos.BlockX * 40 - this.comPos.PixelX + 40) % 40;
                }
                if (dx > 0) {
                    time += this.move(dx, this.keyMap[this.roleId].right);
                } else {
                    time += this.move(-dx, this.keyMap[this.roleId].left);
                }
                break;
            case 1:
                time += this.move(40, this.keyMap[this.roleId].up);
                break;
            case 2:
                // time += this.move(40, this.keyMap[this.roleId].down);
                break;
            case 3:
                time += this.move(40, this.keyMap[this.roleId].right);
                break;
            case 4:
                time += this.move(40, this.keyMap[this.roleId].left);
                break;
        }
        this.timeout.push(setTimeout (() => this.helpMove(idx + 1, 0), time + 10));
    }
    private clearSetTimeOut() {
        for (const time of this.timeout) {
            clearTimeout(time);
        }
    }
    private search() {
        this.vis = [];
        for (let i = 0; i < Storage.simplifiedMap.length; i++) {
            const tmpArr = [];
            for (let j = 0; j < Storage.simplifiedMap[i].length; j++) {
                tmpArr.push(Storage.simplifiedMap[i][j]);
            }
            this.vis.push(tmpArr);
        }
        this.route = [0];
        this.comPos.setPos(this.computer.x, this.computer.y + this.computer.height);
        this.pleyerPos.setPos(this.player.x, this.player.y + this.player.height);
        console.log(this.comPos.BlockX, this.comPos.BlockY, this.pleyerPos.BlockX, this.pleyerPos.BlockY);
        this.bfs(this.comPos.BlockX, this.comPos.BlockY, this.pleyerPos.BlockX, this.pleyerPos.BlockY);
        // this.bfs(9, 6, 17, 10);
        console.log(this.route);
    }
    private checkValidMove(targetX: number, targetY: number): boolean {
        if (targetX < 0 || targetY < 0 || targetX >= this.vis.length || targetY >= this.vis[targetX].length) {
            return false;
        }
        if (this.vis[targetX][targetY] === 1) {
            return false;
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
        const dy: number[] = [-1, 1, 0, 0];
        const queue = [];
        this.vis[startX][startY] = 1;
        queue.push({
            x: startX,
            y: startY,
            dis: 0,
            route: [0],
        });
        while (queue.length > 0) {
            const now = queue.shift();
            // console.log(now.x, now.y, this.vis[now.x][now.y]);
            if (now.x === targetX && now.y === targetY) {
                this.route = [0];
                for (const i of now.route) {
                    this.route.push(i + 1);
                }
                return;
            }
            for (let i = 0; i < 4; i++) {
                if (this.checkValidMove(now.x + dx[i], now.y + dy[i])) {
                    this.vis[now.x + dx[i]][now.y + dy[i]] = 1;
                    queue.push({
                        x: now.x + dx[i],
                        y: now.y + dy[i],
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
    private move(len: number, dir: string): number {
        this.makeMove(len, dir);
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
            }, 5);
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
