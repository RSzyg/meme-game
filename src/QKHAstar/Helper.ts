export default class Helper {
    public static CopyArray<T>(arr: T[]): T[] {
        return arr.slice(0);
    }
    public static CopyArray2<T>(arr2: T[][]): T[][] {
        const ans: T[][] = [];
        for (const arr of arr2) {
            ans.push(Helper.CopyArray<T>(arr));
        }
        return ans;
    }
}
