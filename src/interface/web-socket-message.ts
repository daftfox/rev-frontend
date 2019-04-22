import IBoardEvent from "./board-event";
import ICommandEvent from "./command-event";

export default interface IWebSocketMessage {
    type: WebSocketMessageType;
    payload: IBoardEvent | ICommandEvent;
}

export enum WebSocketMessageType {
    BOARD_EVENT,
    COMMAND_EVENT,
    PROGRAM_EVENT
}