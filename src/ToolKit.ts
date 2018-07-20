/**
 * ToolKit
 * Include some tool in calculation
 */
export default class ToolKit {
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
