import IBoard from "../../../interface/board";

export default interface BoardRequest {
    action: BoardAction;
    boardId: string;
    board: IBoard;
}

export enum BoardAction {
    REQUEST = 'request',
    UPDATE = 'update',
    DELETE = 'delete',
}