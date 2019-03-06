import Arg from "../models/arg";

'use strict';

export default class ArgManager {

    public static LoadFromFiles(value: string): Arg {
        if (!value || value == "") return null;

        let arg = new Arg();
        arg.value = value;
        return arg;
    }

    public static LoadFromJson(argFromJson: any): Arg {
        let arg = new Arg();
        if (argFromJson.hasOwnProperty('value')) {
            arg.value = argFromJson['value'];
        }
        return arg;
    }

    public static toJsonObject(arg: Arg): any {
        let jsonObject = {
            "value": arg.value
        }
        return jsonObject;
    }

    public static toHtml(arg: Arg): string {
        return arg.value;
    }
}