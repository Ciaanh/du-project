'use strict';

import { commands, ExtensionContext, Uri, workspace } from 'vscode';
import ProjectPicker from './utils/openFile';
import { DiskItemType } from './utils/enums';
import LoadWorkspace from './commands/LoadWorkspace';
import GenerateProjectOrJson from './commands/GenerateProjectOrFile';
import OverviewProjectOrJson from './commands/OverviewProjectOrJson';
import Configuration from './utils/configuration';

export function activate(context: ExtensionContext) {

    Configuration.ExtensionPath = context.extensionPath;

    // register the open 
    const projectPicker = new ProjectPicker(context);

    // "onCommand:extension.previewDUFile"
    let disposablePreviewFile = commands.registerCommand('extension.previewDUFile', (fileUri: Uri) => {
        return OverviewProjectOrJson.executeCommand(fileUri, DiskItemType.Json, projectPicker);
    });

    // "onCommand:extension.previewDUProject"
    let disposablePreviewProject = commands.registerCommand('extension.previewDUProject', (directoryUri: Uri) => {
        return OverviewProjectOrJson.executeCommand(directoryUri, DiskItemType.Folder, projectPicker);
    });

    // internal command extension.generateProjectOrFile called from preview to generate project or json
    let disposableGenerate = commands.registerCommand('extension.generateProjectOrFile', (projectName: string, target: string, source: DiskItemType) => {
        GenerateProjectOrJson.executeCommand(projectName, target, source);
    });

    // work in progress: allow to define a default workspace for DU projects and open it
    let disposableLoadWorkspace = commands.registerCommand('extension.loadDefaultDUWorkspace', () => {
        LoadWorkspace.executeCommand();
    });

    context.subscriptions.push(disposablePreviewFile, disposablePreviewProject, disposableGenerate, disposableLoadWorkspace);
}