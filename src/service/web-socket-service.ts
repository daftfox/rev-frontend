import WebSocketEvent, { WebSocketEventType } from "../domain/web-socket-event";
import { boards as model } from "../model/boards";
import IBoard from "../interface/board";

class WebSocketService {
    private socket: WebSocket;

    host = 'localhost';
    port = '80';

    constructor() {
        this.socket = new WebSocket( `ws://${this.host}:${this.port}` );

        this.socket.addEventListener( 'open', this.handleConnectionOpen.bind( this ) );
        this.socket.addEventListener( 'message', this.handleMessageReceived.bind( this ) )
    }

    private handleConnectionOpen( event: any ): void {
        // console.log( event );
        // do something
    }

    private handleMessageReceived( message: MessageEvent ): void {
        const event = <WebSocketEvent>JSON.parse( message.data );

        switch ( event.type ) {
            case WebSocketEventType.ADD_BOARD:
                model.add( <IBoard> event.payload );
                break;
            case WebSocketEventType.REMOVE_BOARD:
                model.remove( event.payload );
                break;
            case WebSocketEventType.UPDATE_BOARD:
                model.update( event.payload );
                break;
            case WebSocketEventType.UPDATE_ALL_BOARDS:
                model.setBoards( <IBoard[]> event.payload );
                break;
        }
    }

    public sendCommand( boardId: string, command: string ): void {
        this.socket.send( JSON.stringify( { boardId: boardId, method: command } ) );
    }

}

export const webSocketService = new WebSocketService();
export default WebSocketService;