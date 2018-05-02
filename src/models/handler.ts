'use strict';

import Filter from './filter'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import ModelHelper from '../extensionCore/modelHelper';

export default class Handler {
    key: string;
    filter: Filter;
    code: string;

    public static LoadFromFiles(handlerFileInfo: ProjectFileDescription, slotKey: number): Handler {
        let handler = new Handler();

        const handlerInfos = handlerFileInfo.name.replace('.lua', '').split("_");
        const handlerKey = handlerInfos[1];
        const filterSignature = handlerInfos[2];
        const filterArgs = handlerInfos[3];

        handler.code = handlerFileInfo.content.replace(/\r/g, '\n');
        handler.key = handlerKey;
        handler.filter = Filter.LoadFromFiles(filterSignature, filterArgs, slotKey);

        return handler;
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
}

