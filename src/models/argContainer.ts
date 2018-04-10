"use strict";

import Arg from './arg'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { FileType, ProjectItemType } from '../extensionCore/enums';

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

    // public static LoadFromFiles(files: ProjectFileDescription): ArgContainer {
    //     let args = new ArgContainer();

    //     files.subItems.forEach(item => {
    //         if (item.fileType == FileType.File
    //             && item.itemType == ProjectItemType.Arg) {
    //             args.addArg(Arg.LoadFromFiles(item));
    //         }
    //     });

    //     return args;
    // }

    // public static LoadFromJson(argsFromJson: any): ArgContainer {
    //     let args = new ArgContainer();

    //     args.argList = new Array<Arg>();
    //     argsFromJson.forEach(arg => {
    //         args.argList.push(Arg.LoadFromJson(arg));
    //     });
    //     return args;
    // }

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
}