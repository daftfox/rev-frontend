import {webSocketService} from './web-socket-service';
import Boards from "../model/boards";
import BoardBroadcast, {BOARD_BROADCAST_ACTION} from "../domain/web-socket-message/body/board-broadcast";
import IBoard from "../interface/board";
import WebSocketMessage, {
    WebSocketMessageKind,
    WebSocketMessageType
} from "../domain/web-socket-message/web-socket-message";
import BoardRequest, {BoardAction} from "../domain/web-socket-message/body/board-request";
import CommandRequest from "../domain/web-socket-message/body/command-request";

class BoardService {
    private model: Boards;

    constructor( model: Boards ) {
        this.model = model;
        webSocketService.addBoardMessageReceivedListener( this.handleBoardEventReceived.bind( this ) );
    }

    public saveChanges( board: IBoard ): void {
        const payload = {
            action: BoardAction.UPDATE,
            board,
        };
        const request = new WebSocketMessage<BoardRequest>( WebSocketMessageKind.REQUEST, WebSocketMessageType.BOARD_REQUEST, payload );
        webSocketService.send( request );
    }

    public executeCommand( command: string, boardId: string, parameters?: string[] ): void {
        const payload = {
            action: command,
            boardId: boardId,
            parameters: parameters
        };
        const request = new WebSocketMessage<CommandRequest>( WebSocketMessageKind.REQUEST, WebSocketMessageType.COMMAND_REQUEST, payload );
        webSocketService.send( request );
    }

    private handleBoardEventReceived( payload: BoardBroadcast ) {
        switch ( payload.action ) {
            case BOARD_BROADCAST_ACTION.NEW:
                this.model.add( payload.boards );
                break;
            case BOARD_BROADCAST_ACTION.REPLACE:
                this.model.setBoards( payload.boards );
                break;
            case BOARD_BROADCAST_ACTION.UPDATE:
                this.model.update( payload.boards );
                break;
            case BOARD_BROADCAST_ACTION.REMOVE:
                this.model.remove( payload.boards.pop()! );
                break;
        }
    }
}

export default BoardService;
