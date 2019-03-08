'use strict';

import ProjectFileDescription from '../models/projectFileDescription';
import ModelHelper from '../utils/modelHelper';
import Handler from '../models/handler';
import FilterManager from './filterManager';
import { ProjectItemType, DiskItemType, FileType } from '../utils/enums';

export default class HandlerManager {


    public static LoadFromFiles(handlerFileInfo: ProjectFileDescription): Handler {
        let handler = new Handler();

        const handlerInfos = handlerFileInfo.name.replace('.lua', '').split("_");
        const handlerKey = handlerInfos[1];

        const content = HandlerManager.GetContent(handlerFileInfo.content);

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

        let slotKey: number;
        if (content.hasOwnProperty('slotKey')) {
            slotKey = Number.parseInt(content["slotKey"]);
        }

        handler.code = code;
        handler.key = handlerKey;
        handler.filter = FilterManager.LoadFromFiles(filterSignature, filterArgs, slotKey);

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
            handler.filter = FilterManager.LoadFromJson(handlerFromJson['filter']);
        }

        if (handlerFromJson.hasOwnProperty('code')) {
            handler.code = handlerFromJson['code'];
        }

        return handler;
    }

    public static toJsonObject(handler: Handler): any {
        let jsonObject = {
            "key": handler.key,
            "filter": FilterManager.toJsonObject(handler.filter),
            "code": handler.code
        };
        return jsonObject;
    }

    public static toHtml(handler: Handler): string {
        return `<li class="filter">
    ${FilterManager.toHtml(handler.filter)} 
    <code class="lua">
        ${ModelHelper.escapeCodeForPreview(handler.code)}
    </code>
</li>`;
    }

    public static toFileContent(handler: Handler): string {
        return FilterManager.toFileContent(handler.filter) + handler.code;
    }

    public static defineHandlerFromObject(handler: Handler): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        projectItem.name = `handler_${handler.key}`;
        projectItem.itemType = ProjectItemType.Handler;
        projectItem.diskItemType = DiskItemType.Json;
        projectItem.fileType = FileType.Lua;

        projectItem.content = HandlerManager.toFileContent(handler);

        return projectItem;
    }
}

