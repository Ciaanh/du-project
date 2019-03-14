'use strict';

import ModelHelper from '../utils/modelHelper';
import ProjectFileDescription from "../models/projectFileDescription";
import Method from '../models/method';
import { ProjectItemType, SourceType, FileType } from '../utils/enums';


export default class MethodManager {
    public static LoadFromFiles(methodFile: ProjectFileDescription): Method {
        let method = new Method();

        const content = MethodManager.GetContent(methodFile.content);

        if (content.hasOwnProperty('signature')) {
            method.signature = content["signature"];
        }

        if (content.hasOwnProperty('code')) {
            method.code = content["code"];
        }

        return method;
    }

    private static GetContent(handlerContent: string): any {
        let code = handlerContent.replace(/\r/g, '\n');
        let content = {};

        let contentLines = code.split('\n');

        contentLines.forEach(line => {
            if (line.startsWith("--@")) {
                code = code.replace(line + "\n", "");

                let lineParam = line.substring(3, line.indexOf(":"));
                let lineContent = line.substring(line.indexOf(":") + 1);

                content[lineParam] = lineContent;
            }
        });

        content["code"] = code;
        return content;
    }

    public static LoadFromJson(methodFromJson: any): Method {
        let method = new Method();

        if (methodFromJson.hasOwnProperty('code')) {
            method.code = methodFromJson['code'];
        }

        if (methodFromJson.hasOwnProperty('signature')) {
            method.signature = methodFromJson['signature'];
        }

        return method;
    }

    public static toJsonObject(method: Method): any {
        let jsonObject = {
            "code": method.code,
            "signature": method.signature,
        };
        return jsonObject;
    }

    public static toHtml(method: Method): string {
        let methodString =
            `<li class="method">
    <span class="signature">${method.signature}</span> 
    <code class="lua">
        ${ModelHelper.escapeCodeForPreview(method.code)}
    </code>
</li>`;


        return methodString;
    }

    public static toFileContent(method: Method): string {
        return `--@signature:${method.signature}\n` + method.code;
    }

    public static defineMethodFromObject(method: Method, index: Number): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        projectItem.name = `method_${index}`;
        projectItem.itemType = ProjectItemType.Method;
        projectItem.diskItemType = SourceType.Json;
        projectItem.fileType = FileType.Lua;

        projectItem.content = MethodManager.toFileContent(method);

        return projectItem;
    }

}