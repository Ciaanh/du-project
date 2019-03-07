"use strict";

import ArgContainer from '../models/argContainer';
import ArgManager from './argManager';

export default class ArgContainerManager {
    public static toJsonObject(container: ArgContainer): any {
        let jsonObject = container.get().map((arg) => {
            return ArgManager.toJsonObject(arg);
        });
        return jsonObject;
    }

    public static toHtml(container: ArgContainer): string {
        let argValueList = container.get().map(arg => {
            return ArgManager.toHtml(arg);
        });
        return argValueList.join(',');
    }

    public static toValueList(container: ArgContainer, separator: string): string {
        let argValueList = container.get().map(arg => {
            return arg.value;
        });
        return argValueList.join(separator);
    }

    public static toFileContent(container: ArgContainer): string {
        return `--@args:${ArgContainerManager.toValueList(container, "-")}\n`;
    }
}