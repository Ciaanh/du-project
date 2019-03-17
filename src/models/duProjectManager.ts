'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";

import { duProject, methodFileError, slotFileError, handlerFileError } from './duProject';
import Files from '../utils/files';
import { IProject, ISlot, IMethod, IHandler } from './duModel';
import { MethodErrorReason, Slots, SlotErrorReason, HandlerErrorReason } from '../utils/enums';
import { isNullOrUndefined } from 'util';
import { array } from 'prop-types';

export default class duProjectManager {

    public static async LoadProject(uri: vscode.Uri): Promise<duProject> {
        return await Files.readFileStats(uri).then(
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

        let projectFile = await directoryContent
            .map(async fileSystemElement => {
                let itemUri = vscode.Uri.file(rootUri.fsPath + '\\' + fileSystemElement);
                let fileStats = await Files.readFileStats(itemUri);

                if (fileStats.isFile() && fileSystemElement === `${projectName}.json`) {
                    let content = await Files.readFile(rootUri);
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
        let methodsErrors: methodFileError[];
        let slotsErrors: slotFileError[];

        if (duProject.project) {
            if (duProject.project.methods && duProject.project.methods.length > 0) {
                // load methods directory
                let methodsDirUri = vscode.Uri.file(duProject.rootUri.fsPath + '\\Methods');
                methodsErrors = await duProjectManager.consolidateMethods(duProject.project.methods, methodsDirUri);
                console.log(methodsErrors);
            }

            if (duProject.project.slots) {
                slotsErrors = await duProjectManager.consolidateSlots(duProject.project.slots, duProject.rootUri, duProject.project.handlers);
                console.log(slotsErrors);
            }
        }

        let isValid = duProjectManager.AreValidMethods(methodsErrors)
            && duProjectManager.AreValidSlots(slotsErrors);

        return isValid;
    }

    private static AreValidMethods(errors: methodFileError[]): boolean {
        return !(errors && errors.length > 0);
    }

    private static AreValidHandlers(errors: handlerFileError[]): boolean {
        return !(errors && errors.length > 0);
    }

    private static AreValidSlots(errors: slotFileError[]): boolean {
        let isValid = true;

        errors.forEach(slotErrors => {
            if (!duProjectManager.IsValidSlot(slotErrors)) {
                isValid = false;
            }
        });

        return isValid;
    }

    private static IsValidSlot(slotErrors: slotFileError) {
        if (slotErrors && slotErrors.slotErrors.length > 0) {
            return false;
        }
        if (!duProjectManager.AreValidHandlers(slotErrors.handlerErrors)) {
            return false;
        }
        if (!duProjectManager.AreValidMethods(slotErrors.methodsErrors)) {
            return false;
        }
        return true;
    }



    private static async consolidateSlots(slots: ISlot[], rootUri: vscode.Uri, handlers: IHandler[]): Promise<slotFileError[]> {
        let slotErrors = await Slots.indexes.map(async (index) => {
            let slotDirName: string = `slot_${index}`;
            let slotDirUri = vscode.Uri.file(rootUri.fsPath + '\\' + slotDirName);

            let slot: ISlot = slots[index];
            let slotErrors = new slotFileError(index);

            // check if slot is defined and file is defined
            let existsSlotDirectory = await Files.exists(slotDirUri);
            if (!existsSlotDirectory) {
                slotErrors.slotErrors.push(SlotErrorReason.NotExistDirectory);
            }

            let existsSlotJson = !isNullOrUndefined(slot)
            if (!existsSlotJson) {
                slotErrors.slotErrors.push(SlotErrorReason.NotExistJson);
            }

            if (existsSlotJson && existsSlotDirectory) {
                if (slot.type && slot.type.methods) {
                    let methodsErrors = await duProjectManager.consolidateMethods(slot.type.methods, slotDirUri);
                    slotErrors.methodsErrors = methodsErrors;
                }

                let slotHandlers = duProjectManager.getHandlersBySlot(index, handlers);
                if (slotHandlers && slotHandlers.length > 0) {
                    let handlersErrors = await duProjectManager.consolidateHandlers(slotHandlers, slotDirUri, index);
                    slotErrors.handlerErrors = handlersErrors;
                }
            }
            return slotErrors;
        });

        return await Promise.all(slotErrors.filter((value) => { return value != null; }));
    }

    private static getHandlersBySlot(slotIndex: number, handlers: IHandler[]): IHandler[] {
        return handlers.filter(handler => {
            return handler.filter.slotKey == slotIndex;
        });
    }

    private static async consolidateHandlers(handlers: IHandler[], handlersDirUri: vscode.Uri, slotKey: number): Promise<handlerFileError[]> {
        let handlersErrors: handlerFileError[] = [];

        let handlersDirStats = await Files.readFileStats(handlersDirUri);
        if (handlersDirStats.isDirectory()) {
            // check folder methods, check each method by index, filename : handler_<handlerKey>.lua

            // check that methods from Json exist as a file
            await handlers.forEach(async (handler) => {
                if (!handler.key) {
                    handlersErrors.push(new handlerFileError(null, null, handler.filter.slotKey, null, handler, HandlerErrorReason.KeyNotDefined));
                    return;
                }

                if (!handler.filter || !handler.filter.slotKey) {
                    handlersErrors.push(new handlerFileError(null, handler.key, slotKey, null, handler, HandlerErrorReason.SlotNotDefined));
                    return;
                }

                let handlerFilename: string = `handler_${handler.key}.lua`;
                let handlerUri = vscode.Uri.file(handlersDirUri.fsPath + '\\' + handlerFilename);

                if (!Files.exists(handlerUri)) {
                    handlersErrors.push(new handlerFileError(handlerUri, handler.key, handler.filter.slotKey, null, handler, HandlerErrorReason.NotExistFile));
                }
                else {
                    let handlerDirStats = await Files.readFileStats(handlerUri);
                    if (handlerDirStats.isFile()) {
                        let fileContent = await Files.readFile(handlerUri);
                        let handlerFileContent = duProjectManager.GetContent(fileContent);

                        if (handlerFileContent.hasOwnProperty('code')) {
                            if (handler.code !== handlerFileContent.code) {
                                // error, reference json and file content is different
                                console.log(`Different code between json and file for ${handlerUri}`);
                                handlersErrors.push(new handlerFileError(handlerUri, handler.key, handler.filter.slotKey, handlerFileContent, handler, HandlerErrorReason.Code))
                            }
                        }

                        if (handlerFileContent.hasOwnProperty('key')) {
                            if (handler.key !== handlerFileContent.key) {
                                // error, reference json and file content is different
                                console.log(`Different key between json and file for ${handlerUri}`)
                                handlersErrors.push(new handlerFileError(handlerUri, handler.key, handler.filter.slotKey, handlerFileContent, handler, HandlerErrorReason.Key))
                            }
                        }

                        // need to check filter and filter signature + args 
                        // if (handlerFileContent.hasOwnProperty('signature')) {
                        //     if (handler.signature !== handlerFileContent.signature) {
                        //         // error, reference json and file content is different
                        //         console.log(`Different signature between json and file for ${handlerUri}`)
                        //         handlersErrors.push(new methodFileError(handlerUri, index, handlerFileContent, handler, MethodErrorReason.Signature))
                        //     }
                        // }
                    }
                }
            });

            let handlersDir = await Files.readDirectory(handlersDirUri);
            // check that handlers from files exist in Json
            await handlersDir.forEach(async (handlerFile) => {
                // handler_<key>.lua
                let handlerUri = vscode.Uri.file(handlersDirUri.fsPath + '\\' + handlerFile);
                let handlerDirStats = await Files.readFileStats(handlerUri);
                // ensure that file is handler 
                if (handlerDirStats.isFile() && handlerFile.indexOf('handler_') > -1) {
                    let key: string = handlerFile.replace("handler_", "").replace(".lua", "");
                    let handlerFromJson = handlers.filter(handler => { return handler.key === key });

                    if (!handlerFromJson || handlerFromJson.length > 0) {
                        let fileContent = await Files.readFile(handlerUri);
                        let handlerFileContent = duProjectManager.GetContent(fileContent);

                        handlersErrors.push(new handlerFileError(handlerUri, key, slotKey, handlerFileContent, null, HandlerErrorReason.NotExistJson));
                    }
                }
            });
        }

        return handlersErrors;
    }

    private static async consolidateMethods(methods: IMethod[], methodsDirUri: vscode.Uri): Promise<methodFileError[]> {
        let methodsErrors: methodFileError[] = [];

        let methodsDirStats = await Files.readFileStats(methodsDirUri);
        if (methodsDirStats.isDirectory()) {
            // check folder methods, check each method by index, filename : method_<methodIndex>.lua

            // check that methods from Json exist as a file
            await methods.forEach(async (method, index) => {
                let methodFileName: string = `method_${index}.lua`;
                let methodUri = vscode.Uri.file(methodsDirUri.fsPath + '\\' + methodFileName);

                if (!Files.exists(methodUri)) {
                    methodsErrors.push(new methodFileError(methodUri, index, null, method, MethodErrorReason.NotExistFile));
                }
                else {
                    let methodDirStats = await Files.readFileStats(methodUri);
                    if (methodDirStats.isFile()) {
                        let fileContent = await Files.readFile(methodUri);
                        let methodFileContent = duProjectManager.GetContent(fileContent);

                        if (methodFileContent.hasOwnProperty('code')) {
                            if (method.code !== methodFileContent.code) {
                                // error, reference json and file content is different
                                console.log(`Different code between json and file for ${methodUri}`);
                                methodsErrors.push(new methodFileError(methodUri, index, methodFileContent, method, MethodErrorReason.Code))
                            }
                        }

                        if (methodFileContent.hasOwnProperty('signature')) {
                            if (method.signature !== methodFileContent.signature) {
                                // error, reference json and file content is different
                                console.log(`Different signature between json and file for ${methodUri}`)
                                methodsErrors.push(new methodFileError(methodUri, index, methodFileContent, method, MethodErrorReason.Signature))
                            }
                        }
                    }
                }
            });

            let methodsDir = await Files.readDirectory(methodsDirUri);
            // check that methods from files exist in Json
            await methodsDir.forEach(async (methodFile) => {
                // method_<methodIndex>.lua
                let methodUri = vscode.Uri.file(methodsDirUri.fsPath + '\\' + methodFile);
                let methodDirStats = await Files.readFileStats(methodUri);
                if (methodDirStats.isFile() && methodFile.indexOf('method_') > -1) {
                    let index: number = Number.parseInt(methodFile.replace("method_", "").replace(".lua", ""));
                    let methodFromJson = methods[index];

                    if (isNullOrUndefined(methodFromJson)) {
                        let fileContent = await Files.readFile(methodUri);
                        let methodFileContent = duProjectManager.GetContent(fileContent);

                        methodsErrors.push(new methodFileError(methodUri, index, methodFileContent, null, MethodErrorReason.NotExistJson));
                    }
                }
            });
        }

        return methodsErrors;
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

    public static getHandlerUri(handlerKey: string, slotKey: number, rootUri: vscode.Uri): vscode.Uri {
        let slotDirName: string = `slot_${slotKey}`;
        let slotDirUri = vscode.Uri.file(rootUri.fsPath + '\\' + slotDirName);

        let handlerFileName: string = `handler_${handlerKey}.lua`;
        let handlerUri = vscode.Uri.file(slotDirUri.fsPath + '\\' + handlerFileName);

        return handlerUri;
    }






    public static validateJson(value: string): string | undefined {
        return undefined;
    }

    public static GenerateProjectFromJson(jsonProject: string) {

    }

}