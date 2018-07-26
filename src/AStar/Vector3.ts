export default class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public Add(v: Vector3): Vector3 {
        return new Vector3(v.x + this.x, v.y + this.y, v.z + this.z);
    }
    public Minus(v: Vector3): Vector3 {
        return new Vector3(v.x - this.x, v.y - this.y, v.z - this.z);
    }
    public Equal(v: Vector3): boolean {
        return (v.x === this.x && v.y === this.y && v.z === this.z);
    }
    public Division(d: number): Vector3 {
        return new Vector3(this.x / d, this.y / d, this.z / d);
    }
    public Multiply(m: number): Vector3 {
        return new Vector3(this.x * m, this.y * m, this.z * m);
    }
}
