'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";

export default class Event {
    public static LoadFromFiles(files: ProjectFileDescription): Event {
        let event = new Event();
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
}