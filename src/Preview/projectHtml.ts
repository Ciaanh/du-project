'use strict';

import ProjectManager from "../Core/projectManager";
import Configuration from "../Tools/configuration";
import { DiskItemType } from "../Tools/enums";
import Project from "../models/project";

export default class ProjectHtml {

    public static old_Generate(project: Project, target: string, source: DiskItemType) {
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
    ${ProjectHtml.style}

    ${ProjectHtml.script}

    <h1>Overview of the project ${project.projectName}</h1>

    <a href="${generateProjectUri}">${generateProjectText}</a>

    <div class="project">${ProjectManager.toHtml(project)}</div>

</body>`;

        if (Configuration.isDebug()) {
            console.log(page);
        }
        return page;
    }


    public static Generate(project: Project, source: DiskItemType) {
        let projectSource: string;
        let generateProjectUri = encodeURI('command:extension.generateProjectOrFile?' + JSON.stringify([project.projectName, "target", source]));
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
    ${ProjectHtml.style}

    ${ProjectHtml.script}

    <h1>Overview of the project ${project.projectName}</h1>

    <a href="${generateProjectUri}">${generateProjectText}</a>

    <div class="project">${ProjectManager.toHtml(project)}</div>

</body>`;

        if (Configuration.isDebug()) {
            console.log(page);
        }
        return page;
    }



    // default style for the HTML preview
    private static readonly style =
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
    private static readonly script =
        `<script>

</script>`;

}