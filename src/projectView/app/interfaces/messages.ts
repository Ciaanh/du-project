import { methodFileError } from "./vsmodel";

export interface IMessage {
    command: string;
    data: any;
}

export interface IFixMethodErrorMessage {
    command: string;
    methodError: methodFileError;
}