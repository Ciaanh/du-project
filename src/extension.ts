'use strict';

import { commands, ExtensionContext, workspace, Uri } from 'vscode';
import Configuration from './utils/configuration';

import LoadProject from './Commands/LoadProject';
import LoadJson from './commands/LoadJson';
import Files from './utils/files';

export function activate(context: ExtensionContext) {

    Configuration.ExtensionPath = context.extensionPath;

    // "onCommand:extension.loadJson"
    let disposablePreviewFile = commands.registerCommand('extension.loadJson', () => {
        LoadJson.executeCommand();
    });

    // "onCommand:extension.previewDUProject"
    let disposablePreviewProject = commands.registerCommand('extension.loadProject', () => {
        LoadProject.executeCommand();
    });

    context.subscriptions.push(disposablePreviewFile, disposablePreviewProject);

    
    // if (Configuration.launchAtStart()) {
    //     if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    //         let workspaceRoot = workspace.workspaceFolders[0];
    //         LoadProject.tryLoadProject(workspaceRoot.uri);
    //     }
    // }
}