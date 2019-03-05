'use strict';

import Filter from './filter'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import ModelHelper from '../extensionCore/modelHelper';

export default class Handler {
    key: string;
    filter: Filter;
    code: string;

    public static LoadFromFiles(handlerFileInfo: ProjectFileDescription): Handler {
        let handler = new Handler();

        const handlerInfos = handlerFileInfo.name.replace('.lua', '').split("_");
        const handlerKey = handlerInfos[1];

        const content = Handler.GetContent(handlerFileInfo.content);

        let filterSignature;
        if (content.hasOwnProperty('signature')) {
            filterSignature = content["signature"];
        }

        let filterArgs;
        if (content.hasOwnProperty('args')) {
            filterArgs = content["args"];
        }
        
        let code;
        if (content.hasOwnProperty('code')) {
            code = content["code"];
        }

        let  slotKey: number;
        if (content.hasOwnProperty('slotKey')) {
            slotKey = Number.parseInt(content["slotKey"]);
        }
        
        handler.code = code;
        handler.key = handlerKey;
        handler.filter = Filter.LoadFromFiles(filterSignature, filterArgs, slotKey);

        return handler;
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

    public static LoadFromJson(handlerFromJson: any): Handler {
        let handler = new Handler();

        if (handlerFromJson.hasOwnProperty('key')) {
            handler.key = handlerFromJson['key'];
        }

        if (handlerFromJson.hasOwnProperty('filter')) {
            handler.filter = Filter.LoadFromJson(handlerFromJson['filter']);
        }

        if (handlerFromJson.hasOwnProperty('code')) {
            handler.code = handlerFromJson['code'];
        }

        return handler;
    }

    public toJsonObject(): any {
        let jsonObject = {
            "key": this.key,
            "filter": this.filter.toJsonObject(),
            "code": this.code
        };
        return jsonObject;
    }

    public toHtml(): string {
        return `<li class="filter">
    ${this.filter.toHtml()} 
    <code class="lua">
        ${ModelHelper.escapeCodeForPreview(this.code)}
    </code>
</li>`;
    }

    public toFileContent(): string {
        return this.filter.toFileContent() + this.code;
    }

    public getSignature(): string {
        return this.filter.signature;
    }
}

