import ProjectFileDescription from "../extensionCore/projectFileDescription";

'use strict';

export default class Arg {
    value: string;

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

    public toJsonObject(): any {
        let jsonObject = {
            "value": this.value
        }
        return jsonObject;
    }

    public toHtml(): string {
        return this.value;
    }
}