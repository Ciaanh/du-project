'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";

export default class Event {
    events: Array<string>;

    public static LoadFromFiles(files: ProjectFileDescription): Event {
        let event = new Event();
        throw new Error("Method not implemented.");
        return event;
    }

    public static LoadFromJson(eventFromJson: any): Event {
        let event = new Event();
        return event;
    }

    public toJsonObject(): any {
        throw new Error("Method not implemented.");
    }

    public toHtml(): string {
        return "";
    }

    private toValueList(separator: string): string {
        return this.events.join(separator);
    }

    public toFileContent(): string {
        return this.toValueList("\n");
    }
}