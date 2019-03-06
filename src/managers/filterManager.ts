'use strict';

import Filter from "../models/filter";
import ArgManager from "./argManager";
import ArgContainer from "../models/argContainer";
import ArgContainerManager from "./argContainerManager";

export default class FilterManager {
    public static LoadFromFiles(signature: string, argsString: string, slotKey: number): Filter {
        let filter = new Filter();

        filter.signature = signature;
        filter.slotKey = slotKey;

        let args = argsString.split('-');
        if (args && args.length > 0) {
            args.forEach(element => {
                let arg = ArgManager.LoadFromFiles(element);
                if (arg) filter.args.add(arg);
            });
        }
        return filter;
    }

    public static LoadFromJson(filterFromJson: any): Filter {
        let filter = new Filter();

        if (filterFromJson.hasOwnProperty('slotKey')) {
            filter.slotKey = filterFromJson['slotKey'];
        }

        if (filterFromJson.hasOwnProperty('signature')) {
            filter.signature = filterFromJson['signature'];
        }

        if (filterFromJson.hasOwnProperty('args')) {
            filter.args = new ArgContainer();
            filterFromJson['args'].forEach(arg => {
                filter.args.add(ArgManager.LoadFromJson(arg));
            });
        }
        return filter;
    }

    public static toJsonObject(filter: Filter): any {
        let jsonObject = {
            "slotKey": filter.slotKey,
            "signature": filter.signature,
            "args": ArgContainerManager.toJsonObject(filter.args)
        };
        return jsonObject;

    }

    public static toHtml(filter: Filter): string {
        let filterString = filter.signature;
        let args = ArgContainerManager.toHtml(filter.args);
        let argsString = args == "" ? "" : `: <span class="args">${args}</span>`;

        return `<span class="event">${filterString} ${argsString}</span>`;
    }

    public static toFileContent(filter: Filter): string {
        return `` +
            `--@slotKey:${filter.slotKey}\n` +
            `--@signature:${filter.signature}\n` +
            ArgContainerManager.toFileContent(filter.args);
    }
}