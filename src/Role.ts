export default class Role {
  // element properties
  private _height: number;
  private _width: number;
  private _x: number;
  private _y: number;
  // basic properties
  private _status: string; // left, right, up, down and blabla(default left)
  public healthPoint: number;
  public maxHealthPoint: number;
  public attackPower: number;
  public moveSpeed: number;
  public jumpSpeed: number;

  constructor(data: {[key: string]: number}) {
    // element properties
    this._height = data.height;
    this._width = data.width;
    this._x = data.x;
    this._y = data.y;
    // basic properties
    this._status = 'left';
    this.healthPoint = this.maxHealthPoint = data.maxHealthPoint;
    this.attackPower = data.attackPower;
    this.moveSpeed = data.moveSpeed;
    this.jumpSpeed = data.jumpSpeed;
  }

  // element properties setter & getter
  public get x(): number {
    return this._x;
  }
  public set x(x: number) {
    this._x  = x;
  }

  public get y(): number {
    return this._y;
  }
  public set y(y: number) {
    this._y  = y;
  }

  public get height(): number {
    return this._height;
  }
  public set height(height: number) {
    this._height  = height;
  }

  public get width(): number {
    return this._width;
  }
  public set width(width: number) {
    this._width  = width;
  }

  public get status(): string {
    return this._status;
  }
  public set status(status: string) {
    this._status  = status;
  }

  // rendering
  public render() {
  }
}
