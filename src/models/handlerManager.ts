'use strict';

import * as vscode from 'vscode';
import { IHandler } from './duModel';
import { handlerFileError } from './duProject';
import Files from '../utils/files';
import duProjectManager from './duProjectManager';
import slotManager from './slotManager';

export default class handlerManager {

    public static AreValidHandlers(errors: handlerFileError[]): boolean {
        return !(errors && errors.length > 0);
    }

    public static getHandlersBySlot(slotIndex: number, handlers: IHandler[]): IHandler[] {
        return handlers.filter(handler => {
            return handler.filter.slotKey == slotIndex;
        });
    }

    public static consolidateHandlers(handlers: IHandler[], handlersDirUri: vscode.Uri, slotKey: number): handlerFileError[] {
        let handlersErrors: handlerFileError[] = [];

        let handlersDirStats = Files.readFileStats(handlersDirUri);
        if (handlersDirStats.isDirectory()) {
            // check folder methods, check each method by index, filename : handler_<handlerKey>.lua

            // check that methods from Json exist as a file
            handlers.forEach((handler) => {
                if (!handler.key) {
                    handlersErrors.push(new handlerFileError(null, null, handler.filter.slotKey, null, handler, HandlerErrorReason.KeyNotDefined));
                    return;
                }

                if (!handler.filter || !handler.filter.slotKey) {
                    handlersErrors.push(new handlerFileError(null, handler.key, slotKey, null, handler, HandlerErrorReason.SlotNotDefined));
                    return;
                }

                let handlerUri = handlerManager.GetHandlerFileUri(handlersDirUri, handler.key)

                if (!Files.exists(handlerUri)) {
                    handlersErrors.push(new handlerFileError(handlerUri, handler.key, handler.filter.slotKey, null, handler, HandlerErrorReason.NotExistFile));
                }
                else {
                    let handlerDirStats = Files.readFileStats(handlerUri);
                    if (handlerDirStats.isFile()) {
                        let fileContent = Files.readFile(handlerUri);
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

                        tmp
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

            let handlersDir = Files.readDirectory(handlersDirUri);
            // check that handlers from files exist in Json
            handlersDir.forEach(async (handlerFile) => {
                // handler_<key>.lua
                let handlerUri = vscode.Uri.file(handlersDirUri.fsPath + '\\' + handlerFile);
                let handlerDirStats = Files.readFileStats(handlerUri);
                // ensure that file is handler 
                if (handlerDirStats.isFile() && handlerFile.indexOf('handler_') > -1) {
                    let key: string = handlerFile.replace("handler_", "").replace(".lua", "");
                    let handlerFromJson = handlers.filter(handler => { return handler.key === key });

                    if (!handlerFromJson || handlerFromJson.length > 0) {
                        let fileContent = Files.readFile(handlerUri);
                        let handlerFileContent = duProjectManager.GetContent(fileContent);

                        handlersErrors.push(new handlerFileError(handlerUri, key, slotKey, handlerFileContent, null, HandlerErrorReason.NotExistJson));
                    }
                }
            });
        }

        return handlersErrors;
    }

    public static getSpecificHandlerUri(handlerKey: string, slotKey: number, rootUri: vscode.Uri): vscode.Uri {
        let slotDirUri = slotManager.GetSlotDirectoryUri(rootUri, slotKey);

        let handlerUri = handlerManager.GetHandlerFileUri(slotDirUri, handlerKey);

        return handlerUri;
    }

    public static GetHandlerFileUri(root: vscode.Uri, key: string): vscode.Uri {
        let handlerFilename: string = `${handlerManager.GetHandlerFilename(key)}.lua`;

        return vscode.Uri.file(root.fsPath + '\\' + handlerFilename);
    }

    public static GetHandlerFilename(key: string): string {
        return `handler_${key}`;
    }

    public static GetHandlerFileContent(method: IMethod): string {
        return `method_${index}`;
    }

    // public static toFileContent(filter: Filter): string {
    //     return `` +
    //         `--@slotKey:${filter.slotKey}\n` +
    //         `--@signature:${filter.signature}\n` +
    //         ArgContainerManager.toFileContent(filter.args);
    // }
}