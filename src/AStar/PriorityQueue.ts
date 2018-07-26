import Compare from "./Compare";
import Location from "./Location";

export default class PriorityQueue {
    private queue: Location[];
    private mComparer: Compare;

    constructor(comparer: Compare) {
        this.mComparer = comparer;
    }

    /**
     * Push an object onto the PQ
     *
     * @param item The new object
     *
     * @returns number   The index in the list where the object is _now_.
     *                   This will change when objects are taken from or put onto the PQ.
     */
    public Push(item: Location): number {
        let p: number = this.queue.length;
        let p2: number;
        this.queue.push(item);
        do {
            if (p === 0) {
                break;
            }
            p2 = (p - 1) / 2;
            if (this.OnCompare(p, p2) < 0) {
                this.SwitchElements(p, p2);
                p = p2;
            } else {
                break;
            }
        } while (true);
        return p;
    }
    /**
     * Get the smallest object and remove it.
     *
     * @returns T Get the smallest object and remove it.
     */
    public Pop(): Location {
        const result: Location = this.queue[0];
        let p: number = 0;
        let p1: number;
        let p2: number;
        let pn: number;
        this.queue[0] = this.queue[this.queue.length - 1];
        this.queue.pop();
        do {
            pn = p;
            p1 = 2 * p + 1;
            p2 = 2 * p + 2;
            if (this.queue.length > p1 && this.OnCompare(p, p1) > 0) {
                p = p1;
            }
            if (this.queue.length > p2 && this.OnCompare(p, p2) > 0) {
                p = p2;
            }
            if (p === pn) {
                break;
            }
            this.SwitchElements(p, pn);
        } while (true);
        return result;
    }
    /**
     * Notify the PQ that the object at position i has changed
     * and the PQ needs to restore order.
     * Since you dont have access to any indexes (except by using the
     * explicit IList.this) you should not call this function without knowing exactly
     * hat you do.
     *
     * @param i The index of the changed object.
     */
    public Update(i: number): void {
        let p: number = i;
        let pn: number;
        let p1: number;
        let p2: number;
        do {
            if (p === 0) {
                break;
            }
            p2 = (p - 1) / 2;
            if (this.OnCompare(p, p2) < 0) {
                this.SwitchElements(p, p2);
                p = p2;
            } else {
                break;
            }
        } while (true);
        if (p < i) {
            return;
        }
        do {
            pn = p;
            p1 = 2 * p + 1;
            p2 = 2 * p + 2;
            if (this.queue.length > p1 && this.OnCompare(p, p1) > 0) {
                p = p1;
            }
            if (this.queue.length > p2 && this.OnCompare(p, p2) > 0) {
                p = p2;
            }
            if (p === pn) {
                break;
            }
            this.SwitchElements(p, pn);
        } while (true);
    }
    /**
     * Get the smallest object without removing it.
     *
     * @returns T The smallest object
     */
    public Peek(): Location {
        if (this.queue.length > 0) {
            return this.queue[0];
        }
        return new Location(0, 0);
    }
    /**
     * Clear this queue
     */
    public Clear(): void {
        this.queue.length = 0;
    }
    /**
     * Get the size of Queue
     */
    public get Count(): number {
        return this.queue.length;
    }
    /**
     * Delete an item from queue
     *
     * @param item T The item you want to delete
     */
    public RemoveLocation(item: Location): void {
        let index: number = -1;
        for (let i = 0; i < this.queue.length; i++) {
            if (this.mComparer.Compare(item, this.queue[i]) === 0) {
                index = i;
            }
        }
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }
    public indexOf(i: number): Location {
        return this.queue[i];
    }
    public setIndexOf(i: number, item: Location): void {
        this.queue[i] = item;
        this.Update(i);
    }
    private SwitchElements(i: number, j: number): void {
        const tmp = this.queue[i];
        this.queue[i] = this.queue[j];
        this.queue[j] = tmp;
    }
    private OnCompare(i: number, j: number): number {
        return this.mComparer.Compare(this.queue[i], this.queue[j]);
    }
}
