"use strict";

import { commands, ExtensionContext, workspace, Uri } from "vscode";
import Configuration from "./utils/configuration";

import LoadJson from "./commands/LoadJson";
import SaveJson from "./commands/SaveJson";
import LoadProject from "./Commands/LoadProject";

export function activate(context: ExtensionContext) {
  Configuration.ExtensionPath = context.extensionPath;

  // "onCommand:extension.saveJson"
  let disposableSaveAndPreviewJson = commands.registerCommand(
    "extension.saveJson",
    () => {
      SaveJson.executeCommand();
    }
  );

  // "onCommand:extension.loadJson"
  let disposablePreviewJson = commands.registerCommand(
    "extension.loadJson",
    () => {
      LoadJson.executeCommand();
    }
  );

  // "onCommand:extension.loadProject"
  let disposablePreviewProject = commands.registerCommand(
    "extension.loadProject",
    () => {
      LoadProject.executeCommand();
    }
  );

  context.subscriptions.push(
    disposableSaveAndPreviewJson,
    disposablePreviewJson,
    disposablePreviewProject
  );

  // if (Configuration.launchAtStart()) {
  //     if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
  //         let workspaceRoot = workspace.workspaceFolders[0];
  //         LoadProject.tryLoadProject(workspaceRoot.uri);
  //     }
  // }
}
