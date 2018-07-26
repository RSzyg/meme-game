export default class PathFinderNodeFast {
    public F: number;
    public G: number;
    public PX: number;
    public PY: number;
    public Status: number;
    public PZ: number;
    public JumpLength: number;

    public UpdateStatus(newStatus: number): PathFinderNodeFast {
        const newNode = new PathFinderNodeFast();
        newNode.F = this.F;
        newNode.G = this.G;
        newNode.PX = this.PX;
        newNode.PY = this.PY;
        newNode.PZ = this.PZ;
        newNode.JumpLength = this.JumpLength;
        newNode.Status = newStatus;
        return newNode;
    }
}

