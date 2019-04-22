import IBoard from "./board";

export default interface IBoardEvent {
    action: BoardActionType;
    data: IBoard[];
    programId?: string;
}

export enum BoardActionType {
    ADD,
    REMOVE,
    UPDATE,
    UPDATE_ALL
}