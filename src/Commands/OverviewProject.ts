'use strict';

import { Uri, window, commands } from "vscode";
import { SourceType } from "../utils/enums";
import ViewLoader from "../projectView/ViewLoader";
import { duProject } from "../models/duProject";
import duProjectManager from "../models/duProjectManager";


export default class OverviewProject {

    private static async displayView(targetUri: Uri) {
        let project = await duProjectManager.LoadProject(targetUri);
        if (project) {
            ViewLoader.createOrShow(project);
        }
        else{
            // Project loading error
        }
    }

    public static executeCommand(targetUri: Uri) {

        if (targetUri && targetUri.path != "") {
            OverviewProject.displayView(targetUri);
        } else {
            let openDialogOptions = {
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false
            };

            window.showOpenDialog(openDialogOptions).then((uri) => {
                if (uri && uri.length > 0) {
                    OverviewProject.displayView(uri[0]);
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