"use strict";

import Arg from './arg'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';

export default class ArgContainer {
    private argList: Array<Arg>;

    constructor() {
        this.argList = new Array<Arg>();
    }

    public getArgs(): Array<Arg> {
        return this.argList;
    }

    public addArg(arg: Arg) {
        this.argList.push(arg);
    }

    public toJsonObject(): any {
        let jsonObject = this.argList.map((value) => {
            return value.toJsonObject();
        });
        return jsonObject;
    }

    public toHtml(): string {
        let argValueList = this.argList.map(arg => {
            return arg.toHtml();
        });
        return argValueList.join(',');
    }

    public toValueList(separator: string): string {
        let argValueList = this.argList.map(arg => {
            return arg.value;
        });
        return argValueList.join(separator);
    }

    public toFileContent(): string {
        return `--@args:${this.toValueList("-")}\n`;
    }
}