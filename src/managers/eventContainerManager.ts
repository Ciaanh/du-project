'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";
import EventContainer from "../models/eventContainer";
import EventManager from "./eventManager";
import { DiskItemType, ProjectItemType } from "../extensionCore/enums";


export default class EventContainerManager {

    public static LoadFromFiles(files: ProjectFileDescription): EventContainer {
        let eventContainer = new EventContainer();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.File
                && item.itemType == ProjectItemType.Event) {
                eventContainer.addRange(EventManager.LoadFromFiles(item));
            }
        });

        return eventContainer;
    }

    public static LoadFromJson(eventsFromJson: any): EventContainer {
        let eventContainer = new EventContainer();

        eventsFromJson.forEach(event => {
            eventContainer.add(EventManager.LoadFromJson(event));
        });
        return eventContainer;
    }

    public static toJsonObject(eventContainer: EventContainer): any {
        let jsonObject = eventContainer.get().map((event) => {
            return EventManager.toJsonObject(event);
        })
        return jsonObject;
    }

    public static toHtml(eventContainer: EventContainer): string {
        let eventsString = "";
        eventContainer.get().forEach(event => {
            eventsString += EventManager.toHtml(event);
        });

        return `<h3>Events</h3><ul class="events">${eventsString}</ul><br/>`;
    }

    public static toFileContent(eventContainer: EventContainer): string {
        return eventContainer.get().map((event) => {
            return EventManager.toFileContent(event);
        }).join("\n");
    }

}