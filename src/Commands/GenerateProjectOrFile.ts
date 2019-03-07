'use strict';

import { Uri, workspace } from "vscode";
import { DiskItemType } from "../Tools/enums";
import ProjectManager from "../Core/projectManager";
import ProjectFileDescription from "../Core/projectFileDescription";

export default class GenerateProjectOrJson {

    public static executeCommand(projectName: string, target: string, source: DiskItemType) {
        console.log('launched generate command');

        if (source === DiskItemType.Json) {
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
                    let jsonObject = ProjectManager.toJsonObject(project);
                    ProjectManager.GenerateJson(jsonObject, projectName, targetUri);
                });
            }
        }
    }
}