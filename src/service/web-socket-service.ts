import IWebSocketMessage, {WebSocketMessageType} from "../interface/web-socket-message";
import IBoardEvent from "../interface/board-event";
import ICommandEvent from "../interface/command-event";

class WebSocketService {
    private socket: WebSocket;
    private messageListeners: ( ( message: IWebSocketMessage ) => void )[] = [];

    host = '192.168.20.13';
    port = '80';

    constructor() {
        this.socket = new WebSocket( `ws://${this.host}:${this.port}/socket` );

        this.socket.addEventListener( 'open', this.handleConnectionOpen.bind( this ) );
        this.socket.addEventListener( 'message', this.handleMessageReceived.bind( this ) )
    }

    public addMessageListener( listener: ( message: IWebSocketMessage ) => void ): void {
        this.messageListeners.push( listener );
    }

    private handleConnectionOpen( event: any ): void {
        // console.log( event );
        // do something
    }

    private handleMessageReceived( message: MessageEvent ): void {
        const parsedMessage = <IWebSocketMessage>JSON.parse( message.data );
        this.messageListeners.forEach( listener => listener( parsedMessage ) );
    }

    public send( type: WebSocketMessageType, payload: IBoardEvent | ICommandEvent ): void {
        this.socket.send( JSON.stringify( { type: type, payload: payload } ) );
    }

}

export const webSocketService = new WebSocketService();
export default WebSocketService;