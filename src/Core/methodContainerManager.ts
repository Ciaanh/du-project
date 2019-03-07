'use strict';

import ProjectFileDescription from '../Core/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../Tools/enums';
import MethodContainer from '../models/methodContainer';
import MethodManager from './methodManager';
import Method from '../models/method';

export default class MethodContainerManager {

    public static LoadFromFiles(files: ProjectFileDescription): MethodContainer {
        let methods = new MethodContainer();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.Json
                && item.itemType == ProjectItemType.Method) {
                methods.add(MethodManager.LoadFromFiles(item));
            }
        });

        return methods;
    }

    public static LoadFromJson(methodsFromJson: any): MethodContainer {
        let methods = new MethodContainer();

        methodsFromJson.forEach(method => {
            methods.add(MethodManager.LoadFromJson(method));
        });
        return methods;
    }

    public static toJsonObject(methodContainer: MethodContainer): any {
        let jsonObject = methodContainer.get().map((method) => {
            return MethodManager.toJsonObject(method);
        })
        return jsonObject;
    }

    public static toHtml(methodContainer: MethodContainer): string {
        let methodsString = "";
        methodContainer.get().forEach(method => {
            methodsString += MethodManager.toHtml(method);
        });

        return `<h3>Methods</h3><ul class="methods">${methodsString}</ul><br/>`;
    }

    public static createMethods(methods: Method[]): ProjectFileDescription {
        let methodContainer = new ProjectFileDescription();
        methodContainer.itemType = ProjectItemType.MethodContainer;
        methodContainer.name = "Methods";
        methodContainer.diskItemType = DiskItemType.Folder;

        let methodItems = new Array<ProjectFileDescription>();
        if (methods) {
            methods.forEach((method, index) => {
                let item = MethodManager.defineMethodFromObject(method, index);
                methodItems.push(item);
            });
        }
        methodContainer.subItems = methodItems;
        return methodContainer;
    }
}