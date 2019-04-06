import { HandlerErrorReason, MethodErrorReason, SlotErrorReason, ProjectErrorReason } from "../../../utils/enums";
import { Uri } from "vscode";
import { IProject, IMethod, IHandler } from "./dumodel";

export class duProject {
    public rootUri: Uri;
    public name: string;

    public project: IProject;

    public projectErrors: ProjectError;

}

export class ProjectError {
    constructor(projectError: ProjectErrorReason, methodsErrors: methodFileError[], slotErrors: slotError[]) {
        this.methodsErrors = methodsErrors;
        this.slotErrors = slotErrors;
        this.projectError = projectError;
    }

    public projectError: ProjectErrorReason;
    public methodsErrors: methodFileError[];
    public slotErrors: slotError[];
}

export class slotError {
    public index: number;

    public methodsErrors: methodFileError[];
    public handlerErrors: handlerFileError[];

    public slotErrors: SlotErrorReason[];

    constructor(index: number) {
        this.index = index;
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