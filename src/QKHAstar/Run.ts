import Main from "../Main";
import Astar from "./AStar";

export default class Run {
    public a: number;
    public main: Main;
    public pathFinder: Astar;
    constructor(main: Main, roleId: string) {
        this.a = 0;
        this.main = main;
        this.pathFinder = new Astar(main, roleId);
        this.pathFinder.Init();
    }
    public run() {
        this.a = 0;
    }
    public attack() {
        // to do
    }
    private Init() {
        // todo
    }
}
