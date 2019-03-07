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
    public static currentPanel: ProjectOverview[];

    public static readonly viewType = 'duProjectOverview';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(project: Project) {

        let projectName = project.projectName;

        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        if (ProjectOverview.currentPanel[projectName]) {
            ProjectOverview.currentPanel[projectName]._panel.reveal(column);
            return;
        }

        let extensionPath: string = Configuration.ExtensionPath;

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(ProjectOverview.viewType, `Overview ${projectName}`, column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,

            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'projectOverviewMedia'))
            ]
        });

        ProjectOverview.currentPanel[projectName] = new ProjectOverview(project, panel, extensionPath);
    }

    private constructor(duProject: Project, panel: vscode.WebviewPanel, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;

        // Set the webview's initial html content 
        this._panel.webview.html = this._getHtmlForWebview(duProject);

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => {
            this.dispose()
        }, null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._panel.webview.html = this._getHtmlForWebview(duProject);
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

    private _getHtmlForWebview(duProject: Project) {

        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'projectOverviewMedia', 'main.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'projectOverviewMedia', 'style.css'));
        const styleUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        return ProjectHtml.Generate(duProject, scriptUri, styleUri);
    }
}


