import { Uri } from "vscode";
import { IProject, IMethod, IHandler } from "./duModel";
import { MethodErrorReason, HandlerErrorReason, SlotErrorReason } from "../utils/enums";

export class duProject {
    public rootUri: Uri;
    public name: string;

    public project: IProject;
}

export class slotFileError {
    public index: number;

    public methodsErrors: methodFileError[];
    public handlerErrors: handlerFileError[];

    public slotErrors: SlotErrorReason[];

    constructor(index: number) {
        this.methodsErrors = [];
        this.handlerErrors = [];
        this.slotErrors = [];
    }
}

export class methodFileError {
    public reason: MethodErrorReason;

    public uri: Uri;
    public index: number;
    public fileContent: IMethod;
    public jsonContent: IMethod;


    constructor(uri: Uri, index: number, fileContent: IMethod, jsonContent: IMethod, error: MethodErrorReason) {
        this.uri = uri;
        this.index = index;
        this.fileContent = fileContent;
        this.jsonContent = jsonContent;
        this.reason = error;
    }
}

export class handlerFileError {
    public reason: HandlerErrorReason;

    public uri: Uri;
    public key: string;
    public slot: number;

    public fileContent: IHandler;
    public jsonContent: IHandler;


    constructor(uri: Uri, key: string, slot: number, fileContent: IHandler, jsonContent: IHandler, error: HandlerErrorReason) {
        this.uri = uri;
        this.key = key;
        this.slot = slot;
        this.fileContent = fileContent;
        this.jsonContent = jsonContent;
        this.reason = error;
    }
}