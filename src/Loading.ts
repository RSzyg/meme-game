import Main from "./Main";
import AI from "./QKHAstar/Run";
import Storage from "./Storage";

window.onload = () => {
    const main: Main = new Main();
    const imgSrcArr: string[] = [
        "./resource/up-left.png",
        "./resource/up-right.png",
        "./resource/down-left.png",
        "./resource/down-right.png",
        "./resource/walk-left.jpg",
        "./resource/walk-right.jpg",
        "./resource/attack-left.png",
        "./resource/attack-right.png",
        "./resource/defense-left.png",
        "./resource/defense-right.png",
        "./resource/dead.jpeg",
        "./resource/funny.png",
    ];
    const total: number = imgSrcArr.length;
    let current: number = 0;
    let name: string;
    /** Init map */
    for (let r = 0; r < Storage.sceneHeight; r++) {
        Storage.fullyMap[r] = [];
        for (let c = 0; c < Storage.sceneWidth; c++) {
            const i = Math.floor(r / 40);
            const j = Math.floor(c / 40);
            Storage.fullyMap[r][c] = Storage.simplifiedMap[i][j];
        }
    }
    /** Load images */
    for (let i = 0; i < total; i++) {
        const path: string = imgSrcArr[i];
        name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
        Storage.images[name] = new Image();
        Storage.images[name].src = imgSrcArr[i];
        Storage.images[name].style.width = "54px";
        Storage.images[name].style.height = "54px";
        Storage.images[name].onload = () => {
            current++;
            if (current === total) {
                main.createScene();
                const ai = new AI(main, "3");
                ai.run();
            }
        };
    }
};
