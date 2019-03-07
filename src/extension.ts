'use strict';

import { commands, ExtensionContext, Uri, workspace } from 'vscode';
import ContentProvider from './Preview/contentProvider';
import ProjectPicker from './extensionCore/openFile';
import { DiskItemType } from './extensionCore/enums';
import LoadWorkspace from './Commands/LoadWorkspace';
import GenerateProjectOrJson from './Commands/GenerateProjectOrFile';
import OverviewProjectOrJson from './Commands/OverviewProjectOrJson';

export function activate(context: ExtensionContext) {

    // register the open 
    const projectPicker = new ProjectPicker(context);

    // register the content provider to preview duproject
    const provider = new ContentProvider();

    workspace.registerTextDocumentContentProvider(ContentProvider.scheme, provider);

    // "onCommand:extension.previewDUFile"
    let disposablePreviewFile = commands.registerCommand('extension.previewDUFile', (fileUri: Uri) => {
        return OverviewProjectOrJson.executeCommand(fileUri, DiskItemType.File, projectPicker);
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