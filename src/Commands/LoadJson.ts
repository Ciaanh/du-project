'use strict';

import { commands, window, InputBoxOptions, SaveDialogOptions, Uri } from "vscode";
import duProjectManager from "../models/duProjectManager";
import ViewLoader from "../projectView/ViewLoader";
import Configuration from "../utils/configuration";

export default class LoadJson {

    public static executeCommand() {
        // change behavior, should open window to paste json from the game 
        // then create folder with .json file and generate code files 
        // for handlers and methods

        let inputBoxOptions: InputBoxOptions = {
            ignoreFocusOut: true,
            validateInput: duProjectManager.validateJson,
            prompt: "Paste json exported from the game.",
        }
        window.showInputBox(inputBoxOptions).then(async value => {
            if (value) {
                // define where to save and create folder
                let saveDialogOption: SaveDialogOptions = {
                    saveLabel: "Save new project"
                };
                await window.showSaveDialog(saveDialogOption).then(async (saveTarget: Uri) => {
                    let documentpath = saveTarget.path.split("/");
                    let projectName = documentpath[documentpath.length - 1];

                    let project = await duProjectManager.GenerateProjectFromJson(projectName, value, saveTarget);
                    if (project) {
                        // if (Configuration.openProjectWorkspace()) {
                        //     await commands.executeCommand("vscode.openFolder", project.rootUri, true);
                        // }
                        // else {
                            ViewLoader.ShowOverview(project);
                        // }

                    }
                    else {
                        // invalid project 
                    }

                });

            }
        });
    }
}