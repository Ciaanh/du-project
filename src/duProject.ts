import { Uri } from "vscode";
import { IProject, IMethod } from "./duModel";
import { MethodErrorReason } from "./utils/enums";

export class duProject {
    public rootUri: Uri;
    public name: string;

    public project: IProject;
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