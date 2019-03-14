'use strict';

import { Uri, workspace } from "vscode";
import { SourceType } from "../utils/enums";
import ProjectManager from "../models/projectManager";
import ProjectFileDescription from "../models/projectFileDescription";

export default class GenerateProjectOrJson {

    public static executeCommand(projectName: string, target: string, source: SourceType) {
        if (source === SourceType.Json) {
            if (target) {
                let targetUri = Uri.parse(target);
                let tDUProject = ProjectManager.LoadJsonURI(targetUri);
                return tDUProject.then((project) => {
                    let projectFiles = ProjectFileDescription.defineFromProject(project);
                    projectFiles.generate(workspace.workspaceFolders[0].uri.fsPath);
                });
            }
        }
        else if (source === SourceType.Folder) {
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