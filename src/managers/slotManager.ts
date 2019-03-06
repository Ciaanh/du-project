'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";
import { DiskItemType, ProjectItemType } from "../extensionCore/enums";
import Slot from "../models/slot";
import HandlerContainer from "../models/handlerContainer";
import HandlerContainerManager from "./handlerContainerManager";

export default class SlotManager {

    public static LoadFromFiles(files: ProjectFileDescription, slotKey: number, slotName: string): Slot {
        let slot = new Slot();

        slot.slotKey = slotKey;
        slot.name = slotName;

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.Folder
                && item.itemType == ProjectItemType.Type
                && !slot.type) {
                slot.type = TypeManager.LoadFromFiles(item);
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
            slot.type = TypeManager.LoadFromJson(slotFromJson['type']);
        }

        return slot;
    }

    public static toJsonObject(slot: Slot): any {
        let jsonObject = {
            "name": slot.name,
            "type": slot.type.toJsonObject()
        };
        return jsonObject;
    }

    public static toHtml(slot: Slot, handlers: HandlerContainer): string {
        let slotString =
            `<li class="slot">
    <span class="name">${this.name}</span> 
    ${HandlerContainerManager.toHtml(handlers)}
    ${slot.type.toHtml()}

</li>`;

        return slotString;
    }
}