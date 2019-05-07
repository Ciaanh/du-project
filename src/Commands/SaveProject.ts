"use strict";

import {
  window,
  OpenDialogOptions,
  Uri,
  SaveDialogOptions,
  InputBoxOptions
} from "vscode";
import ViewLoader from "../projectView/ViewLoader";
import Files from "../utils/files";
import methodManager from "../managers/methodManager";
import {
  duProject,
  ProjectError,
  methodFileError,
  slotError
} from "../projectView/app/interfaces/vsmodel";
import handlerManager from "../managers/handlerManager";
import slotManager from "../managers/slotManager";
import { SlotIndexes } from "../projectView/app/interfaces/slotIndexes";
import { IProject } from "../projectView/app/interfaces/dumodel";
import {
  ProjectErrorReason,
  OverviewMode
} from "../projectView/app/interfaces/enums";
import projectManager from "../managers/projectManager";

export default class SaveProject {
  public static executeCommand() {
    let inputBoxOptions: InputBoxOptions = {
      ignoreFocusOut: true,
      validateInput: projectManager.validateJson,
      prompt: "Paste json exported from the game."
    };
    window.showInputBox(inputBoxOptions).then(async jsonProject => {
      if (jsonProject) {
        // define where to save and create folder
        let saveDialogOption: SaveDialogOptions = {
          saveLabel: "Save new project"
        };
        await window
          .showSaveDialog(saveDialogOption)
          .then(async (saveTarget: Uri) => {
            let documentpath = saveTarget.path.split("/");
            let projectName = documentpath[documentpath.length - 1];

            if (!projectName.endsWith(".json")) {
              projectName.replace(".json", "");
            }

            //Files.makeFile(saveTarget, jsonProject);

            let duproject = await projectManager.GenerateProjectFromJson(
              projectName,
              jsonProject,
              saveTarget
            );

            //let project: IProject = JSON.parse(jsonProject);

            // let duproject = new duProject(OverviewMode.JsonFile);
            // duproject.name = projectName;
            // duproject.uri = saveTarget;
            // duproject.project = project;

            ViewLoader.ShowOverview(duproject);
          });
      }
    });
  }
}
