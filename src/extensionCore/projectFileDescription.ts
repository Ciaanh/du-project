'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";
import { FileType, ProjectItemType, GenerationStatus } from './enums'
import DUProject from './duproject';
import Slots from '../models/slotContainer';
import Handlers from '../models/handlerContainer';
import HandlerContainer from '../models/handlerContainer';
import Method from '../models/method';
import Event from '../models/event';
import Slot from '../models/slot';
import Handler from '../models/handler';
import Type from '../models/type';


export default class ProjectFileDescription {

    public fileType: FileType;
    public itemType: ProjectItemType;
    public name: string;

    // only if fileType == file
    public content: string;

    public subItems: ProjectFileDescription[];

    constructor() {
        this.itemType = ProjectItemType.Empty;
        this.fileType = FileType.Undefined;
        this.subItems = new Array<ProjectFileDescription>();
    }

    public generate(root: string): GenerationStatus | Thenable<GenerationStatus> {
        let projectRoot = root;
        switch (this.fileType) {
            case FileType.File:
                let filePath = projectRoot + "\\" + this.name + ".lua";
                if (!fs.exists(filePath)) {
                    let writeStream = fs.createWriteStream(filePath);
                    writeStream.write(this.content, () => {
                        writeStream.end(() => {
                            writeStream.close();
                        });
                    });
                    return GenerationStatus.Succeed
                }
                return GenerationStatus.ElementAlreadyExists;
            case FileType.Folder:
                if (this.itemType == ProjectItemType.Root) {
                    projectRoot += "\\du_" + this.name;
                }
                else {
                    projectRoot += "\\" + this.name;
                }

                if (!fs.exists(projectRoot)) {
                    let mkDir = new Promise((resolve, reject) => {
                        fs.mkdir(projectRoot, (err) => {
                            if (err) {
                                reject(GenerationStatus.UnknownError);
                            }
                            resolve(GenerationStatus.Succeed);
                        })
                    });

                    return mkDir.then(
                        () => { return this.generateSubItems(projectRoot); },
                        () => { return GenerationStatus.UnknownError })
                }
                else {
                    if (this.itemType == ProjectItemType.Root) {
                        return GenerationStatus.ProjectAlreadyExists;
                    }
                    return GenerationStatus.ElementAlreadyExists;
                }
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

    // public isValid(): boolean {
    //     return true; // && subItem isValid
    // }
















    public static defineFromProject(project: DUProject): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        projectItem.name = project.projectName;
        projectItem.itemType = ProjectItemType.Root;
        projectItem.fileType = FileType.Folder;
        projectItem.subItems = new Array<ProjectFileDescription>();
        projectItem.subItems.push(ProjectFileDescription.createSlots(project.slots, project.handlers));
        projectItem.subItems.push(ProjectFileDescription.createMethods(project.methods.getMethods()));
        projectItem.subItems.push(ProjectFileDescription.createEvents(project.events.getEvents()));

        return projectItem;
    }

    public static defineSlotFromObject(slot: Slot, handlers: HandlerContainer): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        // warning separator _ may be contained in the slot name, replace it
        projectItem.name = `slot_${slot.slotKey.toString()}_${slot.name}`;
        projectItem.itemType = ProjectItemType.Slot;
        projectItem.fileType = FileType.Folder;

        projectItem.subItems = ProjectFileDescription.createHandlers(handlers);

        let typeItem = ProjectFileDescription.createType(slot.type);
        projectItem.subItems.push(typeItem);

        return projectItem;
    }

    public static defineHandlerFromObject(handler: Handler): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        projectItem.name = `handler_${handler.key}_${handler.filter.signature}_${handler.filter.args.getArgs().join("-")}`;
        projectItem.itemType = ProjectItemType.Handler;
        projectItem.fileType = FileType.File;

        projectItem.content = handler.code;

        return projectItem;
    }

    private static createSlots(slots: Slots, handlers: Handlers): ProjectFileDescription {
        let slotContainer = new ProjectFileDescription();
        slotContainer.itemType = ProjectItemType.Slot;
        slotContainer.name = "Slots";
        slotContainer.fileType = FileType.Folder;

        let slotItems = new Array<ProjectFileDescription>();
        if (slots) {
            slots.getAllSlots().forEach(slot => {
                let slotHandlers = handlers.getHandlersBySlotKey(slot.slotKey);
                let item = ProjectFileDescription.defineSlotFromObject(slot, slotHandlers);
                slotItems.push(item);


            });
        }
        slotContainer.subItems = slotItems;
        return slotContainer;
    }

    private static createType(type: Type): ProjectFileDescription {
        let typeObject = new ProjectFileDescription();
        typeObject.itemType = ProjectItemType.Type;
        typeObject.name = "Type";
        typeObject.fileType = FileType.Folder;

        let subItems = new Array<ProjectFileDescription>();
        if (type) {
            subItems.push(ProjectFileDescription.createMethods(type.methods.getMethods()));
            subItems.push(ProjectFileDescription.createEvents(type.events.getEvents()));
        }
        typeObject.subItems = subItems;
        return typeObject;
    }

    private static createMethods(methods: Method[]): ProjectFileDescription {
        let methodContainer = new ProjectFileDescription();
        methodContainer.itemType = ProjectItemType.Method;
        methodContainer.name = "Methods";
        methodContainer.fileType = FileType.Folder;

        let methodItems = new Array<ProjectFileDescription>();
        if (methods) {
            methods.forEach(handler => {
                // do something
                throw new Error("Method not implemented.");
            });
        }
        methodContainer.subItems = methodItems;
        return methodContainer;
    }

    private static createEvents(events: Event[]): ProjectFileDescription {
        let eventContainer = new ProjectFileDescription();
        eventContainer.itemType = ProjectItemType.Event;
        eventContainer.name = "Events";
        eventContainer.fileType = FileType.Folder;

        let eventItems = new Array<ProjectFileDescription>();
        if (events) {
            events.forEach(handler => {
                // do something
                throw new Error("Method not implemented.");
            });
        }
        eventContainer.subItems = eventItems;
        return eventContainer;
    }

    private static createHandlers(handlers: HandlerContainer): ProjectFileDescription[] {
        let handlerItems = new Array<ProjectFileDescription>();
        if (handlers) {
            handlers.getHandlerList().forEach(handler => {
                let item = ProjectFileDescription.defineHandlerFromObject(handler);
                handlerItems.push(item);
            });
        }
        return handlerItems;
    }










    public static async loadProjectFromUri(uri: vscode.Uri): Promise<ProjectFileDescription> {
        let projectFromUri = await ProjectFileDescription.readFileStats(uri).then(
            async (itemStats) => {
                let project = new ProjectFileDescription();

                if (itemStats.isDirectory()) {
                    let documentpath = uri.path.split("/");
                    let projectName = documentpath[documentpath.length - 1].replace("du_", "");

                    project.name = projectName;
                    project.itemType = ProjectItemType.Root;
                    project.fileType = FileType.Folder;

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

    private static async loadFileFromDisk(uri: vscode.Uri): Promise<ProjectFileDescription> {
        let documentpath = uri.path.split("/");
        let documentName = documentpath[documentpath.length - 1];

        if (documentName.indexOf(".du.json", 0) > -1) {
            return null;
        }

        if (documentName.indexOf("handler_", 0) > -1) {
            let project = new ProjectFileDescription;

            project.itemType = ProjectItemType.Handler;
            project.name = documentName;
            project.fileType = FileType.File;

            let content = await ProjectFileDescription.readFile(uri.fsPath);

            console.log(content);

            project.content = content;

            return project;
        }

        return null;
    }

    private static async readFile(filename) {
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
        project.fileType = FileType.Folder;

        let subItems = await ProjectFileDescription.loadSubitemsFromDisk(uri);
        project.subItems.push(...subItems);

        return project;
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








    // private HOME_DIR = os.homedir();



    // private getRootPath(): string {
    //     return vscode.workspace.rootPath || "/";
    // }

    // private async listDir(dir: string): Promise<vscode.QuickPickItem[]> {
    //     const list = await this.readdir(dir);
    //     const ret: vscode.QuickPickItem[] = [
    //         {
    //             description: "/",
    //             label: "/",
    //         },
    //         {
    //             description: path.resolve(dir, ".."),
    //             label: "..",
    //         },
    //         {
    //             description: this.HOME_DIR,
    //             label: "~",
    //         },
    //     ];
    //     for (const item of list) {
    //         const f = path.resolve(dir, item);
    //         ret.push({
    //             description: f,
    //             label: item,
    //         });
    //     }
    //     return ret;
    // }

    // private fixFilePath(file: string): string {
    //     if (file.slice(0, 2) === "~/" || file === "~") {
    //         file = this.HOME_DIR + file.slice(1);
    //     }
    //     return file;
    // }




}