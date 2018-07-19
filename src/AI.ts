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
    private keyMap: {[key: string]: {[key: string]: number}};
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
        // let time = 0;
        // this.comPos.setPos(this.computer.x, this.computer.y);
        this.clearSetTimeOut();
        this.search ();
        this.helpMove(0, 0);
        // console.log(this.comPos.BlockX, this.comPos.PixelX);
        // console.log(this.route);
        // for (const dir of this.route) {
        //     console.log(dir);
        // }
        // time += this.move(40, this.keyMap[this.roleId].right);
        // this.main.aiKeyboardController("keydown", this.keyMap[this.roleId].right);
        // setTimeout(() => this.main.aiKeyboardController("keyup", this.keyMap[this.roleId].right), 1000 / 6);
        // console.log(this.route);
        // to do
        this.main.aiKeyboardController("keydown", this.keyMap[this.roleId].attack);
        setTimeout(() => this.main.aiKeyboardController("keyup", this.keyMap[this.roleId].attack), 1);
        setTimeout(() => this.run(), 1000);
        // this.main.aiKeyboardController("keydown", 38);
        // for (const dir of this.route) {
        //     switch (dir) {
        //         // case 1:
        //     }
        // }
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
    private move(len: number, dir: number): number {
        this.makeMove(len, dir);
        return this.getMoveTime(len);
    }
    private getMoveTime(len: number): number {
        return len * 25 / 6 + 1;
    }
    private makeMove(len: number, dir: number, now: number = 0) {
        if (dir === this.keyMap[this.roleId].up) {
            this.main.aiKeyboardController("keydown", dir);
            setTimeout(() => {
                this.main.aiKeyboardController("keyup", dir);
            }, 5);
            return;
        }
        if (now >= len) {
            return;
        }
        this.main.aiKeyboardController("keydown", dir);
        requestAnimationFrame(() => {
            this.main.aiKeyboardController("keyup", dir);
            this.makeMove(len, dir, now + 4);
        });
    }
}
