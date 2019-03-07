'use strict';

import * as vscode from 'vscode';
import Project from '../models/project';
import ProjectManager from '../Core/projectManager';
import { DiskItemType } from '../Tools/enums';
import Configuration from '../Tools/configuration';
import ProjectHtml from './projectHtml';


export default class ContentProvider implements vscode.TextDocumentContentProvider {
    public static readonly scheme = 'duproject';

    constructor() { }

    public provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
        let [target, type] = decodeProjectTarget(uri);

        if (type === DiskItemType.File) {
            if (target) {
                let targetUri = vscode.Uri.parse(target);
                let tDUProject = ProjectManager.LoadJsonURI(targetUri);
                return tDUProject.then((project) => {
                    return ProjectHtml.old_Generate(project, target, type);
                });
            }
            // else raise error

        }
        else if (type === DiskItemType.Folder) {
            if (target) {
                let targetUri = vscode.Uri.parse(target);
                let tDUProject = ProjectManager.LoadProject(targetUri);
                return tDUProject.then((project) => {
                    return ProjectHtml.old_Generate(project, target, type);
                });
            }
            // else raise error
        }
    }

}



// encode an URI inside an handled preview URI
export function encodeProjectUri(uri: vscode.Uri): vscode.Uri {
    const query = JSON.stringify([uri.toString(), DiskItemType.File]);
    return vscode.Uri.parse(`${ContentProvider.scheme}:Target?${query}`);
}

export function encodeProjectFolder(uri: vscode.Uri): vscode.Uri {
    const query = JSON.stringify([uri.toString(), DiskItemType.Folder]);
    return vscode.Uri.parse(`${ContentProvider.scheme}:Target?${query}`);
}

export function decodeProjectTarget(uri: vscode.Uri): [string, DiskItemType] {
    let [target, type] = <[string, DiskItemType]>JSON.parse(uri.query);
    return [target, type];
}
