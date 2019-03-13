'use strict';

import * as vscode from 'vscode';
import duProject from './duProject';

export default class duProjectManager {

    public static LoadProject(uri: vscode.Uri): Thenable<duProject> {
        return ProjectFileDescription.loadProjectFromDisk(uri).then(projectFiles => {
            return ProjectManager.LoadFromFiles(projectFiles, uri);
        });
    }

    public static LoadJsonURI(uri: vscode.Uri): Thenable<duProject> {
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

            let project = ProjectManager.LoadFromJson(projectJsonName, documentContent, textDocument.uri);

            return project;
        }
        // else raise error
    }

    public static LoadFromFiles(files: ProjectFileDescription, uri: vscode.Uri): Project {
        let project = new Project(files.name, DiskItemType.Folder, uri);

        if (files.itemType == ProjectItemType.Root) {
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

    public static LoadFromJson(projectName: string, projectAsString: string, uri: vscode.Uri): Project {
        let project = new Project(projectName, DiskItemType.Json, uri);

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




    public static async loadProjectFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription> {
        let projectFromUri = await ProjectFileDescription.readFileStats(uri).then(
            async (itemStats) => {
                let project = new ProjectFileDescription();

                if (itemStats.isDirectory()) {
                    let documentpath = uri.path.split("/");
                    let projectName = documentpath[documentpath.length - 1].replace("du_", "");

                    project.name = projectName;
                    project.itemType = ProjectItemType.Root;
                    project.diskItemType = DiskItemType.Folder;

                    let subItems = await ProjectFileDescription.loadSubitemsFromDisk(uri);
                    project.subItems.push(...subItems);

                    return project;
                }
                return null;
            });

        return projectFromUri;
    }

    private static async loadSubitemsFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription[]> {
        let directoryContent = await ProjectFileDescription.readDirectory(uri);
        let projectFile = directoryContent.map(async diskItem => {
            let projectItem: ProjectFileDescription;
            let itemUri = vscode.Uri.file(uri.fsPath + '\\' + diskItem);

            let fileStats = await ProjectFileDescription.readFileStats(itemUri);
            if (fileStats.isDirectory()) {
                projectItem = await ProjectFileDescription.loadDirectoryFromDisk(itemUri, fileStats);
            }
            else if (fileStats.isFile()) {
                projectItem = await ProjectFileDescription.loadFileFromDisk(itemUri);
            }

            return projectItem;
        }).filter((value) => { return value != null; });
        return Promise.all(projectFile);
    }

    private static async loadDirectoryFromDisk(uri: vscode.Uri, stats: fs.Stats): Promise<ProjectFileDescription> {
        let project = new ProjectFileDescription;

        let documentpath = uri.path.split("/");
        let directoryName = documentpath[documentpath.length - 1];

        switch (directoryName) {
            case "Slots":
                project.itemType = ProjectItemType.SlotContainer;
                break;
            case "Methods":
                project.itemType = ProjectItemType.MethodContainer;
                break;
            case "Events":
                project.itemType = ProjectItemType.EventContainer;
                break;
            case "Type":
                project.itemType = ProjectItemType.Type;
                break;
            default:
                if (directoryName.indexOf("slot_", 0) > -1) {
                    project.itemType = ProjectItemType.Slot;
                }
                // error
                break;
        }

        project.name = directoryName;
        project.diskItemType = DiskItemType.Folder;

        let subItems = await ProjectFileDescription.loadSubitemsFromDisk(uri);
        project.subItems.push(...subItems);

        return project;
    }

    private static async loadFileFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription> {
        let documentpath = uri.path.split("/");
        let documentName = documentpath[documentpath.length - 1];

        if (documentName.indexOf(".json", 0) > -1) {
            return null;
        }

        if (documentName.indexOf("handler_", 0) > -1) {
            let project = new ProjectFileDescription;

            project.fileType = FileType.Lua;
            project.itemType = ProjectItemType.Handler;
            project.name = documentName;
            project.diskItemType = DiskItemType.Json;

            let content = await ProjectFileDescription.readFile(uri.fsPath);
            project.content = content;

            return project;
        }

        if (documentName.indexOf("method_", 0) > -1) {
            let project = new ProjectFileDescription;

            project.fileType = FileType.Lua;
            project.itemType = ProjectItemType.Method;
            project.name = documentName;
            project.diskItemType = DiskItemType.Json;

            let content = await ProjectFileDescription.readFile(uri.fsPath);
            project.content = content;

            return project;
        }

        if (documentName.indexOf("eventList", 0) > -1) {
            let project = new ProjectFileDescription;

            project.fileType = FileType.List;
            project.itemType = ProjectItemType.Event;
            project.name = documentName;
            project.diskItemType = DiskItemType.Json;

            let content = await ProjectFileDescription.readFile(uri.fsPath);
            project.content = content;

            return project;
        }

        return null;
    }







}