'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";
import DUProject from './duproject'
import ProjectFileDescription from './projectFileDescription';
import { ProjectItemType } from './enums';

export default class ProjectManager {

    public static GenerateProject(project: DUProject): boolean {
        let projectFiles = ProjectFileDescription.defineFromProject(project);
        if (/*projectFiles.isValid() &&*/ !this.Exists(projectFiles)) {
            projectFiles.generate(vscode.workspace.rootPath);
            return true;
        }
        return false;
    }

    public static GenerateJson(jsonObject: any, projectName: string, targetUri: vscode.Uri): boolean {
        let jsonString = JSON.stringify(jsonObject);

        const jsonFilename = projectName + '.du.json';

        let filePath = targetUri.fsPath + "\\" + jsonFilename;
        if (!fs.exists(filePath)) {
            let writeStream = fs.createWriteStream(filePath);
            writeStream.write(jsonString, () => {
                writeStream.end(() => {
                    writeStream.close();
                });
            });
            return true;
        }

        return false;
    }

    public static Exists(project: ProjectFileDescription) {
        if (project.itemType != ProjectItemType.Root) {
            // raise error
        }

        if (vscode.workspace.workspaceFolders === undefined) return false;

        vscode.workspace.workspaceFolders.forEach(workspaceFolder => {
            if (workspaceFolder.name == project.name) {
                return true;
            }
        });

        return false;
    }

    public static LoadProject(uri: vscode.Uri): Thenable<DUProject> {
        return ProjectFileDescription.loadProjectFromUri(uri).then(projectFiles => {
            return DUProject.LoadFromFiles(projectFiles);
        });
    }

    public static LoadJsonURI(uri: vscode.Uri): Thenable<DUProject> {
        let projectPromise = vscode.workspace.openTextDocument(uri).then<DUProject>((textDocument) => {
            return ProjectManager.LoadJsonTextDocument(textDocument);
        });
        return projectPromise;
    }

    public static LoadJsonTextDocument(textDocument: vscode.TextDocument): DUProject {
        if (textDocument == null || textDocument == undefined) {
            return null;
        }

        if (textDocument && textDocument.languageId === "duproject") {
            let documentContent = textDocument.getText();

            let documentpath = textDocument.uri.path.split("/");
            let projectJsonName = documentpath[documentpath.length - 1].replace(".du.json", "");

            let project = DUProject.LoadFromJson(projectJsonName, documentContent);

            return project;
        }
        // else raise error
    }
}