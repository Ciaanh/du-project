'use strict';

import ModelHelper from '../extensionCore/modelHelper';
import ProjectFileDescription from "../extensionCore/projectFileDescription";


export default class Method {
    signature: string;
    code: string;

    public static LoadFromFiles(methodFile: ProjectFileDescription): Method {
        let method = new Method();
        
        const content = Method.GetContent(methodFile.content);

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

    public toJsonObject(): any {
        let jsonObject = {
            "code": this.code,
            "signature": this.signature,
        };
        return jsonObject;
    }

    public toHtml(): string {
        let methodString =
            `<li class="method">
    <span class="signature">${this.signature}</span> 
    <code class="lua">
        ${ModelHelper.escapeCodeForPreview(this.code)}
    </code>
</li>`;


        return methodString;
    }

    public toFileContent(): string {
        return `--@signature:${this.signature}\n` + this.code;
    }
}