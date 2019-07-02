import IBoard from "../../../interface/board";

export default interface BoardBroadcast {
    action: BOARD_BROADCAST_ACTION;
    boards: IBoard[];
}

export enum BOARD_BROADCAST_ACTION {
    NEW = 'NEW',
    UPDATE = 'UPDATE',
    REMOVE = 'REMOVE',
    REPLACE = 'REPLACE',
}
