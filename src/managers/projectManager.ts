import {
  ProjectError,
  methodFileError,
  slotError,
  duProject
} from "../projectView/app/interfaces/vsmodel";
import { IProject } from "../projectView/app/interfaces/dumodel";
import Files from "../utils/files";
import { Uri } from "vscode";
import {
  ProjectErrorReason,
  OverviewMode
} from "../projectView/app/interfaces/enums";
import methodManager from "./methodManager";
import slotManager from "./slotManager";
import { SlotIndexes } from "../projectView/app/interfaces/slotIndexes";
import handlerManager from "./handlerManager";

export default class projectManager {
  public static async LoadFromFiles(uri: Uri): Promise<duProject> {
    let project = new duProject(OverviewMode.Project);

    let rootStats = await Files.readFileStats(uri);
    if (rootStats) {
      if (rootStats.isDirectory()) {
        let documentpath = uri.path.split("/");
        let projectName = documentpath[documentpath.length - 1];

        project.name = projectName;
        project.uri = uri;

        let projectFromJson = await projectManager.loadProjectJson(
          projectName,
          uri
        );
        if (projectFromJson) {
          project.project = projectFromJson;
        }
      }

      project = projectManager.Consolidate(project);
      return project;
    }
    return undefined;
  }

  private static loadProjectJson(projectName: string, rootUri: Uri): IProject {
    let projectJsonFileName: string = `${projectName}.json`;
    let projectJsonUri = Uri.file(rootUri.fsPath + "\\" + projectJsonFileName);

    if (Files.exists(projectJsonUri)) {
      let content = Files.readFile(projectJsonUri);
      let projectAsJson: IProject = JSON.parse(content);

      return projectAsJson;
    }

    return undefined;
  }

  private static Consolidate(duProject: duProject): duProject {
    if (!duProject.project) {
      duProject.projectErrors = new ProjectError(
        ProjectErrorReason.ProjectUndefined,
        undefined,
        undefined
      );
      return duProject;
    }
    // compare json to files on disk to create missing files and update content
    // must be careful with priority json or lua files
    let methodsErrors: methodFileError[];
    let slotsErrors: slotError[];

    if (duProject.project) {
      if (duProject.project.methods && duProject.project.methods.length > 0) {
        // load methods directory
        let methodsDirUri = methodManager.GetMethodsDirectoryUri(duProject.uri);
        methodsErrors = methodManager.consolidateMethods(
          duProject.project.methods,
          methodsDirUri
        );
      }

      if (duProject.project.slots) {
        slotsErrors = slotManager.consolidateSlots(
          duProject.project.slots,
          duProject.uri,
          duProject.project.handlers
        );
      }
    }

    let isValid =
      methodManager.AreValidMethods(methodsErrors) &&
      slotManager.AreValidSlots(slotsErrors);

    if (!isValid) {
      duProject.projectErrors = new ProjectError(
        ProjectErrorReason.Content,
        methodsErrors,
        slotsErrors
      );
    } else {
      duProject.projectErrors = undefined;
    }

    return duProject;
  }

  // public static validateProjectName(projectName: string): string | undefined {
  //     if (projectName.length > 25) {
  //         return `Project name "${projectName} is too long, should be less the 25 char.`;
  //     }
  //     return undefined;
  // }

  public static validateJson(jsonProject: string): string | undefined {
    console.log(`validate json`);
    return undefined;
  }

  public static GenerateProjectFromJson(
    projectname: string,
    jsonProject: string,
    target: Uri
  ): duProject {
    Files.makeDir(target);
    Files.makeJson(projectname, target, jsonProject);

    let projectAsJson: IProject = JSON.parse(jsonProject);

    if (
      projectAsJson &&
      projectAsJson.methods &&
      projectAsJson.methods.length > 0
    ) {
      let methodDir = methodManager.GetMethodsDirectoryUri(target);
      if (!Files.exists(methodDir)) {
        Files.makeDir(methodDir);
      }
      projectAsJson.methods.forEach((method, index) => {
        let methodContent = methodManager.MethodToFileContent(method);
        Files.makeLua(
          methodManager.GetMethodFilename(index),
          methodDir,
          methodContent
        );
      });
    }

    SlotIndexes.indexes.forEach(slotIndex => {
      if (projectAsJson.slots[slotIndex]) {
        let slotDir = slotManager.GetSlotDirectoryUri(target, slotIndex);

        let handlers = handlerManager.getHandlersBySlot(
          slotIndex,
          projectAsJson.handlers
        );
        let slot = projectAsJson.slots[slotIndex];

        let hasHandlers = handlers && handlers.length > 0;
        let hasMethods =
          slot &&
          slot.type &&
          slot.type.methods &&
          slot.type.methods.length > 0;

        if ((hasHandlers || hasMethods) && !Files.exists(slotDir)) {
          Files.makeDir(slotDir);
        }

        if (hasHandlers) {
          handlers.forEach((handler, index) => {
            let handlerContent = handlerManager.HandlerToFileContent(handler);
            Files.makeLua(
              handlerManager.GetHandlerFilename(handler.key),
              slotDir,
              handlerContent
            );
          });
        }

        if (hasMethods) {
          slot.type.methods.forEach((method, index) => {
            let methodContent = methodManager.MethodToFileContent(method);
            Files.makeLua(
              methodManager.GetMethodFilename(index),
              slotDir,
              methodContent
            );
          });
        }
      }
    });

    let duproject = new duProject(OverviewMode.Project);
    duproject.name = projectname;
    duproject.uri = target;
    duproject.project = projectAsJson;

    return duproject;
  }

  // public static async tryLoadProject(uri: Uri) {
  //     return await Files.readFileStats(uri).then(
  //         async (root) => {
  //             if (root.isDirectory()) {
  //                 let documentpath = uri.path.split("/");
  //                 let projectName = documentpath[documentpath.length - 1];
  //                 let projectJsonFileName: string = `${projectName}.json`;
  //                 let projectJsonUri = Uri.file(uri.fsPath + '\\' + projectJsonFileName);
  //                 let existsProjectJson = await Files.exists(projectJsonUri);

  //                 if (existsProjectJson) {
  //                     LoadProject.openProject(uri);
  //                 }
  //             }
  //         });
  // }
}
