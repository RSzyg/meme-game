export default class Storage {
    public static sceneHeight: number = 600;
    public static sceneWidth: number = 800;
    public static images: { [key: string]: HTMLImageElement } = {};
    public static canvas: HTMLCanvasElement;
    public static ctx: CanvasRenderingContext2D;
    // direction move(left, up, right, down)
    public static dx: number[] = [-1, 0, 1, 0];
    public static dy: number[] = [0, -1, 0, 1];
}
