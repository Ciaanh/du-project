'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import Configuration from '../Tools/configuration';
import { DiskItemType } from '../Tools/enums';
import ProjectHtml from './projectHtml';
import ProjectManager from '../Core/projectManager';
import Project from '../models/project';

export default class ProjectOverview {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: ProjectOverview | undefined;

    public static readonly viewType = 'duProjectOverview';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(targetUri: vscode.Uri, type: DiskItemType) {

        let extensionPath: string = Configuration.ExtensionPath;

        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // // If we already have a panel, show it.
        // if (ProjectOverview.currentPanel) {
        //     ProjectOverview.currentPanel._panel.reveal(column);
        //     return;
        // }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(ProjectOverview.viewType, "DU Project Overview", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,

            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'media'))
            ]
        });

        let tDUProject: Thenable<Project>;

        if (type === DiskItemType.File) {
            tDUProject = ProjectManager.LoadJsonURI(targetUri);
        }
        else if (type === DiskItemType.Folder) {
            tDUProject = ProjectManager.LoadProject(targetUri);
        }

        tDUProject.then((project) => {
            ProjectOverview.currentPanel = new ProjectOverview(project, type, panel, extensionPath);
        });

    }

    private constructor(duProject: Project, type: DiskItemType, panel: vscode.WebviewPanel, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;

        // Set the webview's initial html content 
        this._panel.title = duProject.projectName;
        // this._panel.webview.html = this._getHtmlForWebview();
        this._panel.webview.html = ProjectHtml.Generate(duProject, type);

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => {
            this.dispose()
        }, null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._panel.title = duProject.projectName;
                // this._panel.webview.html = this._getHtmlForWebview();
                this._panel.webview.html = ProjectHtml.Generate(duProject, type);
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

    public doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }

    public dispose() {
        ProjectOverview.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _getHtmlForWebview() {

        const catGif = 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif';

        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'media', 'main.js'));

        // And the uri we use to load this script in the webview
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">

                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <body>
                <img src="${catGif}" width="300" />
                <h1 id="lines-of-code-counter">0</h1>

                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
