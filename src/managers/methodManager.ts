'use strict';

import * as vscode from 'vscode';
import Files from '../utils/files';
import { MethodErrorReason } from '../projectView/app/interfaces/enums';
import duProjectManager from './duProjectManager';
import { isNullOrUndefined } from 'util';
import { IMethod } from '../projectView/app/interfaces/dumodel';
import { methodFileError } from '../projectView/app/interfaces/vsmodel';

export default class methodManager {
    public static AreValidMethods(errors: methodFileError[]): boolean {
        return !(errors && errors.length > 0);
    }

    public static consolidateMethods(methods: IMethod[], methodsDirUri: vscode.Uri): methodFileError[] {
        let methodsErrors: methodFileError[] = [];

        let methodsDirStats = Files.readFileStats(methodsDirUri);
        if (methodsDirStats.isDirectory()) {
            // check folder methods, check each method by index, filename : method_<methodIndex>.lua

            // check that methods from Json exist as a file
            methods.forEach((method, index) => {

                let methodUri = methodManager.GetMethodFileUri(methodsDirUri, index);

                if (!Files.exists(methodUri)) {
                    methodsErrors.push(new methodFileError(methodUri, index, null, method, MethodErrorReason.NotExistFile));
                }
                else {
                    let methodDirStats = Files.readFileStats(methodUri);
                    if (methodDirStats.isFile()) {
                        let fileContent = Files.readFile(methodUri);
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

            let methodsDir = Files.readDirectory(methodsDirUri);
            // check that methods from files exist in Json
            methodsDir.forEach(async (methodFile) => {
                // method_<methodIndex>.lua
                let methodUri = vscode.Uri.file(methodsDirUri.fsPath + '\\' + methodFile);
                let methodDirStats = Files.readFileStats(methodUri);
                if (methodDirStats.isFile() && methodFile.indexOf('method_') > -1) {
                    let index: number = Number.parseInt(methodFile.replace("method_", "").replace(".lua", ""));
                    let methodFromJson = methods[index];

                    if (isNullOrUndefined(methodFromJson)) {
                        let fileContent = Files.readFile(methodUri);
                        let methodFileContent = duProjectManager.GetContent(fileContent);

                        methodsErrors.push(new methodFileError(methodUri, index, methodFileContent, null, MethodErrorReason.NotExistJson));
                    }
                }
            });
        }

        return methodsErrors;
    }

    public static GetMethodsDirectoryUri(root: vscode.Uri): vscode.Uri {
        return vscode.Uri.file(root.fsPath + '\\Methods');
    }

    public static GetMethodFileUri(root: vscode.Uri, index: number): vscode.Uri {
        let handlerFilename: string = `${methodManager.GetMethodFilename(index)}.lua`;

        return vscode.Uri.file(root.fsPath + '\\' + handlerFilename);
    }

    public static GetMethodFilename(index: number): string {
        return `method_${index}`;
    }

    public static MethodToFileContent(method: IMethod): string {
        return `` +
            `--@signature:${method.signature}\n` +
            method.code;
    }


}