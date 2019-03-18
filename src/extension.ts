'use strict';

import { commands, ExtensionContext } from 'vscode';
import Configuration from './utils/configuration';

import LoadProject from './Commands/LoadProject';
import LoadJson from './commands/LoadJson';

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
}