'use strict';

import Type from "./type";
import Handler from "./handler";
import HandlerContainer from "./handlerContainer";
import ProjectFileDescription from "../extensionCore/projectFileDescription";
import { DiskItemType, ProjectItemType } from "../extensionCore/enums";

export default class Slot {
    name: string;
    type: Type;
    slotKey: number;

    public static LoadFromFiles(files: ProjectFileDescription, slotKey: number, slotName: string): Slot {
        let slot = new Slot();

        slot.slotKey = slotKey;
        slot.name = slotName;

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.Folder
                && item.itemType == ProjectItemType.Type
                && !slot.type) {
                slot.type = Type.LoadFromFiles(item);
            }
            else if (slot.type) {
                // error type already defined
            }

        });

        return slot;
    }

    public static LoadFromJson(slotFromJson: any, slotKey: number): Slot {
        let slot = new Slot();

        slot.slotKey = slotKey;
        if (slotFromJson.hasOwnProperty('name')) {
            slot.name = slotFromJson['name'];
        }

        if (slotFromJson.hasOwnProperty('type')) {
            slot.type = Type.LoadFromJson(slotFromJson['type']);
        }

        return slot;
    }

    public toJsonObject(): any {
        let jsonObject = {
            "name": this.name,
            "type": this.type.toJsonObject()
        };
        return jsonObject;
    }

    public toHtml(handlers: HandlerContainer): string {
        let slotString =
            `<li class="slot">
    <span class="name">${this.name}</span> 
    ${handlers.toHtml()}
    ${this.type.toHtml()}

</li>`;

        return slotString;
    }
}

// {
// "name": "container_3",
// "type": {
//     "methods": [],
//     "events": []
// }