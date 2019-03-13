'use strict';

import Configuration from "../utils/configuration";
import { workspace, commands, window } from "vscode";

export default class LoadWorkspace {

    public static executeCommand() {
        console.log('launched load default workspace');

        let openDialogOptions = { canSelectFiles: true, canSelectFolders: true }; // only one of these options

        window.showOpenDialog(openDialogOptions).then((uri) => {
            console.log(uri);
        });

        // showSaveDialog().then( (uri) => console.log(uri) );

        // showWorkspacFolderPick().then( (uri) => console.log(uri) );


        if (Configuration.hasDefaultWorkspace()) {
            let defaultWorspace = Configuration.defaultWorkspace();
        }
    }
}