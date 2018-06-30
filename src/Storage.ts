export default class Storage {
    public static sceneHeight: number = 600;
    public static sceneWidth: number = 800;
    public static images: { [key: string]: HTMLImageElement } = {};
    public static canvas: HTMLCanvasElement;
    public static ctx: CanvasRenderingContext2D;
}
