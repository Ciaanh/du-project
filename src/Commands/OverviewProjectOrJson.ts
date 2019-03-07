'use strict';

import { Uri, window, commands } from "vscode";
import { DiskItemType } from "../Tools/enums";
import ProjectPicker from "../Tools/openFile";
import { encodeProjectUri, encodeProjectFolder } from "../Preview/contentProvider";


export default class OverviewProjectOrJson {

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

            let uriToPreview = encodeProjectFolder(directoryUriToPreview);

            return commands.executeCommand("workbench.action.closeEditorsInOtherGroups").then(() =>
                commands.executeCommand('vscode.previewHtml', uriToPreview, 1, 'DU Project Preview')
                    .then((success) => { }, (reason) => { window.showErrorMessage(reason); })
            );


        }


    }
}