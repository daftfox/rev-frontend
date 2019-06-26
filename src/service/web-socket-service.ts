import WebSocketMessage, {WebSocketMessageType} from "../domain/web-socket-message/web-socket-message";
import BoardBroadcast from "../domain/web-socket-message/body/board-broadcast";

class WebSocketService {
    private socket: WebSocket;
    private boardMessageReceivedListeners: ( ( payload: BoardBroadcast ) => void )[] = [];

   private host = window.location.hostname;
   //private host = "192.168.20.13";

    constructor() {
        this.socket = new WebSocket( `ws://${this.host}:3001` );


        this.socket.addEventListener( 'open', this.handleConnectionOpen.bind( this ) );
        this.socket.addEventListener( 'message', ( message: MessageEvent ) => {
            this.handleMessageReceived( message.data );
        } )
    }

    public addBoardMessageReceivedListener( listener: ( payload: BoardBroadcast ) => void ): void {
        this.boardMessageReceivedListeners.push( listener );
    }

    private handleBoardMessageReceived( message: WebSocketMessage<BoardBroadcast> ): void {
        this.boardMessageReceivedListeners.forEach( listener => listener( message.body! ) );
    }

    private handleConnectionOpen( event: any ): void {
        // retrieve boards

    }

    private handleMessageReceived( message: any ): void {
        const _message = WebSocketMessage.fromJSON( message );

        switch ( _message.type ) {
            case WebSocketMessageType.BOARD_BROADCAST:
                this.handleBoardMessageReceived( <WebSocketMessage<BoardBroadcast>> _message );
                break;
        }
    }

    public send( request: WebSocketMessage<any> ): void {
        this.socket.send( request.toJSON() );
    }

}

export const webSocketService = new WebSocketService();
export default WebSocketService;