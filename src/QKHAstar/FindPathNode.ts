export default class FindPathNode {
    public x: number;
    public y: number;
    public v: number;
    public dir: number;

    constructor(x: number, y: number, v: number, dir: number) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.dir = dir;
    }
}