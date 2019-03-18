'use strict';

import { commands, window, InputBoxOptions, SaveDialogOptions, Uri } from "vscode";
import duProjectManager from "../models/duProjectManager";
import ViewLoader from "../projectView/ViewLoader";

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
                let saveDialogOption: SaveDialogOptions = {};
                await window.showSaveDialog(saveDialogOption).then(async (saveTarget: Uri) => {
                    let projectName = "toto";

                    // display request for project name

                    let project = await duProjectManager.GenerateProjectFromJson(projectName, value, saveTarget);
                    if (project) {
                        commands.executeCommand("vscode.openFolder", project.rootUri, false).then(() => {
                            ViewLoader.ShowOverview(project);
                        });
                    }
                    else {
                        // invalid project 
                    }

                });

            }
        });
    }
}