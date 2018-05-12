'use strict';

import Method from './method'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';

export default class MethodContainer {
    private methodList: Array<Method>;

    constructor() {
        this.methodList = new Array<Method>();
    }

    public getMethods(): Array<Method> {
        return this.methodList;
    }

    public addMethod(event: Method) {
        this.methodList.push(event);
    }

    public static LoadFromFiles(files: ProjectFileDescription): MethodContainer {
        let methods = new MethodContainer();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.File
                && item.itemType == ProjectItemType.Method) {
                methods.addMethod(Method.LoadFromFiles(item));
            }
        });

        return methods;
    }

    public static LoadFromJson(methodsFromJson: any): MethodContainer {
        let methods = new MethodContainer();

        methods.methodList = new Array<Method>();
        methodsFromJson.forEach(method => {
            methods.methodList.push(Method.LoadFromJson(method));
        });
        return methods;
    }

    public toJsonObject(): any {
        let jsonObject = this.methodList.map((value) => {
            return value.toJsonObject();
        })
        return jsonObject;
    }

    public toHtml(): string {
        let methodsString = "";
        this.methodList.forEach(method => {
            methodsString += method.toHtml();
        });

        return `<h3>Methods</h3><ul class="methods">${methodsString}</ul><br/>`;
    }
}