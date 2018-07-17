import Storage from "./Storage";

/**
 * @prop {number} direction
 * @prop {numebr} speed
 * @prop {string} hostId
 * @prop {number} selfX
 * @prop {number} selfY
 * @prop {number} selfWidth
 * @prop {number} selfHeight
 */
export default class Bullet {
    public direction: number; // left, up, right, down
    public speed: number;
    public hostId: string;
    private selfX: number;
    private selfY: number;
    private selfWidth: number = 20;
    private selfHeight: number = 20;
    /**
     * Create a bullet
     * @param {number} x - Initial x axis
     * @param {number} y - Initial y axis
     * @param {number} speed - Initial speed
     * @param {string} hostId - The id of the role that the bullet belongs to
     * @param {string} direction - The bullet's direction
     */
    constructor(x: number, y: number, speed: number, hostId: string, direction: string) {
        this.selfX = x;
        this.selfY = y;
        this.speed = speed;
        this.hostId = hostId;
        if (direction === "left") {
            this.direction = 0;
        } else {
            this.direction = 2;
        }
    }

    /**
     * Get x axis
     * @returns {number}
     */
    public get x(): number {
        return this.selfX;
    }

    /**
     * Set x axis
     * @param {number} x
     */
    public set x(x: number) {
        this.selfX = x;
    }

    /**
     * Get y axis
     * @returns {number}
     */
    public get y(): number {
        return this.selfY;
    }

    /**
     * Set y axis
     * @param {number}
     */
    public set y(y: number) {
        this.selfY = y;
    }

    /**
     * Get role's width
     * @returns {number}
     */
    public get width(): number {
        return this.selfWidth;
    }

    /**
     * Set role's width
     * @param {number}
     */
    public set width(width: number) {
        this.selfWidth = width;
    }

    /**
     * Get role's height
     * @returns {number}
     */
    public get height(): number {
        return this.selfHeight;
    }

    /**
     * Set role's height
     * @param {number}
     */
    public set height(height: number) {
        this.selfHeight = height;
    }

    /**
     * Control the bullet moving
     */
    public move() {
        this.x += this.speed * Storage.dx[this.direction];
        this.x = (this.x + Storage.sceneWidth) % Storage.sceneWidth;
    }

    /**
     * Rendering the bullet
     */
    public render() {
        Storage.main.ctx.drawImage(
            Storage.images.funny,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }
}
