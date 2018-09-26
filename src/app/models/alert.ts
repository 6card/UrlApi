export interface Alert {
    type: AlertType;
    message: string;
    timeout: number;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}