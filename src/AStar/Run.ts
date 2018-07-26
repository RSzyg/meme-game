import AStar from "./AStar";
import Map from "./Map";
import Vector2i from "./Vector2i";
import Main from "../Main";
import Position from "../Position";
import Storage from "../Storage";

export default class Run {
    public a: number;
    public map: Map;
    public main: Main;
    public pos2: Position;
    public pos3: Position;
    constructor(main: Main) {
        this.a = 0;
        this.map = new Map();
        this.map.mGrid = Storage.simplifiedMap;
        this.map.InitMap();
        this.map.InitPathFinder();
        this.main = main;
        this.pos2 = new Position();
        this.pos3 = new Position();
    }
    public run() {
        this.a = 0;
        this.pos2.setPos(this.main.Role("2").x, this.main.Role("2").y);
        this.pos3.setPos(this.main.Role("3").x, this.main.Role("3").y);
        console.log(this.map.mPathFinder.FindPath(
            new Vector2i(this.pos2.BlockX, this.pos2.BlockY),
            new Vector2i(this.pos2.BlockX, this.pos2.BlockY),
            // new Vector2i(this.pos3.BlockX, this.pos3.BlockY),
            40,
            40,
            4,
        ));
    }
}
