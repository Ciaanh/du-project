'use strict';

import MethodContainer from "./methodContainer";
import EventContainer from "./eventContainer";
import ProjectFileDescription from "../extensionCore/projectFileDescription";
import { ProjectItemType, DiskItemType } from "../extensionCore/enums";

export default class Type {
    methods: MethodContainer;
    events: EventContainer;

    public static LoadFromFiles(files: ProjectFileDescription): Type {
        let type = new Type();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.Folder
                && item.itemType == ProjectItemType.MethodContainer
                && !type.methods) {
                type.methods = MethodContainer.LoadFromFiles(item);
            }
            else if (type.methods) {
                // error type already defined
            }

            if (item.diskItemType == DiskItemType.Folder
                && item.itemType == ProjectItemType.EventContainer
                && !type.events) {
                type.events = EventContainer.LoadFromFiles(item);
            }
            else if (type.events) {
                // error type already defined
            }
        });

        return type;
    }

    public static LoadFromJson(typeFromJson: any): Type {
        let type = new Type();

        if (typeFromJson.hasOwnProperty('methods')) {
            type.methods = MethodContainer.LoadFromJson(typeFromJson['methods']);
        }

        if (typeFromJson.hasOwnProperty('events')) {
            type.events = EventContainer.LoadFromJson(typeFromJson['events']);
        }

        return type;
    }

    public toJsonObject(): any {
        let jsonObject = {
            "methods": this.methods.toJsonObject(),
            "events": this.events.toJsonObject()
        };
        return jsonObject;
    }

    public toHtml(): string {
        let slotString =
            `<div class="type">
    <ul class="events">${this.events.toHtml()}</ul>
    <ul class="methods">${this.methods.toHtml()}</ul>
</div>`;

        return slotString;
    }
}