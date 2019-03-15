'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";

import { duProject, methodFileError } from './duProject';
import Files from './utils/files';
import { IProject } from './duModel';
import { MethodErrorReason } from './utils/enums';

export default class duProjectManager {

    public static isValidProject(uri: vscode.Uri): boolean {
        let projectName: string;
        let projectUri: vscode.Uri = uri;

        return true;
    }

    public static LoadProject(uri: vscode.Uri): Thenable<duProject> {
        return Files.readFileStats(uri).then(
            async (root) => {
                let project = new duProject();
                if (root.isDirectory()) {
                    let documentpath = uri.path.split("/");
                    let projectName = documentpath[documentpath.length - 1].replace("du_", "");

                    project.name = projectName;
                    project.rootUri = uri;

                    let projectFromJson = await duProjectManager.loadProjectJson(projectName, uri);
                    if (projectFromJson) {
                        project.project = projectFromJson;
                    }
                    return project;
                }
                return null;
            }).then((project) => {
                if (duProjectManager.Consolidate(project)) {
                    return project;
                }
                return null;
            });
    }

    private static async loadProjectJson(projectName: string, rootUri: vscode.Uri): Promise<IProject> {
        let directoryContent = await Files.readDirectory(rootUri);

        let projectFile = directoryContent
            .map(async fileSystemElement => {
                let itemUri = vscode.Uri.file(rootUri.fsPath + '\\' + fileSystemElement);
                let fileStats = await Files.readFileStats(itemUri);

                if (fileStats.isFile() && fileSystemElement === `${projectName}.json`) {
                    let content = await Files.readFile(rootUri.fsPath);
                    let projectAsJson: IProject = JSON.parse(content);

                    return projectAsJson;
                }
                return null;
            })
            .filter((value) => { return value != null; });

        let loadedJsons = await Promise.all(projectFile);
        if (loadedJsons.length == 1) {
            return loadedJsons[0];
        }
        return null;
    }

    private static async Consolidate(duProject: duProject): Promise<boolean> {
        // compare json to files on disk to create missing files and update content
        // must be careful with priority json or lua files



        if (duProject.project) {
            if (duProject.project.methods && duProject.project.methods.length > 0) {
                // load methods directory
                let methodsDirUri = vscode.Uri.file(duProject.rootUri.fsPath + '\\Methods');

                let methodsDirStats = await Files.readFileStats(methodsDirUri);
                if (methodsDirStats.isDirectory()) {
                    let methodsDir = await Files.readDirectory(methodsDirUri);

                    let methodsErrors: methodFileError[] = [];

                    await duProject.project.methods.forEach(async (method, index) => {
                        // check folder methods, check each method by index, filename : method_<methodIndex>.lua
                        // signature as header --@signature
                        let methodFileName: string = `method_${index}.lua`;
                        let methodUri = vscode.Uri.file(methodsDirUri.fsPath + '\\' + methodFileName);
                        let methodDirStats = await Files.readFileStats(methodUri);

                        if (methodDirStats.isFile()) {
                            let fileContent = await Files.readFile(methodUri);

                            let methodFileContent = duProjectManager.GetContent(fileContent);


                            if (methodFileContent.hasOwnProperty('code')) {
                                if (method.code !== methodFileContent.code) {
                                    // error, reference json and file content is different
                                    console.log(`Different code between json and file for ${methodUri}`);
                                    methodsErrors.push(new methodFileError(methodUri,index,methodFileContent,method,MethodErrorReason.))
                                }
                            }

                            if (methodFileContent.hasOwnProperty('signature')) {
                                if (method.signature !== methodFileContent.signature) {
                                    // error, reference json and file content is different
                                    console.log(`Different signature between json and file for ${methodUri}`)

                                }
                            }

                            
                        }


                        
                    });
                }
            }
        }

        return false;
    }


    // public static toFileContent(filter: Filter): string {
    //     return `` +
    //         `--@slotKey:${filter.slotKey}\n` +
    //         `--@signature:${filter.signature}\n` +
    //         ArgContainerManager.toFileContent(filter.args);
    // }

    private static GetContent(fileContent: string): any {
        let code = fileContent.replace(/\r/g, '\n');
        let content = {};

        let contentLines = code.split('\n');

        contentLines.forEach(line => {
            if (line.startsWith("--@")) {
                code = code.replace(line + "\n", "");

                let lineParam = line.substring(3, line.indexOf(":"));
                let lineContent = line.substring(line.indexOf(":") + 1);

                content[lineParam] = lineContent;
            }
        });

        content["code"] = code;
        return content;
    }

    
    private static CreateFile(uri: vscode.Uri, content: string) {

    }

    private static CreateDirectory(uri: vscode.Uri) {

    }



    // private static async loadProjectFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription> {
    //     let projectFromUri = await duProjectManager.readFileStats(uri).then(
    //         async (itemStats) => {
    //             let project = new duProject();

    //             if (itemStats.isDirectory()) {
    //                 let documentpath = uri.path.split("/");
    //                 let projectName = documentpath[documentpath.length - 1].replace("du_", "");

    //                 project.name = projectName;
    //                 project.itemType = ProjectItemType.Root;
    //                 project.diskItemType = DiskItemType.Folder;

    //                 let subItems = await ProjectFileDescription.loadSubitemsFromDisk(uri);
    //                 project.subItems.push(...subItems);

    //                 return project;
    //             }
    //             return null;
    //         });

    //     return projectFromUri;
    // }








    // private static async loadSubitemsFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription[]> {
    //     let directoryContent = await ProjectFileDescription.readDirectory(uri);
    //     let projectFile = directoryContent.map(async diskItem => {
    //         let projectItem: ProjectFileDescription;
    //         let itemUri = vscode.Uri.file(uri.fsPath + '\\' + diskItem);

    //         let fileStats = await ProjectFileDescription.readFileStats(itemUri);
    //         if (fileStats.isDirectory()) {
    //             projectItem = await ProjectFileDescription.loadDirectoryFromDisk(itemUri, fileStats);
    //         }
    //         else if (fileStats.isFile()) {
    //             projectItem = await ProjectFileDescription.loadFileFromDisk(itemUri);
    //         }

    //         return projectItem;
    //     }).filter((value) => { return value != null; });
    //     return Promise.all(projectFile);
    // }

    // private static async loadDirectoryFromDisk(uri: vscode.Uri, stats: fs.Stats): Promise<ProjectFileDescription> {
    //     let project = new ProjectFileDescription;

    //     let documentpath = uri.path.split("/");
    //     let directoryName = documentpath[documentpath.length - 1];

    //     switch (directoryName) {
    //         case "Slots":
    //             project.itemType = ProjectItemType.SlotContainer;
    //             break;
    //         case "Methods":
    //             project.itemType = ProjectItemType.MethodContainer;
    //             break;
    //         case "Events":
    //             project.itemType = ProjectItemType.EventContainer;
    //             break;
    //         case "Type":
    //             project.itemType = ProjectItemType.Type;
    //             break;
    //         default:
    //             if (directoryName.indexOf("slot_", 0) > -1) {
    //                 project.itemType = ProjectItemType.Slot;
    //             }
    //             // error
    //             break;
    //     }

    //     project.name = directoryName;
    //     project.diskItemType = DiskItemType.Folder;

    //     let subItems = await ProjectFileDescription.loadSubitemsFromDisk(uri);
    //     project.subItems.push(...subItems);

    //     return project;
    // }

    // private static async loadFileFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription> {
    //     let documentpath = uri.path.split("/");
    //     let documentName = documentpath[documentpath.length - 1];

    //     if (documentName.indexOf(".json", 0) > -1) {
    //         return null;
    //     }

    //     if (documentName.indexOf("handler_", 0) > -1) {
    //         let project = new ProjectFileDescription;

    //         project.fileType = FileType.Lua;
    //         project.itemType = ProjectItemType.Handler;
    //         project.name = documentName;
    //         project.diskItemType = DiskItemType.Json;

    //         let content = await ProjectFileDescription.readFile(uri.fsPath);
    //         project.content = content;

    //         return project;
    //     }

    //     if (documentName.indexOf("method_", 0) > -1) {
    //         let project = new ProjectFileDescription;

    //         project.fileType = FileType.Lua;
    //         project.itemType = ProjectItemType.Method;
    //         project.name = documentName;
    //         project.diskItemType = DiskItemType.Json;

    //         let content = await ProjectFileDescription.readFile(uri.fsPath);
    //         project.content = content;

    //         return project;
    //     }

    //     if (documentName.indexOf("eventList", 0) > -1) {
    //         let project = new ProjectFileDescription;

    //         project.fileType = FileType.List;
    //         project.itemType = ProjectItemType.Event;
    //         project.name = documentName;
    //         project.diskItemType = DiskItemType.Json;

    //         let content = await ProjectFileDescription.readFile(uri.fsPath);
    //         project.content = content;

    //         return project;
    //     }

    //     return null;
    // }





















































    // public static LoadJsonURI(uri: vscode.Uri): Thenable<duProject> {
    //     let projectPromise = vscode.workspace.openTextDocument(uri).then<Project>((textDocument) => {
    //         return ProjectManager.LoadJsonTextDocument(textDocument);
    //     });
    //     return projectPromise;
    // }

    // public static LoadJsonTextDocument(textDocument: vscode.TextDocument): Project {
    //     if (textDocument == null || textDocument == undefined) {
    //         return null;
    //     }

    //     if (textDocument && textDocument.languageId === "duproject") {
    //         let documentContent = textDocument.getText();

    //         let documentpath = textDocument.uri.path.split("/");
    //         let projectJsonName = documentpath[documentpath.length - 1].replace(".json", "");

    //         let project = ProjectManager.LoadFromJson(projectJsonName, documentContent, textDocument.uri);

    //         return project;
    //     }
    //     // else raise error
    // }

    // public static LoadFromFiles(files: ProjectFileDescription, uri: vscode.Uri): Project {
    //     let project = new Project(files.name, DiskItemType.Folder, uri);

    //     if (files.itemType == ProjectItemType.Root) {
    //         files.subItems.forEach(item => {
    //             switch (item.itemType) {
    //                 case ProjectItemType.SlotContainer:
    //                     project.slots = SlotContainerManager.LoadFromFiles(item);
    //                     project.handlers = HandlerContainerManager.LoadFromFiles(item);
    //                     break;
    //                 case ProjectItemType.EventContainer:
    //                     project.events = EventContainerManager.LoadFromFiles(item);
    //                     break;
    //                 case ProjectItemType.MethodContainer:
    //                     project.methods = MethodContainerManager.LoadFromFiles(item);
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         });
    //         return project;
    //     }
    //     return null;
    // }

    // public static LoadFromJson(projectName: string, projectAsString: string, uri: vscode.Uri): Project {
    //     let project = new Project(projectName, DiskItemType.Json, uri);

    //     let projectAsJson = JSON.parse(projectAsString);

    //     if (projectAsJson.hasOwnProperty('slots')) {
    //         project.slots = SlotContainerManager.LoadFromJson(projectAsJson['slots']);
    //     }

    //     if (projectAsJson.hasOwnProperty('handlers')) {
    //         project.handlers = HandlerContainerManager.LoadFromJson(projectAsJson['handlers']);
    //     }

    //     if (projectAsJson.hasOwnProperty('methods')) {
    //         project.methods = MethodContainerManager.LoadFromJson(projectAsJson['methods']);
    //     }

    //     if (projectAsJson.hasOwnProperty('events')) {
    //         project.events = EventContainerManager.LoadFromJson(projectAsJson['events']);
    //     }

    //     return project;
    // }














}