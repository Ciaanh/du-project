'use strict';

import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, Uri, workspace, TextDocumentChangeEvent, TextEditorSelectionChangeEvent } from 'vscode';
import ProjectManager from './extensionCore/projectManager';
import ContentProvider, { encodeProjectUri, encodeProjectFolder } from './extensionCore/Preview/contentProvider';
import ProjectPicker from './extensionCore/openFile';
import { DiskItemType } from './extensionCore/enums';
import ProjectFileDescription from './extensionCore/projectFileDescription';
import Configuration from './extensionCore/configuration';

export function activate(context: ExtensionContext) {

    console.log('du project activated');

    // register the open 
    const projectPicker = new ProjectPicker(context);

    // register the content provider to preview duproject
    const provider = new ContentProvider();
    let registration = workspace.registerTextDocumentContentProvider(ContentProvider.scheme, provider);

    // "onCommand:extension.previewDUFile"
    let disposablePreviewFile = commands.registerCommand('extension.previewDUFile', (fileUri: Uri) => {
        if (fileUri) console.log('launched preview command for file : ' + fileUri.toString());
        else console.log('launched preview command for file');

        let fileUriToPreview;

        if (fileUri && fileUri.path != "") {
            fileUriToPreview = fileUri;
        } else {
            // get uri of file to preview
            // from active text if duproject or from open file popin
            let editor = window.activeTextEditor;

            // display open pop in to get the name of the folder to preview        
            if (!editor) {
                projectPicker.pickFile((pickedResultUri) => {
                    commands.executeCommand('extension.previewDUFile', pickedResultUri);
                });
                return;
            }
            else if (editor) {
                // in case we want window next to active document // editor.viewColumn + 1
                let doc = editor.document;
                if (doc && doc.languageId === "duproject") {
                    fileUriToPreview = doc.uri;
                } else {
                    projectPicker.pickFile((pickedResultUri) => {
                        commands.executeCommand('extension.previewDUFile', pickedResultUri);
                    });
                    return;
                }
            }
        }
        // else raise error window.showErrorMessage(reason);

        let uriToPreview = encodeProjectUri(fileUriToPreview);

        return commands.executeCommand("workbench.action.closeEditorsInOtherGroups").then(() =>
            commands.executeCommand('vscode.previewHtml', uriToPreview, 1, 'DU Project Preview')
                .then((success) => { }, (reason) => { window.showErrorMessage(reason); })
        );
    });

    // "onCommand:extension.previewDUProject"
    let disposablePreviewProject = commands.registerCommand('extension.previewDUProject', (directoryUri: Uri) => {
        if (directoryUri) console.log('launched preview command for project directory : ' + directoryUri.toString());
        else console.log('launched preview command for directory');

        let directoryUriToPreview;

        if (directoryUri && directoryUri.path != "") {
            directoryUriToPreview = directoryUri;
        } else {
            projectPicker.pickFolder((pickedResultUri) => {
                commands.executeCommand('extension.previewDUProject', pickedResultUri);
            });
            return;
        }

        let uriToPreview = encodeProjectFolder(directoryUriToPreview);

        return commands.executeCommand("workbench.action.closeEditorsInOtherGroups").then(() =>
            commands.executeCommand('vscode.previewHtml', uriToPreview, 1, 'DU Project Preview')
                .then((success) => { }, (reason) => { window.showErrorMessage(reason); })
        );
    });

    // internal command extension.generateProjectOrFile called from preview to generate project or json
    let disposableGenerate = commands.registerCommand('extension.generateProjectOrFile', (projectName: string, target: string, source: DiskItemType) => {
        console.log('launched generate command');

        if (source === DiskItemType.File) {
            if (target) {
                let targetUri = Uri.parse(target);
                let tDUProject = ProjectManager.LoadJsonURI(targetUri);
                return tDUProject.then((project) => {
                    let projectFiles = ProjectFileDescription.defineFromProject(project);
                    projectFiles.generate(workspace.workspaceFolders[0].uri.fsPath);
                });
            }
        }
        else if (source === DiskItemType.Folder) {
            if (target) {
                let targetUri = Uri.parse(target);
                let tDUProject = ProjectManager.LoadProject(targetUri);
                return tDUProject.then((project) => {
                    let jsonObject = project.toJsonObject();
                    ProjectManager.GenerateJson(jsonObject, projectName, targetUri);
                });
            }
        }

    });

    // work in progress: allow to define a default workspace for DU projects and open it
    let disposableLoadWorkspace = commands.registerCommand('extension.loadDefaultDUWorkspace', () => {
        console.log('launched load default workspace');

        if (Configuration.hasDefaultWorkspace()) {
            let defaultWorspace = Configuration.defaultWorkspace();
        }

    });

    context.subscriptions.push(disposablePreviewFile, disposablePreviewProject, disposableGenerate, disposableLoadWorkspace);
}