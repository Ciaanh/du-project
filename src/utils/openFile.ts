'use strict';

import * as vscode from "vscode";
import { DiskItemType } from './enums';
import ProjectFileDescription from "../models/projectFileDescription";


export class PickResult {
    public readonly item: string;
    public readonly type: DiskItemType;

    constructor(item: string, type: DiskItemType) {
        this.item = item;
        this.type = type;
    }
}

export default class ProjectPicker {

    private statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(this.statusBar);
    }

    public async pickFolder(callback: Function) {
        const directories = await this.listDirectoryFolders();
        this.showPickList(directories, callback);
    }

    public pickFile(callback: Function) {
        this.showPickList(this.listDirectoryFiles(), callback);
    }

    private showPickList(itemList: vscode.QuickPickItem[] | Thenable<vscode.QuickPickItem[]>, callback: Function) {
        vscode.window.showQuickPick(itemList).then(item => {
            if (!item) {
                console.log("canceled pick");
                return;
            }
            callback(vscode.Uri.parse(item.description));
        });
    }

    private listDirectoryFiles(): Thenable<vscode.QuickPickItem[]> {
        let results = vscode.workspace.findFiles('**/*.json');

        return results.then((items) => {
            return items.map<vscode.QuickPickItem>((value) => {
                let valuePath = value.path.split("/");
                let projectJsonName = valuePath[valuePath.length - 1].replace(".json", "");

                return {
                    description: value.toString(),
                    label: projectJsonName,
                };
            });
        })
    }

    private async listDirectoryFolders(): Promise<vscode.QuickPickItem[]> {
        let workspaces = vscode.workspace.workspaceFolders;
        if (workspaces) {
            const quickPickItemByWorkspace = await Promise.all(workspaces.map(async workspaceFolder => {
                const content = await this.getDuFolders(workspaceFolder.uri);

                const quickPickItems: vscode.QuickPickItem[] = content.map((folder) => {
                    let folderUri = vscode.Uri.file(workspaceFolder.uri.fsPath + "\\" + folder);
                    let documentpath = folderUri.path.split("/");
                    let documentName = documentpath[documentpath.length - 1].replace("du_", "");

                    return {
                        description: folderUri.toString(),
                        label: documentName,
                    };
                });
                return quickPickItems;
            }));
            return [].concat(...quickPickItemByWorkspace);
        }
        return null;
    }

    private async getDuFolders(folderUri: vscode.Uri): Promise<Array<string>> {
        const elements = await ProjectFileDescription.readDirectory(folderUri)

        const refinedElements = await Promise.all(elements.map(async element => {
            let elementUri = vscode.Uri.file(folderUri.fsPath + "\\" + element);

            const stats = await ProjectFileDescription.readFileStats(elementUri);
            if (stats.isDirectory()) {
                let documentpath = elementUri.path.split("/");
                let documentName = documentpath[documentpath.length - 1];

                if (documentName.indexOf("du_") > -1) {
                    // it's a du project folder
                    return element;
                }
                return undefined;
            }
        }));

        const results = refinedElements.filter(value => {
            if (value) return true;
            return false;
        });
        return results;
    }
}