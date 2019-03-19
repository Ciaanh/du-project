'use strict';

import { window, commands, OpenDialogOptions, Uri } from "vscode";
import ViewLoader from "../projectView/ViewLoader";
import duProjectManager from "../models/duProjectManager";
import Files from "../utils/files";
import Configuration from "../utils/configuration";


export default class LoadProject {

    private static async openProject(uri: Uri) {
        let project = await duProjectManager.LoadProject(uri);
        if (project) {
            ViewLoader.ShowOverview(project);
        }
        else {
            // Project loading error
        }
    }

    // public static async tryLoadProject(uri: Uri) {
    //     return await Files.readFileStats(uri).then(
    //         async (root) => {
    //             if (root.isDirectory()) {
    //                 let documentpath = uri.path.split("/");
    //                 let projectName = documentpath[documentpath.length - 1];
    //                 let projectJsonFileName: string = `${projectName}.json`;
    //                 let projectJsonUri = Uri.file(uri.fsPath + '\\' + projectJsonFileName);
    //                 let existsProjectJson = await Files.exists(projectJsonUri);

    //                 if (existsProjectJson) {
    //                     LoadProject.openProject(uri);
    //                 }
    //             }
    //         });
    // }

    public static executeCommand() {
        let openDialogOptions: OpenDialogOptions = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        };

        window.showOpenDialog(openDialogOptions).then(async (uri) => {
            if (uri && uri.length > 0) {

                // if (Configuration.openProjectWorkspace()) {
                //     commands.executeCommand("vscode.openFolder", uri[0], false)
                // }
                // else {
                    LoadProject.openProject(uri[0]);
                // }
            }
            else {
                return; // should raise error or warning, no directory provided
            }
        });
        return;
    }
}