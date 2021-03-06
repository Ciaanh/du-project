'use strict';

import * as vscode from 'vscode';
import DUProject from '../duproject';
import ProjectManager from '../projectManager';
import { DiskItemType } from '../enums';
import Configuration from '../configuration';

export default class ContentProvider implements vscode.TextDocumentContentProvider {
    public static readonly scheme = 'duproject';

    constructor() { }

    public provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
        let [target, type] = decodeProjectTarget(uri);

        if (type === DiskItemType.File) {
            if (target) {
                let targetUri = vscode.Uri.parse(target);
                let tDUProject = ProjectManager.LoadJsonURI(targetUri);
                return tDUProject.then((project) => {
                    return this.createPage(project, target, type);
                });
            }
            // else raise error

        }
        else if (type === DiskItemType.Folder) {
            if (target) {
                let targetUri = vscode.Uri.parse(target);
                let tDUProject = ProjectManager.LoadProject(targetUri);
                return tDUProject.then((project) => {
                    return this.createPage(project, target, type);
                });
            }
            // else raise error
        }
    }

    private createPage(project: DUProject, target: string, source: DiskItemType) {
        let projectSource: string;
        let generateProjectUri = encodeURI('command:extension.generateProjectOrFile?' + JSON.stringify([project.projectName, target, source]));
        let generateProjectText: string;

        switch (source) {
            case DiskItemType.File:
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
        let page =
            `<body class="project-preview">
    ${this.style}

    ${this.script}

    <h1>Overview of the project ${project.projectName}</h1>

    <a href="${generateProjectUri}">${generateProjectText}</a>

    <div class="project">${project.toHtml()}</div>

</body>`;

        if (Configuration.isDebug()) {
            console.log(page);
        }
        return page;
    }

    // default style for the HTML preview
    private readonly style =
        `<style>
    .project-preview {
        font-family: Helmet, FreeSans, Sans-Serif;
        font-size: 14px;
        line-height: 1.5em;
        background: #222;
        color: #fff
    }

    .project-preview a {
        color: #fff
    }

    .slots{

    }

    .slots li {
        list-style: none;
        padding: 3px;
        margin: 2px;
        background-color: #444;
    }

    .slot{

    }

    .name{

    }

    .filters{

    }

    .filter {
        font-size: 14px;
        color: #f9ecb3;
        font-style: italic
    }

    .signature{

    }
    
    .action{

    }

    .args{

    }

    .lua{

    }

    .events{

    }

    .events li {
        list-style: none;
        padding: 3px;
        margin: 2px;
        background-color: #444;
    }

    .event{

    }

    .methods{

    }

    .methods li {
        list-style: none;
        padding: 3px;
        margin: 2px;
        background-color: #444;
    }

    .method{

    }
</style>`;

    // define script include in the html... to be tested
    private readonly script =
        `<script>

</script>`;
}



// encode an URI inside an handled preview URI
export function encodeProjectUri(uri: vscode.Uri): vscode.Uri {
    const query = JSON.stringify([uri.toString(), DiskItemType.File]);
    return vscode.Uri.parse(`${ContentProvider.scheme}:Target?${query}`);
}

export function encodeProjectFolder(uri: vscode.Uri): vscode.Uri {
    const query = JSON.stringify([uri.toString(), DiskItemType.Folder]);
    return vscode.Uri.parse(`${ContentProvider.scheme}:Target?${query}`);
}

export function decodeProjectTarget(uri: vscode.Uri): [string, DiskItemType] {
    let [target, type] = <[string, DiskItemType]>JSON.parse(uri.query);
    return [target, type];
}
