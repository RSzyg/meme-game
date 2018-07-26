import FindPathNode from "./FindPathNode";

export default class AStarNode {
    public static start: FindPathNode;
    // public static end: FindPathNode;
    public H: number; // gauss now to end
    public F: number;
    public G: number; // from start to now

    constructor(now: FindPathNode) {
        this.H = 1;
        this.G = 1;
        this.F = this.H + this.G;
    }
}