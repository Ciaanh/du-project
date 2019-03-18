'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import Configuration from '../utils/configuration';
import { duProject } from '../models/duProject';
import duProjectManager from '../models/duProjectManager';

export default class ViewLoader {

    private static currentPanels: ViewLoader[] = [];

    public static readonly viewType = 'duProjectOverview';

    private _projectRoot: vscode.Uri;
    private readonly _panelName: string;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    public static ShowOverview(project: duProject) {

        let projectName = project.name;

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

        //ViewLoader.currentPanels[projectName].initialize(Project)
    }

    private constructor(duProject: duProject, panel: vscode.WebviewPanel, extensionPath: string) {
        this._projectRoot = duProject.rootUri;
        this._panelName = duProject.name;
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
                case 'editHandler':
                    this.onEditHandler(message);
                    return;
            }
        }, null, this._disposables);
    }

    private async onEditHandler(message: any) {
        let handlerKey = message.handlerKey;
        let slotKey = message.slotKey;

        let filePath = duProjectManager.getHandlerUri(handlerKey, slotKey, this._projectRoot);

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

    // public initialize(duProject: Project) {
    //     this._panel.webview.postMessage({ command: 'initialize', data: duProject });
    // }

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

    private Generate(duProject: duProject) {

        // Local path to main script run in the webview
        const reactAppPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'projectView', 'overview.js'));
        const reactAppUri = reactAppPathOnDisk.with({ scheme: 'vscode-resource' });

        // const projectJson = JSON.stringify(ProjectManager.toJsonObject(duProject));
        const projectJson = JSON.stringify(duProject.project);

        const nonce = this.getNonce();

        let page =
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta http-equiv="Content-Security-Policy" 
                    content="default-src 'none'; 
                             img-src https:; 
                             script-src 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}';
                             style-src 'unsafe-inline';">

                <script>
                    window.acquireVsCodeApi = acquireVsCodeApi;
                    window.initialData = ${projectJson};
                </script>
            </head>
            <body>
                <div id="root"></div>

                <script nonce="${nonce}" src="${reactAppUri}"></script>
            </body>
            </html>`;

        return page;
    }
}


