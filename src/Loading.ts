import Main from "./Main";
import Storage from "./Storage";

window.onload = () => {
    const main: Main = new Main();
    const imgSrcArr: string[] = [
        "./resource/up.jpg",
        "./resource/down.jpg",
        "./resource/left.jpg",
        "./resource/right.jpg",
        "./resource/attack.jpg",
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
