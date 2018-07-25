import Main from "../Main";
import Storage from "../Storage";
import AStarNode from "./AStarNode";
import FindPathNode from "./FindPathNode";
import Helper from "./Helper";
import Location from "./Location";
import PriorityQueue from "./PriorityQueue";

export default class AStar {
    private map: number[][];
    private main: Main;
    private dx: number[];
    private dy: number[];
    private RouteList: Array<{[key: string]: any}>;
    private Timer: {[key: string]: number};
    private BotRoleId: string;
    private vis: boolean[][][];
    private moveSpeed: number;
    private initJumpSpeed: number;
    private jumpSpeed: number;
    private gravity: number;
    private start: FindPathNode;
    private end: FindPathNode;

    constructor(main: Main, roleId: string) {
        this.map = Helper.CopyArray2<number>(Storage.fullyMap);
        this.main = main;
        this.BotRoleId = roleId;
    }
    public Init(): void {
        this.moveSpeed = this.main.Role(this.BotRoleId).moveSpeed;
        this.initJumpSpeed = this.main.Role(this.BotRoleId).initJumpSpeed;
        this.jumpSpeed = this.main.Role(this.BotRoleId).jumpSpeed;
        this.gravity = -1;
        // start = new FindPathNode();
    }
    public FindPath() {
        // const Start
    }
    private checkVilad() {
        // to do
    }
    private checkEnd() {
        // to do
    }
}
