import Location from "./Location";
import PathFinderNodeFast from "./PathFinderNode";

export default class Compare {
    private mMatrix: PathFinderNodeFast[][];

    constructor(matrix: PathFinderNodeFast[][]) {
        for (const vec of matrix) {
            this.mMatrix.push(vec.slice(0));
        }
    }

    public Compare(a: Location, b: Location): number {
        if (this.mMatrix[a.xy][a.z].F > this.mMatrix[b.xy][b.z].F) {
            return 1;
        } else if (this.mMatrix[a.xy][a.z].F < this.mMatrix[b.xy][b.z].F) {
            return -1;
        }
        return 0;
    }
}
