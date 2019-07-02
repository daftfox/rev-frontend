import IPin from "./pin";

export default interface IBoard {
    id: string;
    vendorId: string;
    productId: string;
    type: string;
    pins: IPin[];
    currentProgram: string;
    availableCommands: { name: string, requiresParams: boolean }[];
    online: boolean;
    serialConnection: boolean;
    lastUpdateReceived: string;
    refreshRate: number;
    pinout: string;
    name?: string;
}
