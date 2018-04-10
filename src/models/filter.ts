'use strict';

import Arg from "./arg";
import ProjectFileDescription from "../extensionCore/projectFileDescription";
import ArgContainer from "./argContainer";

export default class Filter {
    slotKey: number;
    signature: string;
    args: ArgContainer;

    constructor() {
        this.args = new ArgContainer();
    }

    public static LoadFromFiles(signature: string, argsString: string, slotKey: number): Filter {
        let filter = new Filter();

        filter.signature = signature;
        filter.slotKey = slotKey;

        let args = argsString.split('-');
        if (args && args.length > 0) {
            args.forEach(element => {
                let arg = Arg.LoadFromFiles(element);
                if (arg) filter.args.addArg(arg);
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
                filter.args.addArg(Arg.LoadFromJson(arg));
            });
        }
        return filter;
    }

    public toJsonObject(): any {
        let jsonObject = {
            "slotKey": this.slotKey,
            "signature": this.signature,
            "args": this.args.toJsonObject()
        };
        return jsonObject;

    }

    public toHtml(): string {
        let filterString = this.signature;
        let args = this.args.toHtml();
        let argsString = args == "" ? "" : `: <span class="args">${args}</span>`;

        return `<span class="event">${filterString} ${argsString}</span>`;
    }
}