import IProgramStep from "./program-step";

export default interface IProgram {
    id: string;
    compatibleBoardTypes: string[];
    commands: IProgramStep[];
}