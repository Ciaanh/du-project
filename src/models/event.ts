'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";

export default class Event {
    signature: string;

    public static LoadFromFiles(files: ProjectFileDescription): Event {
        let event = new Event();
        throw new Error("Method not implemented.");
        return event;
    }

    public static LoadFromJson(eventFromJson: string): Event {
        let event = new Event();
        event.signature = eventFromJson;
        return event;
    }

    public toJsonObject(): any {
        throw new Error("Method not implemented.");
    }

    public toHtml(): string {
        let eventString =
            `<li class="event">
<span class="signature">${this.signature}</span> 
</li>`;

        return eventString;
    }

    public toFileContent(): string {
        return this.signature;
    }
}