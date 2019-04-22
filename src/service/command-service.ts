import {webSocketService} from "./web-socket-service";
import {WebSocketMessageType} from "../interface/web-socket-message";


class CommandService {
    public static executeCommand( boardId: string, action: string ): void {
        webSocketService.send( WebSocketMessageType.COMMAND_EVENT, { boardId: boardId, action: action } );
    }
}

export default CommandService;