export default class Storage {
    public static sceneHeight: number = 600;
    public static sceneWidth: number = 800;
    public static images: { [key: string]: HTMLImageElement } = {};
    public static canvas: HTMLCanvasElement;
    public static ctx: CanvasRenderingContext2D;
    // direction move(up, down, left, right)
    public static dx: number[] = [0, 0, -1, 1];
    public static dy: number[] = [-1, 1, 0, 0];
}
