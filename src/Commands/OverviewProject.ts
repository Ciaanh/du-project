'use strict';

import { Uri, window, commands } from "vscode";
import { SourceType } from "../utils/enums";
import ViewLoader from "../projectView/ViewLoader";
import duProject from "../duProject";
import duProjectManager from "../duProjectManager";


export default class OverviewProject {

    private static displayView(targetUri: Uri) {
        if (duProjectManager.isValidProject(targetUri)) {
            duProjectManager
                .LoadProject(targetUri)
                .then((project) => {
                    ViewLoader.createOrShow(project);
                });
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