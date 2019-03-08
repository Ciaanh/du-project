'use strict';

import ProjectManager from "../Core/projectManager";
import { DiskItemType } from "../Tools/enums";
import Project from "../models/project";
import { Uri } from "vscode";

export default class ProjectHtml {

    public static Generate(project: Project, scriptUri: Uri, styleUri: Uri) {
        let projectSource: string;
        let generateProjectText: string;

        switch (project.sourceType) {
            case DiskItemType.Json:
                projectSource = "<h2>Loaded from a .json file.</h2>";
                generateProjectText = "Generate project from this file";
                break;
            case DiskItemType.Folder:
                projectSource = "<h2>Loaded from a project folder.</h2>";
                generateProjectText = "Generate a json file for the game from this project";
                break;
            default:
                break;
        }

        const nonce = ProjectHtml.getNonce();


        let page =
            `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}'; style-src vscode-resource:;">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" href="${styleUri}" type="text/css">
    </head>
    <body class="project-preview">

        <h1>Overview of the project ${project.projectName}</h1>

        ${projectSource}

        <a id="generateProject">${generateProjectText}</a>

        <div class="project">${ProjectManager.toHtml(project)}</div>
        
        <script nonce="${nonce}" src="${scriptUri}"></script>

    </body>
</html>`;

        return page;
    }

    private static getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }



    public static GenerateReact(project: Project, scriptUri: Uri) {
        let projectSource: string;
        let generateProjectText: string;

        switch (project.sourceType) {
            case DiskItemType.Json:
                projectSource = "<h2>Loaded from a .json file.</h2>";
                generateProjectText = "Generate project from this file";
                break;
            case DiskItemType.Folder:
                projectSource = "<h2>Loaded from a project folder.</h2>";
                generateProjectText = "Generate a json file for the game from this project";
                break;
            default:
                break;
        }

        const nonce = ProjectHtml.getNonce();


        let page =
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src 'nonce-${nonce}';">
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;

        return page;
    }

}