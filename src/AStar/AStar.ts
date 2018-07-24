import Compare from "./Compare";
import {HeuristicFormula, TileType} from "./Enum";
import Location from "./Location";
import Map from "./Map";
import PathFinderNodeFast from "./PathFinderNode";
import PriorityQueue from "./PriorityQueue";
import Stack from "./Stack";
import Vector2i from "./Vector2i";

const Log = (x: number, y: number): number => {
    return Math.log(y) / Math.log(x);
};

// x and y is in contrast to RSzyh's map
export default class AStar {
    public mMap: Map                                = null;
    // Structs
    private nodes: PathFinderNodeFast[][]           = null;
    private touchedLocations: Stack<number>         = null;
    // Variables Declaration
    // Heap variables
    private mGrid: number[][]                       = null;
    private mOpen: PriorityQueue                    = null;
    private mClose: Vector2i[]                      = null;
    private mStop: boolean                          = false;
    private mStopped: boolean                       = true;
    private mFormula: number                        = HeuristicFormula.Manhattan;
    private mDiagonals: boolean                     = true;
    private mHEstimate: number                      = 2;
    private mPunishChangeDirection: boolean         = false;
    private mTieBreaker: boolean                    = false;
    private mHeavyDiagonals: boolean                = false;
    private mSearchLimit: number                    = 2000;
    private mCompletedTime: number                  = 0;
    private mDebugProgress: boolean                 = false;
    private mDebugFoundPath: boolean                = false;
    private mOpenNodeValue: number                  = 1;
    private mCloseNodeValue: number                 = 2;

    // local variables
    private mH: number                              = 0;
    private mLocation: Location                     = null;
    private mNewLocation: number                    = 0;
    private mNode: PathFinderNodeFast               = null;
    private mLocationX: number                      = 0;
    private mLocationY: number                      = 0;
    private mNewLocationX: number                   = 0;
    private mNewLocationY: number                   = 0;
    private mCloseNodeCounter: number               = 0;
    private mGridX: number                          = 0;
    private mGridY: number                          = 0;
    private mGridXMinus1: number                    = 0;
    private mGridXLog2: number                      = 0;
    private mFound: boolean                         = false;
    private mDirection: number[][]                  = [ [0, -1], [1, 0], [0, 1], [-1, 0],
                                                        [1, -1], [1, 1], [-1, 1], [-1, -1]];
    private mEndLocation: number                    = 0;
    private mNewG: number                           = 0;

    constructor(grid: number[][], map: Map) {
        if (Map === null) {
            throw new Error("Map cannot be null");
        }
        if (grid === null) {
            throw new Error("Grid cannot be null");
        }
        this.mMap           = map;
        this.mGrid          = grid;
        this.mGridX         = grid.length;
        this.mGridY         = grid[0].length;
        this.mGridXMinus1   = this.mGridX - 1;
        this.mGridXLog2     = Log(2, this.mGridX);

        if (Log(2, this.mGridX) !== Math.round(Log(2, this.mGridX)) ||
            Log(2, this.mGridY) !== Math.round(Log(2, this.mGridY))) {
                throw new Error("Invalid Grid, size in X and Y must be power of 2");
            }
        if (this.nodes === null || this.nodes.length !== this.mGridX * this.mGridY) {
            this.nodes = new Array<PathFinderNodeFast[]>(this.mGridX * this.mGridY);
            this.touchedLocations = new Stack<number>(this.mGridX * this.mGridY);
            this.mClose = new Array<Vector2i>(this.mGridX * this.mGridY);
        }
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i] = new Array<PathFinderNodeFast>();
        }
        this.mOpen = new PriorityQueue(new Compare(this.nodes));
    }

    /**
     * Getter and Setter
     */
    public get Stopped(): boolean {
        return this.mStopped;
    }
    public get Formula(): HeuristicFormula {
        return this.mFormula;
    }
    public set Formula(value: HeuristicFormula) {
        this.mFormula = value;
    }
    public get Diagonals(): boolean {
        return this.mDiagonals;
    }
    public set Diagonals(value: boolean) {
        this.mDiagonals = value;
        if (this.mDiagonals) {
            this.mDirection = [ [0, -1], [1, 0], [0, 1], [-1, 0],
                                [1, -1], [1, 1], [-1, 1], [-1, -1]];
        } else {
            this.mDirection = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        }
    }
    public get HeavyDiagonals(): boolean {
        return this.mHeavyDiagonals;
    }
    public set HeavyDiagonals(value: boolean) {
        this.mHeavyDiagonals = value;
    }
    public get HeuristicEstimate(): number {
        return this.mHEstimate;
    }
    public set HeuristicEstimate(value: number) {
        this.mHEstimate = value;
    }
    public get PunishChangeDirection(): boolean {
        return this.mPunishChangeDirection;
    }
    public set PunishChangeDirection(value: boolean) {
        this.mPunishChangeDirection = value;
    }
    public get TieBreaker(): boolean {
        return this.mTieBreaker;
    }
    public set TieBreaker(value: boolean) {
        this.mTieBreaker = value;
    }
    public get SearchLimit(): number {
        return this.mSearchLimit;
    }
    public set SearchLimit(value: number) {
        this.mSearchLimit = value;
    }
    public get CompletedTime(): number {
        return this.mCompletedTime;
    }
    public set CompletedTime(value: number) {
        this.mCompletedTime = value;
    }
    public get DebugProgress(): boolean {
        return this.mDebugProgress;
    }
    public set DebugProgress(value: boolean) {
        this.mDebugProgress = value;
    }
    public get DebugFoundPath(): boolean {
        return this.mDebugFoundPath;
    }
    public set DebugFoundPath(value: boolean) {
        this.mDebugFoundPath = value;
    }

    /**
     * Methods
     */
    public FindPathStop(): void {
        this.mStop = true;
    }
    public FindPath(
        start: Vector2i,
        end: Vector2i,
        characterWidth: number,
        characterHeight: number,
        maxCharacterJumpHeight: number,
    ): Vector2i[] {
        while (this.touchedLocations.Count > 0) {
            this.nodes[this.touchedLocations.pop()].length = 0;
        }
        if (this.mGrid[end.x][end.y] === 0) {
            return null;
        }
        this.mFound             = false;
        this.mStop              = false;
        this.mStopped           = false;
        this.mCloseNodeCounter  = 0;
        this.mOpenNodeValue     += 2;
        this.mCloseNodeValue    += 2;
        this.mOpen.Clear();

        this.mLocation.xy = (start.y << this.mGridXLog2) + start.x;
        this.mLocation.z = 0;
        this.mEndLocation = (end.y << this.mGridXLog2) + end.x;
        const firstNode: PathFinderNodeFast = new PathFinderNodeFast();
        firstNode.G = 0;
        firstNode.F = this.mHEstimate;
        firstNode.PX = start.x;
        firstNode.PY = start.y;
        firstNode.PZ = 0;
        firstNode.Status = this.mOpenNodeValue;

        if (this.mMap.IsGround(start.x, start.y - 1)) {
            firstNode.JumpLength = 0;
        } else {
            firstNode.JumpLength = maxCharacterJumpHeight * 2;
        }
        this.nodes[this.mLocation.xy].push(firstNode);
        this.touchedLocations.push(this.mLocation.xy);
        this.mOpen.Push(this.mLocation);

        while (this.mOpen.Count > 0 && !this.mStop) {
            this.mLocation = this.mOpen.Pop();
            if (this.nodes[this.mLocation.xy][this.mLocation.z].Status === this.mCloseNodeValue) {
                continue;
            }
            this.mLocationX = (this.mLocation.xy & this.mGridXMinus1);
            this.mLocationY = (this.mLocation.xy >> this.mGridXLog2);

            if (this.mLocation.xy === this.mEndLocation) {
                this.nodes[this.mLocation.xy][this.mLocation.z] =
                this.nodes[this.mLocation.xy][this.mLocation.z].UpdateStatus(this.mCloseNodeValue);

                this.mFound = true;
                break;
            }
            if (this.mCloseNodeCounter > this.mSearchLimit) {
                this.mStopped = true;
                return null;
            }
            for (let i = 0; i < (this.mDiagonals ? 8 : 4); i++) {
                this.mNewLocationX = this.mLocationX + this.mDirection[i][0];
                this.mNewLocationY = this.mLocationY + this.mDirection[i][1];
                this.mNewLocation = (this.mNewLocationY << this.mGridXLog2) + this.mNewLocationX;

                let onGround: boolean = false;
                let atCeiling: boolean = false;

                if (this.mGrid[this.mNewLocationX][this.mNewLocationY] === 0) {
                    // goto CHILDREN_LOOP_END;
                    continue;
                }
                if (this.mMap.IsGround(this.mNewLocationX, this.mNewLocationY - 1)) {
                    onGround = true;
                } else if (this.mGrid[this.mNewLocationX][this.mNewLocationY + characterHeight] === 0) {
                    atCeiling = true;
                }
                const jumpLength: number = this.nodes[this.mLocation.xy][this.mLocation.z].JumpLength;
                let newJumpLength = jumpLength;

                if (atCeiling) {
                    if (this.mNewLocationX !== this.mLocationX) {
                        newJumpLength = Math.max(maxCharacterJumpHeight * 2 + 1, jumpLength + 1);
                    } else {
                        newJumpLength = Math.max(maxCharacterJumpHeight * 2, jumpLength + 2);
                    }
                } else if (onGround) {
                    newJumpLength = 0;
                } else if (this.mNewLocationY > this.mLocationY) {
                    if (jumpLength < 2) {
                        newJumpLength = 3;
                    } else if (jumpLength % 2 === 0) {
                        newJumpLength = jumpLength + 2;
                    } else {
                        newJumpLength = jumpLength + 1;
                    }
                } else if (this.mNewLocationY < this.mLocationY) {
                    if (jumpLength % 2 === 0) {
                        newJumpLength = Math.max(maxCharacterJumpHeight * 2, jumpLength + 2);
                    } else {
                        newJumpLength = Math.max(maxCharacterJumpHeight * 2, jumpLength + 1);
                    }
                } else if (!onGround && this.mNewLocationX !== this.mLocationX) {
                    newJumpLength = jumpLength + 1;
                }

                if (jumpLength >= 0 && jumpLength % 2 !== 0 && this.mLocationX !== this.mNewLocationX) {
                    continue;
                }

                if (jumpLength >= maxCharacterJumpHeight * 2 && this.mNewLocationY > this.mLocationY) {
                    continue;
                }

                if (newJumpLength >= maxCharacterJumpHeight * 2 + 6 && this.mNewLocationX !== this.mLocationX
                && (newJumpLength - (maxCharacterJumpHeight * 2 + 6)) % 8 !== 3) {
                    continue;
                }

                this.mNewG = this.nodes[this.mLocation.xy][this.mLocation.z].G
                + this.mGrid[this.mNewLocationX][this.mNewLocationY] + newJumpLength / 4;

                if (this.nodes[this.mNewLocation].length > 0) {
                    let lowestJump: number = 32767;
                    let couldMoveSideways = false;
                    for (const Loc of this.nodes[this.mNewLocation]) {
                        if (Loc.JumpLength < lowestJump) {
                            lowestJump = Loc.JumpLength;
                        }
                        if (Loc.JumpLength % 2 === 0 && Loc.JumpLength < maxCharacterJumpHeight * 2 + 6) {
                            couldMoveSideways = true;
                        }
                    }
                    if (lowestJump <= newJumpLength && (newJumpLength % 2 !== 0
                        || newJumpLength >= maxCharacterJumpHeight * 2 + 6 || couldMoveSideways)) {
                        continue;
                    }
                }
                switch (this.mFormula) {
                    case HeuristicFormula.Manhattan:
                        this.mH = this.mHEstimate *
                        (Math.abs(this.mNewLocationX - end.x) + Math.abs(this.mNewLocationY - end.y));

                        break;
                    case HeuristicFormula.MaxDXDY:
                        this.mH = this.mHEstimate *
                        (Math.max(Math.abs(this.mNewLocationX - end.x), Math.abs(this.mNewLocationY - end.y)));
                        break;
                    case HeuristicFormula.DiagonalShortCut:
                        const hDiagonal =
                        Math.min(Math.abs(this.mNewLocationX - end.x), Math.abs(this.mNewLocationY - end.y));
                        const hStraight =
                        (Math.abs(this.mNewLocationX - end.x) + Math.abs(this.mNewLocationY - end.y));
                        this.mH = (this.mHEstimate * 2) * hDiagonal + this.mHEstimate * (hStraight - 2 * hDiagonal);
                        break;
                    case HeuristicFormula.Euclidean:
                        this.mH = (this.mHEstimate * Math.sqrt(Math.pow((this.mNewLocationY - end.x), 2)
                        + Math.pow((this.mNewLocationY - end.y), 2)));
                        break;
                    case HeuristicFormula.EuclideanNoSQR:
                        this.mH = (this.mHEstimate *
                            (Math.pow((this.mNewLocationX - end.x), 2) + Math.pow((this.mNewLocationY - end.y), 2)));
                    case HeuristicFormula.Custom1:
                        const dxy: Vector2i = new Vector2i(Math.abs(end.x - this.mNewLocationX),
                                                 Math.abs(end.y - this.mNewLocationY));
                        const Orthogonal: number = Math.abs(dxy.x - dxy.y);
                        const Diagonal: number = Math.abs(((dxy.x + dxy.y) - Orthogonal) / 2);
                        this.mH = this.mHEstimate * (Diagonal + Orthogonal + dxy.x + dxy.y);
                        break;
                    default:
                }
                const newNode: PathFinderNodeFast = new PathFinderNodeFast();
                newNode.JumpLength = newJumpLength;
                newNode.PX = this.mLocationX;
                newNode.PY = this.mLocationY;
                newNode.PZ = this.mLocation.z;
                newNode.G = this.mNewG;
                newNode.F = this.mNewG + this.mH;
                newNode.Status = this.mOpenNodeValue;

                if (this.nodes[this.mNewLocation].length === 0) {
                    this.touchedLocations.push(this.mNewLocation);
                }
                this.nodes[this.mNewLocation].push(newNode);
                this.mOpen.Push(new Location(this.mNewLocation, this.nodes[this.mNewLocation].length - 1));
                // CHILDREN_LOOP_END:
                // continue;
            }
            this.nodes[this.mLocation.xy][this.mLocation.z] =
            this.nodes[this.mLocation.xy][this.mLocation.z].UpdateStatus(this.mCloseNodeValue);

            this.mCloseNodeCounter++;
        }
        if (this.mFound) {
            this.mClose.length = 0;
            let posX = end.x;
            let posY = end.y;

            let fPrevNodeTmp = new PathFinderNodeFast();
            let fNodeTmp = this.nodes[this.mEndLocation][0];

            let fNode = end;
            let fPrevNode = end;

            let loc = (fNodeTmp.PY << this.mGridXLog2) + fNodeTmp.PX;

            while (fNode.x !== fNodeTmp.PX || fNode.y !== fNodeTmp.PY) {
                const fNextNodeTmp = this.nodes[loc][fNodeTmp.PZ];

                if ((this.mClose.length === 0)
                ||  (this.mMap.IsOneWayPlatform(fNode.x, fNode.y - 1))
                ||  (this.mGrid[fNode.x][fNode.y - 1] === 0 && this.mMap.IsOneWayPlatform(fPrevNode.x, fPrevNode.y - 1))
                ||  (fNodeTmp.JumpLength === 3)
                ||  (fNextNodeTmp.JumpLength !== 0 && fNodeTmp.JumpLength === 0)
                ||  (fNodeTmp.JumpLength === 0 && fPrevNodeTmp.JumpLength !== 0)
                ||  (fNode.y > this.mClose[this.mClose.length - 1].y && fNode.y > fNodeTmp.PY)
                ||  (fNode.y < this.mClose[this.mClose.length - 1].y && fNode.y < fNodeTmp.PY)
                ||  ((this.mMap.IsGround(fNode.x - 1, fNode.y) || this.mMap.IsGround(fNode.x + 1, fNode.y))
                   && fNode.y !== this.mClose[this.mClose.length - 1].y
                   && fNode.x !== this.mClose[this.mClose.length - 1].x)
                ) {
                    this.mClose.push(fNode);
                }

                fPrevNode = fNode;
                posX = fNodeTmp.PX;
                posY = fNodeTmp.PY;
                fPrevNodeTmp = fNodeTmp;
                fNodeTmp = fNextNodeTmp;
                loc = (fNodeTmp.PY << this.mGridXLog2) + fNodeTmp.PX;
                fNode = new Vector2i(posX, posY);
            }
            this.mClose.push(fNode);
            this.mStopped = true;
            return this.mClose;
        }
        this.mStopped = true;
        return null;
    }
}
