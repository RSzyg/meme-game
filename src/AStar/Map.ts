import PathFinderFast from "./AStar";
import {HeuristicFormula, TileType} from "./Enum";
import Vector2 from "./Vector2";
import Vector2i from "./Vector2i";
import Vector3 from "./Vector3";

export default class Map {
    public static cTileSize: number = 40;
    public position: Vector3;
    // public tilePrefab: SpriteRenderer;
    public mPathFinder: PathFinderFast;
    public mGrid: number[][];
    public tiles: TileType[][];
    // private tilesSprites: SpriteRenderer[][];
    // public mSpritesContainer: Transform
    public mWidth: number = 50;
    public mHeight: number = 42;

    // public mapRoom: MapRoomData;

    // public gameCamera: Camera;
    // public player: Bot;
    private inputs: boolean[];
    private prevInputs: boolean[];

    private lastMouseTileX = -1;
    private lastMouseTileY = -1;

    // public goLeftKey: KeyCode = KeyCode.A;
    // public goRightKey: KeyCode = KeyCode.D;
    // public goJumpKey: KeyCode = KeyCode.W;
    // public goDownKey: KeyCode = KeyCode.S;

    constructor() {
        // to do
    }

    public GetTile(x: number, y: number): TileType {
        if (x < 0 || x >= this.mWidth || y < 0 || y >= this.mHeight) {
            return TileType.Block;
        }
        return this.tiles[x][y];
    }
    public IsOneWayPlatform(x: number, y: number): boolean {
        if (x < 0 || x >= this.mWidth || y < 0 || y >= this.mHeight) {
            return false;
        }
        return (this.tiles[x][y] === TileType.OneWay);
    }
    public IsGround(x: number, y: number): boolean {
        if (x < 0 || x >= this.mWidth || y < 0 || y >= this.mHeight) {
            return false;
        }
        return (this.tiles[x][y] === TileType.OneWay || this.tiles[x][y] === TileType.Block);
    }
    public IsObstacle(x: number, y: number): boolean {
        if (x < 0 || x >= this.mWidth || y < 0 || y >= this.mHeight) {
            return true;
        }
        return (this.tiles[x][y] === TileType.Block);
    }
    public IsNotEmpty(x: number, y: number): boolean {
        if (x < 0 || x >= this.mWidth || y < 0 || y >= this.mHeight) {
            return true;
        }
        return (this.tiles[x][y] !== TileType.Empty);
    }

    public InitPathFinder(): void {
        this.mPathFinder = new PathFinderFast(this.mGrid, this);
        this.mPathFinder.Formula                = HeuristicFormula.Manhattan;
        this.mPathFinder.Diagonals              = false;
        this.mPathFinder.HeavyDiagonals         = false;
        this.mPathFinder.HeuristicEstimate      = 6;
        this.mPathFinder.PunishChangeDirection  = false;
        this.mPathFinder.TieBreaker             = false;
        this.mPathFinder.SearchLimit            = 10000;
        this.mPathFinder.DebugProgress          = false;
        this.mPathFinder.DebugFoundPath         = false;
    }
    // use array to make C# Reference
    public GetMapTileAtPoint(point: Vector2, tileIndex: Vector2): void {
        tileIndex.y = (point.y - this.position.y + Map.cTileSize / 2) / Map.cTileSize;
        tileIndex.x = (point.x - this.position.x + Map.cTileSize / 2) / Map.cTileSize;
    }
    public GetMapTileAtPointVector2(point: Vector2): Vector2i {
        return new Vector2i((point.x - this.position.x + Map.cTileSize / 2) / Map.cTileSize,
                           (point.y - this.position.y + Map.cTileSize / 2) / Map.cTileSize);
    }
    public GetMapTilePosition(tileIndex: Vector2): Vector2 {
        return new Vector2(tileIndex.x * Map.cTileSize + this.position.x,
                           tileIndex.y * Map.cTileSize + this.position.y);
    }
    public GetMapTilePositionVector(tileCoords: Vector2i): Vector2 {
        return new Vector2(tileCoords.x * Map.cTileSize + this.position.x,
                           tileCoords.y * Map.cTileSize + this.position.y);
    }
}
