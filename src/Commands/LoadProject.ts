'use strict';

import { window,commands } from "vscode";
import ViewLoader from "../projectView/ViewLoader";
import duProjectManager from "../models/duProjectManager";


export default class LoadProject {

    public static executeCommand() {
        let openDialogOptions = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        };

        window.showOpenDialog(openDialogOptions).then(async (uri) => {
            if (uri && uri.length > 0) {
                // set uri as workspace

                // need to check if new window param to false is ok 
                commands.executeCommand("vscode.openFolder", uri, false)
                
                let project = await duProjectManager.LoadProject(uri[0]);
                if (project) {
                    ViewLoader.ShowOverview(project);
                }
                else {
                    // Project loading error
                }
            }
            else {
                return; // should raise error or warning, no directory provided
            }
        });
        return;
    }
}