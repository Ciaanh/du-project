'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";
import { DiskItemType, ProjectItemType, GenerationStatus, FileType } from './enums'
import DUProject from './duproject';
import SlotContainerManager from '../managers/slotContainerManager';
import MethodContainerManager from '../managers/methodContainerManager';
import EventContainerManager from '../managers/eventContainerManager';

export default class ProjectFileDescription {
    public diskItemType: DiskItemType;
    public itemType: ProjectItemType;
    public name: string;

    // only if fileType == file
    public content: string;
    public fileType: FileType;


    public subItems: ProjectFileDescription[];

    constructor() {
        this.itemType = ProjectItemType.Empty;
        this.diskItemType = DiskItemType.Undefined;
        this.subItems = new Array<ProjectFileDescription>();
    }

    public generate(root: string): GenerationStatus | Thenable<GenerationStatus> {
        let projectRoot = root;
        switch (this.diskItemType) {
            case DiskItemType.File:

                let filePath = projectRoot + "\\" + this.name

                if (this.fileType == FileType.List) { filePath += ".list"; }
                else if (this.fileType == FileType.Lua) { filePath += ".lua"; }

                //console.log('-- generating file: ' + filePath);

                fs.exists(filePath, (exists) => {
                    if (!exists) {
                        let writeStream = fs.createWriteStream(filePath);
                        writeStream.write(this.content, () => {
                            writeStream.end(() => {
                                writeStream.close();
                            });
                        });
                        return GenerationStatus.Succeed
                    }
                })
                return GenerationStatus.ElementAlreadyExists;
            case DiskItemType.Folder:
                let folderPath = projectRoot;
                if (this.itemType == ProjectItemType.Root) {
                    folderPath += "\\du_" + this.name;
                }
                else {
                    folderPath += "\\" + this.name;
                }

                //console.log(' generating folder: ' + folderPath);

                fs.exists(folderPath, (exists) => {
                    if (!exists) {
                        let mkDir = new Promise((resolve, reject) => {
                            fs.mkdir(folderPath, (err) => {
                                if (err) {
                                    reject(GenerationStatus.UnknownError);
                                }
                                resolve(GenerationStatus.Succeed);
                            })
                        });

                        return mkDir.then(
                            () => { return this.generateSubItems(folderPath); },
                            () => { return GenerationStatus.UnknownError })
                    }
                    else {
                        if (this.itemType == ProjectItemType.Root) {
                            return GenerationStatus.ProjectAlreadyExists;
                        }
                        return GenerationStatus.ElementAlreadyExists;
                    }
                })

            default:
                return GenerationStatus.UnknownError;
        }
    }

    private generateSubItems(root: string): GenerationStatus {
        this.subItems.forEach(subItem => {
            let result = subItem.generate(root);
            if (result != GenerationStatus.Succeed) {
                return result;
            }
        });
        return GenerationStatus.Succeed;
    }


    public static defineFromProject(project: DUProject): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        projectItem.name = project.projectName;
        projectItem.itemType = ProjectItemType.Root;
        projectItem.diskItemType = DiskItemType.Folder;
        projectItem.subItems = new Array<ProjectFileDescription>();
        projectItem.subItems.push(SlotContainerManager.createSlots(project.slots, project.handlers));
        projectItem.subItems.push(MethodContainerManager.createMethods(project.methods.get()));
        projectItem.subItems.push(EventContainerManager.createEvents(project.events));

        return projectItem;
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
            project.diskItemType = DiskItemType.File;

            let content = await ProjectFileDescription.readFile(uri.fsPath);

            console.log(content);

            project.content = content;

            return project;
        }

        if (documentName.indexOf("method_", 0) > -1) {
            let project = new ProjectFileDescription;

            project.fileType = FileType.Lua;
            project.itemType = ProjectItemType.Method;
            project.name = documentName;
            project.diskItemType = DiskItemType.File;

            let content = await ProjectFileDescription.readFile(uri.fsPath);
            console.log(content);
            project.content = content;

            return project;
        }

        if (documentName.indexOf("eventList", 0) > -1) {
            let project = new ProjectFileDescription;

            project.fileType = FileType.List;
            project.itemType = ProjectItemType.Event;
            project.name = documentName;
            project.diskItemType = DiskItemType.File;

            let content = await ProjectFileDescription.readFile(uri.fsPath);
            console.log(content);
            project.content = content;

            return project;
        }

        return null;
    }













    public static readFileStats(file: vscode.Uri): Promise<fs.Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(file.fsPath, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(stats);
            });
        });
    }

    public static readDirectory(directory: vscode.Uri): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(directory.fsPath, (err, list) => {
                if (err) {
                    return reject(err);
                }
                resolve(list);
            });
        });
    }

    private static async readFile(filename: string) {
        return new Promise<string>((resolve, reject) => {
            let readStream = fs.createReadStream(filename);
            let chunks = [];

            readStream.on('error', err => {
                return reject(err);
            });

            readStream.on('data', chunk => {
                chunks.push(chunk);
            });

            readStream.on('close', () => {
                return resolve(Buffer.concat(chunks).toString());
            });
        });
    }

}