'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";
import Project from '../models/project';
import { ProjectItemType } from '../extensionCore/enums';
import SlotContainerManager from '../managers/slotContainerManager';
import MethodContainerManager from '../managers/methodContainerManager';
import EventContainerManager from '../managers/eventContainerManager';
import HandlerContainerManager from '../managers/handlerContainerManager';
import ProjectFileDescription from '../extensionCore/projectFileDescription';

export default class ProjectManager {

    public static GenerateProject(project: Project): boolean {
        let projectFiles = ProjectFileDescription.defineFromProject(project);
        if (!this.Exists(projectFiles)) {
            projectFiles.generate(vscode.workspace.workspaceFolders[0].uri.fsPath);
            return true;
        }
        return false;
    }

    public static GenerateJson(jsonObject: any, projectName: string, targetUri: vscode.Uri): boolean {
        let jsonString = JSON.stringify(jsonObject);

        const jsonFilename = projectName + '.json';

        let filePath = targetUri.fsPath + "\\" + jsonFilename;
        fs.exists(filePath, (exists) => {
            if (!exists) {
                let writeStream = fs.createWriteStream(filePath);
                writeStream.write(jsonString, () => {
                    writeStream.end(() => {
                        writeStream.close();
                    });
                });
                return true;
            }
        });

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

    public static LoadProject(uri: vscode.Uri): Thenable<Project> {
        return ProjectFileDescription.loadProjectFromDisk(uri).then(projectFiles => {
            return ProjectManager.LoadFromFiles(projectFiles);
        });
    }

    public static LoadJsonURI(uri: vscode.Uri): Thenable<Project> {
        let projectPromise = vscode.workspace.openTextDocument(uri).then<Project>((textDocument) => {
            return ProjectManager.LoadJsonTextDocument(textDocument);
        });
        return projectPromise;
    }

    public static LoadJsonTextDocument(textDocument: vscode.TextDocument): Project {
        if (textDocument == null || textDocument == undefined) {
            return null;
        }

        if (textDocument && textDocument.languageId === "duproject") {
            let documentContent = textDocument.getText();

            let documentpath = textDocument.uri.path.split("/");
            let projectJsonName = documentpath[documentpath.length - 1].replace(".json", "");

            let project = ProjectManager.LoadFromJson(projectJsonName, documentContent);

            return project;
        }
        // else raise error
    }

    public static LoadFromFiles(files: ProjectFileDescription): Project {
        let project = new Project();
        if (files.itemType == ProjectItemType.Root) {
            project.projectName = files.name;

            files.subItems.forEach(item => {
                switch (item.itemType) {
                    case ProjectItemType.SlotContainer:
                        project.slots = SlotContainerManager.LoadFromFiles(item);
                        project.handlers = HandlerContainerManager.LoadFromFiles(item);
                        break;
                    case ProjectItemType.EventContainer:
                        project.events = EventContainerManager.LoadFromFiles(item);
                        break;
                    case ProjectItemType.MethodContainer:
                        project.methods = MethodContainerManager.LoadFromFiles(item);
                        break;
                    default:
                        break;
                }
            });
            return project;
        }
        return null;
    }

    public static LoadFromJson(projectName: string, projectAsString: string): Project {
        let project = new Project();

        project.projectName = projectName;
        let projectAsJson = JSON.parse(projectAsString);

        if (projectAsJson.hasOwnProperty('slots')) {
            project.slots = SlotContainerManager.LoadFromJson(projectAsJson['slots']);
        }

        if (projectAsJson.hasOwnProperty('handlers')) {
            project.handlers = HandlerContainerManager.LoadFromJson(projectAsJson['handlers']);
        }

        if (projectAsJson.hasOwnProperty('methods')) {
            project.methods = MethodContainerManager.LoadFromJson(projectAsJson['methods']);
        }

        if (projectAsJson.hasOwnProperty('events')) {
            project.events = EventContainerManager.LoadFromJson(projectAsJson['events']);
        }

        return project;
    }

    public static toJsonObject(project: Project): any {
        let slotsJson = SlotContainerManager.toJsonObject(project.slots);
        let handlersJson = HandlerContainerManager.toJsonObject(project.handlers);
        let methodsJson = MethodContainerManager.toJsonObject(project.methods);
        let eventsJson = EventContainerManager.toJsonObject(project.events);

        let jsonObject = {
            "slots": slotsJson,
            "handlers": handlersJson,
            "methods": methodsJson,
            "events": eventsJson
        };
        return jsonObject;
    }

    public static toHtml(project: Project): string {
        let slotsString = `${SlotContainerManager.toHtml(project.slots, project.handlers)}`;
        let methodsString = `${MethodContainerManager.toHtml(project.methods)}`;
        let eventsString = `${EventContainerManager.toHtml(project.events)}`;

        return `${slotsString} ${methodsString} ${eventsString}`;
    }
}