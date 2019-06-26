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
    lastUpdateReceived: string;
    name?: string;
}