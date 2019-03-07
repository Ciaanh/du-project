'use strict';

import { Uri, window, commands } from "vscode";
import { DiskItemType } from "../Tools/enums";
import ProjectPicker from "../Tools/openFile";
import { encodeProjectUri, encodeProjectFolder } from "../Preview/contentProvider";
import ProjectOverview from "../Preview/ProjectOverview";


export default class OverviewProjectOrJson {

    private static displayView(targetUri: Uri, type: DiskItemType) {


        ProjectOverview.createOrShow(targetUri, type);


        if (type === DiskItemType.File) {
            let uriToPreview = encodeProjectUri(targetUri);

            return commands.executeCommand("workbench.action.closeEditorsInOtherGroups").then(() =>
                commands.executeCommand('vscode.previewHtml', uriToPreview, 1, 'DU Project Preview')
                    .then((success) => { }, (reason) => { window.showErrorMessage(reason); })
            );
        }
        else if (type === DiskItemType.Folder) {
            let uriToPreview = encodeProjectFolder(targetUri);

            return commands.executeCommand("workbench.action.closeEditorsInOtherGroups").then(() =>
                commands.executeCommand('vscode.previewHtml', uriToPreview, 1, 'DU Project Preview')
                    .then((success) => { }, (reason) => { window.showErrorMessage(reason); })
            );

        }
    }

    public static executeCommand(targetUri: Uri, type: DiskItemType, projectPicker: ProjectPicker) {
        if (type === DiskItemType.File) {

            if (targetUri) console.log('launched preview command for file : ' + targetUri.toString());
            else console.log('launched preview command for file');

            let fileUriToPreview;

            if (targetUri && targetUri.path != "") {
                fileUriToPreview = targetUri;
            } else {
                // get uri of file to preview
                // from active text if duproject or from open file popin
                let editor = window.activeTextEditor;

                // display open pop in to get the name of the file to preview        
                if (!editor) {
                    projectPicker.pickFile((pickedResultUri) => {
                        commands.executeCommand('extension.previewDUFile', pickedResultUri);
                    });
                    return;
                }
                // an editor window is open
                else if (editor) {
                    // in case we want window next to active document // editor.viewColumn + 1
                    let doc = editor.document;
                    // check if file in editor window is valid as duproject
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

            return OverviewProjectOrJson.displayView(fileUriToPreview, type);

        }
        else if (type === DiskItemType.Folder) {

            if (targetUri) console.log('launched preview command for project directory : ' + targetUri.toString());
            else console.log('launched preview command for directory');

            let directoryUriToPreview;

            if (targetUri && targetUri.path != "") {
                directoryUriToPreview = targetUri;
            } else {
                projectPicker.pickFolder((pickedResultUri) => {
                    commands.executeCommand('extension.previewDUProject', pickedResultUri);
                });
                return;
            }

            return OverviewProjectOrJson.displayView(directoryUriToPreview, type);
        }
    }
}