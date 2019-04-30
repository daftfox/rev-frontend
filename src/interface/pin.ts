export default interface IPin {
    pinNumber: number;
    mode: PIN_MODE;
    value: PIN_STATE | number;
    supportedModes: PIN_MODE[];
    analog: boolean;
    [prop: string]: any;
}

export enum PIN_MODE {
    INPUT = 0x00,
    OUTPUT = 0x01,
    ANALOG = 0x02,
    PWM = 0x03,
    SERVO = 0x04,
    SHIFT = 0x05,
    I2C = 0x06,
    ONEWIRE = 0x07,
    STEPPER = 0x08,
    SERIAL = 0x0A,
    PULLUP = 0x0B,
    IGNORE = 0x7F,
    PING_READ = 0x75,
    UNKNOWN = 0x10,
}

export enum PIN_STATE {
    LOW = 0,
    HIGH = 1
}