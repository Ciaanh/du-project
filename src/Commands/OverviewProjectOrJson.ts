'use strict';

import { Uri, window, commands } from "vscode";
import { DiskItemType } from "../utils/enums";
import ViewLoader from "../projectView/ViewLoader";
import ProjectManager from "../models/projectManager";
import Project from "../models/project";


export default class OverviewProjectOrJson {

    private static displayView(targetUri: Uri, type: DiskItemType) {
        let tDUProject: Thenable<Project>;

        if (type === DiskItemType.Json) {
            tDUProject = ProjectManager.LoadJsonURI(targetUri);
        }
        else if (type === DiskItemType.Folder) {
            tDUProject = ProjectManager.LoadProject(targetUri);
        }

        tDUProject.then((project) => {
            ViewLoader.createOrShow(project);
        });
    }

    public static executeCommand(targetUri: Uri, type: DiskItemType) {
        if (type === DiskItemType.Json) {

            if (targetUri && targetUri.path != "") {
                OverviewProjectOrJson.displayView(targetUri, type);
            } else {
                // get uri of file to preview
                // from active text if duproject or from open file popin
                let editor = window.activeTextEditor;
                let openDialogOptions = {
                    canSelectFiles: true,
                    canSelectMany: false,
                    filters: {
                        'JSON': ['json']
                    }
                };

                // display open pop in to get the name of the file to preview        
                if (!editor) {
                    window.showOpenDialog(openDialogOptions).then((uri) => {
                        if (uri && uri.length > 0) {
                            OverviewProjectOrJson.displayView(uri[0], type);
                        }
                        else {
                            return; // should raise error or warning
                        }
                    });
                    return;
                }
                // an editor window is open
                else if (editor) {
                    // in case we want window next to active document // editor.viewColumn + 1
                    let doc = editor.document;
                    // check if file in editor window is valid as duproject
                    if (doc && doc.languageId === "duproject") {
                        OverviewProjectOrJson.displayView(doc.uri, type);
                    } else {
                        window.showOpenDialog(openDialogOptions).then((uri) => {
                            if (uri && uri.length > 0) {
                                OverviewProjectOrJson.displayView(uri[0], type);
                            }
                            else {
                                return; // should raise error or warning
                            }
                        });
                        return;
                    }
                }
            }

            return;

        }
        else if (type === DiskItemType.Folder) {
            if (targetUri && targetUri.path != "") {
                OverviewProjectOrJson.displayView(targetUri, type);
            } else {
                let openDialogOptions = {
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false
                };

                window.showOpenDialog(openDialogOptions).then((uri) => {
                    if (uri && uri.length > 0) {
                        OverviewProjectOrJson.displayView(uri[0], type);
                    }
                    else {
                        return; // should raise error or warning
                    }
                });
                return;
            }

            return;
        }
    }
}