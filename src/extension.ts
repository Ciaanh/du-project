'use strict';

import { commands, ExtensionContext, Uri, workspace } from 'vscode';
import { SourceType } from './utils/enums';
import LoadWorkspace from './commands/LoadWorkspace';
import GenerateProjectOrJson from './commands/GenerateProjectOrFile';
import OverviewProject from './commands/OverviewProject';
import Configuration from './utils/configuration';
import LoadJson from './commands/LoadJson';

export function activate(context: ExtensionContext) {

    Configuration.ExtensionPath = context.extensionPath;

    // "onCommand:extension.loadJson"
    let disposablePreviewFile = commands.registerCommand('extension.loadJson', () => {
        LoadJson.executeCommand();
    });

    // "onCommand:extension.previewDUProject"
    let disposablePreviewProject = commands.registerCommand('extension.previewDUProject', (directoryUri: Uri) => {
        OverviewProject.executeCommand(directoryUri);
    });

    // internal command extension.generateProjectOrFile called from preview to generate project or json
    let disposableGenerate = commands.registerCommand('extension.generateProjectOrFile', (projectName: string, target: string, source: SourceType) => {
        GenerateProjectOrJson.executeCommand(projectName, target, source);
    });

    // work in progress: allow to define a default workspace for DU projects and open it
    let disposableLoadWorkspace = commands.registerCommand('extension.loadDefaultDUWorkspace', () => {
        LoadWorkspace.executeCommand();
    });

    context.subscriptions.push(disposablePreviewFile, disposablePreviewProject, disposableGenerate, disposableLoadWorkspace);
}