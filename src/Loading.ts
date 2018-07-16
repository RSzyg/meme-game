import Main from "./Main";
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
    // init map
    for (let r = 0; r < 600; r++) {
        Storage.fullyMap[r] = [];
        for (let c = 0; c < 800; c++) {
            const i = Math.floor(r / 40);
            const j = Math.floor(c / 40);
            Storage.fullyMap[r][c] = Storage.simplifiedMap[i][j];
        }
    }
    // load images
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
            }
        };
    }
};
