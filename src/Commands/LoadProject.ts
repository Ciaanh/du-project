"use strict";

import { window, OpenDialogOptions, Uri } from "vscode";
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

export default class LoadProject {
  private static async openProject(uri: Uri) {
    let project = await projectManager.LoadFromFiles(uri);
    if (project) {
      ViewLoader.ShowOverview(project);
    } else {
      // Project loading error
    }
  }

  public static executeCommand() {
    let openDialogOptions: OpenDialogOptions = {
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false
    };

    window.showOpenDialog(openDialogOptions).then(async uri => {
      if (uri && uri.length > 0) {
        LoadProject.openProject(uri[0]);
      } else {
        return; // should raise error or warning, no directory provided
      }
    });
    return;
  }
}
