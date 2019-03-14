'use strict';

import ProjectFileDescription from "../models/projectFileDescription";
import { SourceType, ProjectItemType } from "../utils/enums";
import Slot from "../models/slot";
import HandlerContainer from "../models/handlerContainer";
import HandlerContainerManager from "./handlerContainerManager";
import TypeManager from "./typeManager";

export default class SlotManager {

    public static LoadFromFiles(files: ProjectFileDescription, slotKey: number, slotName: string): Slot {
        let slot = new Slot();

        slot.slotKey = slotKey;
        slot.name = slotName;

        files.subItems.forEach(item => {
            if (item.diskItemType == SourceType.Folder
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
            "type": TypeManager.toJsonObject(slot.type)
        };
        return jsonObject;
    }

    public static toHtml(slot: Slot, handlers: HandlerContainer): string {
        let slotString =
            `<li class="slot">
    <span class="name">${slot.name}</span> 
    ${HandlerContainerManager.toHtml(handlers)}
    ${TypeManager.toHtml(slot.type)}

</li>`;

        return slotString;
    }

    public static defineSlotFromObject(slot: Slot, handlers: HandlerContainer): ProjectFileDescription {
        let projectItem = new ProjectFileDescription();

        // warning separator _ may be contained in the slot name, replace it
        projectItem.name = `slot_${slot.slotKey.toString()}_${slot.name}`;
        projectItem.itemType = ProjectItemType.Slot;
        projectItem.diskItemType = SourceType.Folder;

        projectItem.subItems = HandlerContainerManager.createHandlers(handlers);

        let typeItem = TypeManager.createType(slot.type);
        projectItem.subItems.push(typeItem);

        return projectItem;
    }
}