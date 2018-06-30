import Main from "./Main";

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
    for (let i = 0; i < total; i++) {
        const path: string = imgSrcArr[i];
        name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
        main.images[name] = new Image();
        main.images[name].src = imgSrcArr[i];
        main.images[name].style.width = "54px";
        main.images[name].style.height = "54px";
        main.images[name].onload = () => {
            current++;
            if (current === total) {
                main.createScene();
            }
        };
    }
};
