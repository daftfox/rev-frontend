class WebSocketError extends Error {
    public code: number = 500;
    public responseBody = {
        error: 'Generic error',
        message: 'Generic error',
    };

    constructor( message: string ) {
        super( message );

        this.responseBody.message = message;
    }
}

export default WebSocketError;