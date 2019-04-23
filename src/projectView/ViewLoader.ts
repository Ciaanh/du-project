"use strict";

import * as vscode from "vscode";
import * as path from "path";
import Configuration from "../utils/configuration";
import { duProject } from "./app/interfaces/vsmodel";
import handlerManager from "../managers/handlerManager";
import { IFixMethodErrorMessage } from "./app/interfaces/messages";

export default class ViewLoader {
  private static currentPanels: ViewLoader[] = [];

  public static readonly viewType = "duProjectOverview";

  private _projectRoot: vscode.Uri;
  private readonly _panelName: string;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static ShowOverview(project: duProject) {
    let projectName = project.name;

    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (ViewLoader.currentPanels[projectName]) {
      ViewLoader.currentPanels[projectName]._panel.reveal(column);
      return;
    }

    let extensionPath: string = Configuration.ExtensionPath;

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      ViewLoader.viewType,
      `Overview : ${projectName}`,
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,

        localResourceRoots: [
          vscode.Uri.file(path.join(extensionPath, "projectView"))
        ]
      }
    );

    ViewLoader.currentPanels[projectName] = new ViewLoader(
      project,
      panel,
      extensionPath
    );
  }

  private constructor(
    duProject: duProject,
    panel: vscode.WebviewPanel,
    extensionPath: string
  ) {
    this._projectRoot = duProject.uri;
    this._panelName = duProject.name;
    this._panel = panel;
    this._extensionPath = extensionPath;

    this._panel.webview.html = this.Generate(duProject);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this._disposables
    );

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      e => {
        if (this._panel.visible) {
          //this._panel.webview.html = this._getHtmlForWebview(duProject);
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          // case 'editHandler':
          //     this.onEditHandler(message);
          //     return;
          case "fixMethodError":
            this.onFixMethodErrorHandler(message);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  private async onFixMethodErrorHandler(message: IFixMethodErrorMessage) {
    vscode.window.showErrorMessage(
      `reason: ${message.methodError.reason}, uri ${message.methodError.uri}`
    );
  }

  private async onEditHandler(message: any) {
    let handlerKey = message.handlerKey;
    let slotKey = message.slotKey;

    let filePath = handlerManager.getSpecificHandlerUri(
      handlerKey,
      slotKey,
      this._projectRoot
    );

    vscode.window.showErrorMessage(`handler: ${handlerKey}, slot ${slotKey}`);

    // open or modify handler lua file ????
    // investigate execute command on save

    //             let uri = vscode.Uri.file(filePath);
    //             vscode.workspace.openTextDocument(uri)
    //             // let success = await vscode.commands.executeCommand('vscode.open', uri);
    //             vscode.window.showTextDocument(uri).then(editor => {
    //                 // editor.
    //             })

    // vscode.workspace.onDidSaveTextDocument((doc)=>{
    // doc.fileName
    // });
  }

  public dispose() {
    ViewLoader.currentPanels[this._panelName] = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private Generate(duProject: duProject) {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "projectView", "overview.js")
    );
    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

    const bootstrapPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "projectView", "bootstrap.css")
    );
    const bootstrapUri = bootstrapPathOnDisk.with({
      scheme: "vscode-resource"
    });

    const projectJson = JSON.stringify(duProject);

    let page = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta http-equiv="Content-Security-Policy" 
                    content="default-src 'none'; 
                             img-src https:; 
                             script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

                <link rel="stylesheet" href="${bootstrapUri}">

                <script>
                    window.acquireVsCodeApi = acquireVsCodeApi;
                    window.initialData = ${projectJson};
                </script>
            </head>
            <body class="w3-light-grey">
                <div id="root" class="w3-margin-top"></div>

                <script src="${reactAppUri}"></script>
            </body>
            </html>`;

    return page;
  }
}
