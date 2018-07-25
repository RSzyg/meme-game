export default class AStarNode {
    public H: number; // gauss now to end
    public F: number;
    public G: number; // from start to now

    constructor(H: number, G: number) {
        this.H = H;
        this.G = G;
        this.F = this.H + this.G;
    }
}