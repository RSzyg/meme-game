/**
 * ToolKit
 * Include some tool in calculation
 */
export default class PriorityQueue {
    private heap: Array<{[key: string]: any}>;
    private endX: number;
    private endY: number;
    constructor(ex: number, ey: number) {
        this.heap = [];
        this.endX = ex;
        this.endY = ey;
    }

    public get top(): {[key: string]: any} {
        return this.heap[0];
    }

    public get size(): number {
        return this.heap.length;
    }

    public push_back(value: {[key: string]: any}) {
        this.heap.push(value);
        this.siftUp();
        return this.size;
    }

    public pop() {
        const poppedValue = this.top;
        const bottom = this.size - 1;
        if (bottom > 0) {
            this.swap(0, bottom);
        }
        this.heap.pop();
        this.siftDown();
        return poppedValue;
    }

    private siftUp() {
        let node = this.size - 1;
        let parent = Math.floor((node + 1) / 2) - 1;
        while (node > 0 && this.compare(node, parent)) {
            this.swap(node, parent);
            node = parent;
            parent = Math.floor((node + 1) / 2) - 1;
        }
    }

    private siftDown() {
        let node = 0;
        let left = node * 2 + 1;
        let right = (node + 1) * 2;
        while (
            (left < this.size && this.compare(left, node)) ||
            (right < this.size && this.compare(right, node))
        ) {
            const minChild = (right < this.size && this.compare(right, left)) ? right : left;
            this.swap(node, minChild);
            node = minChild;
            left = node * 2 + 1;
            right = (node + 1) * 2;
        }
    }

    private swap(i: number, j: number) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    private compare(i: number, j: number) {
        const iToEndX = Math.abs(this.heap[i].x - this.endX);
        const iToEndY = Math.abs(this.heap[i].y - this.endY);

        const jToEndX = Math.abs(this.heap[j].x - this.endX);
        const jToEndY = Math.abs(this.heap[j].y - this.endY);

        const iToEndStep = iToEndX / 4 + iToEndY / 190;
        const jToEndStep = jToEndX / 4 + jToEndY / 190;

        return  (this.heap[i].route.length + iToEndStep) < (this.heap[j].route.length + jToEndStep);
    }
}
