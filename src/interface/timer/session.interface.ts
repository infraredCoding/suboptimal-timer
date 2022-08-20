import { Solve } from "./solve.interface";

export default interface Session {
    _id: string,
    name: string,
    puzzle: string,
    solveList: Solve[]
}