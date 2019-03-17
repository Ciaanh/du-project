'use strict';

import Configuration from "../utils/configuration";
import { workspace, commands, window, Uri, InputBoxOptions } from "vscode";
import OverviewProject from "./OverviewProject";
import duProjectManager from "../models/duProjectManager";

export default class LoadJson {

    public static executeCommand() {
        let projectUri: Uri;



        // change behavior, should open window to paste json from the game 
        // then create folder with .json file and generate code files 
        // for handlers and methods

        let inputBoxOptions: InputBoxOptions = {
            ignoreFocusOut: true,
            validateInput: duProjectManager.validateJson,
            prompt: "Paste json exported from the game.",
        }
        window.showInputBox(inputBoxOptions).then(value => {
            duProjectManager.GenerateProjectFromJson(value);
        });

        //if (type === SourceType.Json) {

        // if (targetUri && targetUri.path != "") {
        //     OverviewProjectOrJson.displayView(targetUri, type);
        // } else {
        //     // get uri of file to preview
        //     // from active text if duproject or from open file popin
        //     let editor = window.activeTextEditor;
        //     let openDialogOptions = {
        //         canSelectFiles: true,
        //         canSelectMany: false,
        //         filters: {
        //             'JSON': ['json']
        //         }
        //     };

        //     // display open pop in to get the name of the file to preview        
        //     if (!editor) {
        //         window.showOpenDialog(openDialogOptions).then((uri) => {
        //             if (uri && uri.length > 0) {
        //                 OverviewProjectOrJson.displayView(uri[0], type);
        //             }
        //             else {
        //                 return; // should raise error or warning
        //             }
        //         });
        //         return;
        //     }
        //     // an editor window is open
        //     else if (editor) {
        //         // in case we want window next to active document // editor.viewColumn + 1
        //         let doc = editor.document;
        //         // check if file in editor window is valid as duproject
        //         if (doc && doc.languageId === "duproject") {
        //             OverviewProjectOrJson.displayView(doc.uri, type);
        //         } else {
        //             window.showOpenDialog(openDialogOptions).then((uri) => {
        //                 if (uri && uri.length > 0) {
        //                     OverviewProjectOrJson.displayView(uri[0], type);
        //                 }
        //                 else {
        //                     return; // should raise error or warning
        //                 }
        //             });
        //             return;
        //         }
        //     }
        // }

        // return;

        //}

        OverviewProject.executeCommand(projectUri);
    }
}