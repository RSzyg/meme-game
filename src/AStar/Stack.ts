export default class Stack<T> {
    private sk: T[];
    private sz: number;

    constructor(size: number) {
        this.sk = [];
        this.sz = 0;
        this.sk.length = size;
    }
    public get Count(): number {
        return this.sz;
    }
    public push(newNode: T): void {
        this.sk.push(newNode);
        this.sz++;
    }
    public top(): T {
        return this.sk[this.sz - 1];
    }
    public pop(): T {
        return this.sk.pop();
    }
}
