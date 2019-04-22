import { webSocketService } from './web-socket-service';
import IWebSocketMessage, { WebSocketMessageType } from "../interface/web-socket-message";
import Boards from "../model/boards";
import IBoard from "../interface/board";
import {BoardActionType} from "../interface/board-event";

class BoardService {
    private model: Boards;

    constructor( model: Boards ) {
        this.model = model;
        webSocketService.addMessageListener( this.handleBoardEventReceived.bind( this ) );
    }

    private handleBoardEventReceived( webSocketMessage: IWebSocketMessage ) {
        console.log("message received: ", webSocketMessage);
        if ( webSocketMessage.type !== WebSocketMessageType.BOARD_EVENT ) return;
        switch ( webSocketMessage.payload.action ) {
            case BoardActionType.ADD:
                this.model.add( <IBoard> webSocketMessage.payload.data.shift() );
                break;
            case BoardActionType.REMOVE:
                this.model.remove( <IBoard> webSocketMessage.payload.data.shift() );
                break;
            case BoardActionType.UPDATE:
                this.model.update( <IBoard> webSocketMessage.payload.data.shift() );
                break;
            case BoardActionType.UPDATE_ALL:
                this.model.setBoards( <IBoard[]> webSocketMessage.payload.data );
                break;
        }
    }
}

export default BoardService;