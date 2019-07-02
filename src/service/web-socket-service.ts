import WebSocketMessage, {WebSocketMessageType} from "../domain/web-socket-message/web-socket-message";
import BoardBroadcast from "../domain/web-socket-message/body/board-broadcast";

class WebSocketService {

    //public connected: boolean = false;

    private socket: WebSocket | null = null;
    private messageReceivedListeners: (() => void)[] = [];
    private connectionOpenListeners: (( connected: boolean ) => void)[] = [];
    private connectionClosedListeners: (( connected: boolean ) => void)[] = [];
    private boardMessageReceivedListeners: ( ( payload: BoardBroadcast ) => void )[] = [];
    private host = window.location.hostname;
   //private host = "192.168.20.13";

    constructor() {
        let socket = this.initializeSocket();

        setInterval( () => {
            if ( socket.readyState === WebSocket.CLOSED ) {
                socket = this.initializeSocket();
            } else {
                this.socket = socket;
            }
        }, 1000 );
    }

    private initializeSocket(): WebSocket {
        let socket = new WebSocket( `ws://${this.host}:3001` );

        socket.addEventListener( 'open', this.handleConnectionOpen.bind( this ) );
        socket.addEventListener( 'close', this.handleConnectionClosed.bind( this ) );
        socket.addEventListener( 'error', this.handleConnectionClosed.bind( this ) );
        socket.addEventListener( 'message', ( message: MessageEvent ) => {
            this.handleMessageReceived( message.data );
        } );

        return socket;
    }

    public addConnectionOpenListener( listener: ( connected: boolean ) => void ): void {
        this.connectionOpenListeners.push( listener );
    }

    public addConnectionClosedListener( listener: ( connected: boolean ) => void ): void {
        this.connectionClosedListeners.push( listener );
    }

    public addMessageReceivedListener( listener: () => void ): void {
        this.messageReceivedListeners.push( listener );
    }

    public addBoardMessageReceivedListener( listener: ( payload: BoardBroadcast ) => void ): void {
        this.boardMessageReceivedListeners.push( listener );
    }

    private handleBoardMessageReceived( message: WebSocketMessage<BoardBroadcast> ): void {
        this.boardMessageReceivedListeners.forEach( listener => listener( message.body! ) );
    }

    private handleConnectionOpen( event: any ): void {
        this.connectionOpenListeners.forEach( listener => listener( true ) );
        //this.connected = true;
        // retrieve boards

    }

    private handleConnectionClosed(): void {
        this.connectionClosedListeners.forEach( listener => listener( false ) );
        //this.connected = false;
    }

    private handleMessageReceived( message: any ): void {
        const _message = WebSocketMessage.fromJSON( message );

        switch ( _message.type ) {
            case WebSocketMessageType.BOARD_BROADCAST:
                this.handleBoardMessageReceived( <WebSocketMessage<BoardBroadcast>> _message );
                break;
        }

        this.messageReceivedListeners.forEach( listener => listener() );
    }

    public send( request: WebSocketMessage<any> ): void {
        this.socket!.send( request.toJSON() );
    }

}

export const webSocketService = new WebSocketService();
export default WebSocketService;
