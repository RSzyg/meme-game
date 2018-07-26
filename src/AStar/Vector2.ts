export default class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public Add(v: Vector2): Vector2 {
        return new Vector2(v.x + this.x, v.y + this.y);
    }
    public Minus(v: Vector2): Vector2 {
        return new Vector2(v.x - this.x, v.y - this.y);
    }
    public Equal(v: Vector2): boolean {
        return (v.x === this.x && v.y === this.y);
    }
    public Division(d: number): Vector2 {
        return new Vector2(this.x / d, this.y / d);
    }
    public Multiply(m: number): Vector2 {
        return new Vector2(this.x * m, this.y * m);
    }
}
