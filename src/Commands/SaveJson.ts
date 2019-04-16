'use strict';

import { window, InputBoxOptions, SaveDialogOptions, Uri } from "vscode";
import ViewLoader from "../projectView/ViewLoader";
import { IProject } from "../projectView/app/interfaces/dumodel";
import Files from "../utils/files";
import { duProject } from "../projectView/app/interfaces/vsmodel";

export default class SaveJson {

    public static validateJson(jsonProject: string): string | undefined {
        console.log(`validate json`);
        return undefined;
    }

    public static executeCommand() {

        let inputBoxOptions: InputBoxOptions = {
            ignoreFocusOut: true,
            validateInput: SaveJson.validateJson,
            prompt: "Paste json exported from the game.",
        }
        window.showInputBox(inputBoxOptions).then(async jsonProject => {
            if (jsonProject) {
                // define where to save and create folder
                let saveDialogOption: SaveDialogOptions = {
                    saveLabel: "Save new project",
                    filters: {
                        "Json": ["json"]
                    }
                };
                await window.showSaveDialog(saveDialogOption).then(async (saveTarget: Uri) => {
                    let documentpath = saveTarget.path.split("/");
                    let projectName = documentpath[documentpath.length - 1];

                    if (!projectName.endsWith(".json")) {
                        projectName.replace(".json", "");
                    }

                    Files.makeFile(saveTarget, jsonProject);

                    //let project = await duProjectManager.GenerateProjectFromJson(projectName, value, saveTarget);

                    let project: IProject = JSON.parse(jsonProject);

                    let duproject = new duProject();
                    duproject.name = projectName;
                    duproject.uri = saveTarget;
                    duproject.project = project;


                    ViewLoader.ShowOverview(duproject);


                });

            }
        });
    }
}