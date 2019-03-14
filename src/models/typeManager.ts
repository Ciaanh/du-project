'use strict';

import ProjectFileDescription from "../models/projectFileDescription";
import { ProjectItemType, SourceType } from "../utils/enums";
import Type from "../models/type";
import MethodContainerManager from "./methodContainerManager";
import EventContainerManager from "./eventContainerManager";

export default class TypeManager {

    public static LoadFromFiles(files: ProjectFileDescription): Type {
        let type = new Type();

        files.subItems.forEach(item => {
            if (item.diskItemType == SourceType.Folder
                && item.itemType == ProjectItemType.MethodContainer
                && !type.methods) {
                type.methods = MethodContainerManager.LoadFromFiles(item);
            }
            else if (type.methods) {
                // error type already defined
            }

            if (item.diskItemType == SourceType.Folder
                && item.itemType == ProjectItemType.EventContainer
                && !type.events) {
                type.events = EventContainerManager.LoadFromFiles(item);
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
            type.methods = MethodContainerManager.LoadFromJson(typeFromJson['methods']);
        }

        if (typeFromJson.hasOwnProperty('events')) {
            type.events = EventContainerManager.LoadFromJson(typeFromJson['events']);
        }

        return type;
    }

    public static toJsonObject(type: Type): any {
        let jsonObject = {
            "methods": MethodContainerManager.toJsonObject(type.methods),
            "events": EventContainerManager.toJsonObject(type.events)
        };
        return jsonObject;
    }

    public static toHtml(type: Type): string {
        let slotString =
            `<div class="type">
    <ul class="events">${EventContainerManager.toHtml(type.events)}</ul>
    <ul class="methods">${MethodContainerManager.toHtml(type.methods)}</ul>
</div>`;

        return slotString;
    }

    public static createType(type: Type): ProjectFileDescription {
        let typeObject = new ProjectFileDescription();
        typeObject.itemType = ProjectItemType.Type;
        typeObject.name = "Type";
        typeObject.diskItemType = SourceType.Folder;

        let subItems = new Array<ProjectFileDescription>();
        if (type) {
            subItems.push(MethodContainerManager.createMethods(type.methods.get()));
            subItems.push(EventContainerManager.createEvents(type.events));
        }
        typeObject.subItems = subItems;
        return typeObject;
    }
}