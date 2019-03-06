'use strict';

import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';
import MethodContainer from '../models/methodContainer';
import MethodManager from './methodManager';

export default class MethodContainerManager {

    public static LoadFromFiles(files: ProjectFileDescription): MethodContainer {
        let methods = new MethodContainer();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.File
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
}