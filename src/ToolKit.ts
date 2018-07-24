/**
 * ToolKit
 * Include some tool in calculation
 */
export class PriorityQueue {
    private heap: number[];
    constructor() {
        this.heap = [];
    }

    public get top(): number {
        return this.heap[0];
    }

    public get size(): number {
        return this.heap.length;
    }

    public push_back(value: number) {
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
            let minChild = (right < this.size && this.compare(right, node)) ? right : left;
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
        return this.heap[i] < this.heap[j];
    }
}

export class Equation {
    public static solveQuadraticEquation(
        first: number,
        second: number,
        third: number
    ): number[] {
        const solution: number[] = [];
        const delta: number = Math.sqrt(Math.pow(second, 2) - 4 * first * third);
        solution.push((delta - second) / 2 * first);
        solution.push((-delta - second) / 2 * first);
        return solution;
    };
}
