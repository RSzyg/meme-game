import Vector2 from "./Vector2";

export default class AABB {
    private center: Vector2;
    private halfSize: Vector2;

    constructor(center: Vector2, halfSize: Vector2) {
        this.center = center;
        this.halfSize = halfSize;
    }

    public get Center(): Vector2 {
        return this.center;
    }
    public set Center(value: Vector2): void {
        this.center = value;
    }
    public get CenterX(): number {
        return this.center.x;
    }
    public set CenterX(value: number): void {
        this.center.x = value;
    }
    public get CenterY(): number {
        return this.center.y;
    }
    public set CenterY(value: number): void {
        this.center.y = value;
    }
    public get HalfSize(): Vector2 {
        return this.halfSize;
    }
    public set HalfSize(value: Vector2): void {
        this.halfSize = value;
    }
    public get HalfSizeX(): number {
        return this.halfSize.x;
    }
    public set HalfSizeX(value: number): void {
        this.halfSize.x = value;
    }
    public get HalfSizeY(): number {
        return this.halfSize.y;
    }
    public set HalfSizeY(value: number): void {
        this.halfSize.y = value;
    }
}