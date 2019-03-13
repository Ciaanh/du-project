import { Uri } from "vscode";
import { IProject } from "./duModel";

export default class duProject {
    public uri: Uri;
    public name: string;

    public project: IProject;

    public isValidProject(): boolean {
        return true;
    }
}