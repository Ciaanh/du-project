"use strict";

import { window, OpenDialogOptions, Uri } from "vscode";
import ViewLoader from "../projectView/ViewLoader";
import { duProject } from "../projectView/app/interfaces/vsmodel";
import Files from "../utils/files";
import { IProject } from "../projectView/app/interfaces/dumodel";
import { OverviewMode } from "../projectView/app/interfaces/enums";

export default class LoadJson {
  public static async LoadJsonFile(uri: Uri): Promise<duProject> {
    let project = new duProject(OverviewMode.Project);

    let rootStats = await Files.readFileStats(uri);
    if (rootStats) {
      if (rootStats.isFile()) {
        let documentpath = uri.path.split("/");
        let projectName = documentpath[documentpath.length - 1];

        if (projectName.endsWith(".json")) {
          projectName = projectName.replace(".json", "");
        }

        project.name = projectName;
        project.uri = uri;

        let projectFromJson = await LoadJson.loadProjectJson(uri);
        if (projectFromJson) {
          project.project = projectFromJson;
        }
      }
      return project;
    }
    return undefined;
  }

  private static loadProjectJson(projectJsonUri: Uri): IProject {
    if (Files.exists(projectJsonUri)) {
      let content = Files.readFile(projectJsonUri);
      let projectAsJson: IProject = JSON.parse(content);

      return projectAsJson;
    }
    return undefined;
  }

  private static async openProject(uri: Uri) {
    let project = await LoadJson.LoadJsonFile(uri);
    if (project) {
      ViewLoader.ShowOverview(project);
    } else {
      // Project loading error
    }
  }

  public static executeCommand() {
    let openDialogOptions: OpenDialogOptions = {
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        Json: ["json"]
      }
    };

    window.showOpenDialog(openDialogOptions).then(async uri => {
      if (uri && uri.length > 0) {
        LoadJson.openProject(uri[0]);
      } else {
        return; // should raise error or warning, no directory provided
      }
    });
    return;
  }
}
