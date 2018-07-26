export default class Vector2i {
    public static add(v1: Vector2i, v2: Vector2i): Vector2i {
        return new Vector2i(v1.x + v2.x, v1.y + v2.y);
    }
    public static equalTo(v1: Vector2i, v2: Vector2i): boolean {
        return (v1.x === v2.x && v1.y === v2.y);
    }

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public equalTo(v: Vector2i): boolean {
        return (this.x === v.x && this.y === v.y);
    }
}
