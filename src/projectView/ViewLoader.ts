'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import Configuration from '../utils/configuration';
import { DiskItemType } from '../utils/enums';
import Project from '../models/project';

export default class ViewLoader {

    private static currentPanels: ViewLoader[] = [];

    public static readonly viewType = 'duProjectOverview';
    private readonly _panelName: string;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(project: Project) {

        let projectName = project.projectName;

        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        if (ViewLoader.currentPanels[projectName]) {
            ViewLoader.currentPanels[projectName]._panel.reveal(column);
            return;
        }

        let extensionPath: string = Configuration.ExtensionPath;

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(ViewLoader.viewType, `Overview :${projectName}`, column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,

            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'projectView'))
            ]
        });

        ViewLoader.currentPanels[projectName] = new ViewLoader(project, panel, extensionPath);

    }

    private constructor(duProject: Project, panel: vscode.WebviewPanel, extensionPath: string) {
        this._panelName = duProject.projectName;
        this._panel = panel;
        this._extensionPath = extensionPath;

        // Set the webview's initial html content 
        // this._panel.webview.html = this._getHtmlForWebview(duProject);
        this._panel.webview.html = this.Generate(duProject);


        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => {
            this.dispose()
        }, null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                //this._panel.webview.html = this._getHtmlForWebview(duProject);
            }
        }, null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }

    public initialize(duProject: Project) {
        this._panel.webview.postMessage({ command: 'initialize', data: duProject });
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


    private getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private Generate(duProject: Project) {

        // Local path to main script run in the webview
        const reactAppPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'projectView', 'overview.js'));
        const reactAppUri = reactAppPathOnDisk.with({ scheme: 'vscode-resource' });

        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'projectView', 'main.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        const nonce = this.getNonce();


        let projectSource: string;
        let generateProjectText: string;

        switch (duProject.sourceType) {
            case DiskItemType.Json:
                projectSource = "<h2>Loaded from a .json file.</h2>";
                generateProjectText = "Generate project from this file";
                break;
            case DiskItemType.Folder:
                projectSource = "<h2>Loaded from a project folder.</h2>";
                generateProjectText = "Generate a json file for the game from this project";
                break;
            default:
                break;
        }




        let page =
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src 'nonce-${nonce}' 'unsafe-eval';style-src 'unsafe-inline'">
                
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

                <script nonce="${nonce}" src="${scriptUri}"></script>
            </head>
            <body>
                <div id="root"></div>
                <script></script>
                <script nonce="${nonce}" src="${reactAppUri}"></script>
            </body>
            </html>`;

        return page;
    }
}


