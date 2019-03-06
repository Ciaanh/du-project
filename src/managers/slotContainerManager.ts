'use strict';

import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';
import SlotContainer from '../models/slotContainer';
import SlotManager from './slotManager';
import HandlerContainer from '../models/handlerContainer';

export default class SlotContainerManager {
    public static LoadFromFiles(files: ProjectFileDescription): SlotContainer {
        let slots = new SlotContainer();
        files.subItems.forEach(slotDescription => {
            if (slotDescription.diskItemType == DiskItemType.Folder && slotDescription.itemType == ProjectItemType.Slot) {
                const slotInfos = slotDescription.name.split("_");
                const slotIndex = Number.parseInt(slotInfos[1]);
                const slotName = slotInfos[2];

                let slot = SlotManager.LoadFromFiles(slotDescription, slotIndex, slotName);

                slots.set(slotIndex, slot);
            }
        });
        return slots;
    }

    public static LoadFromJson(slotsFromJson: any): SlotContainer {
        let slots = new SlotContainer();
        SlotContainerManager.slotIndexes.forEach(index => {
            if (slotsFromJson.hasOwnProperty(index)) {
                slots.set(index, SlotManager.LoadFromJson(slotsFromJson[index], index));
            }
        });
        return slots;
    }

    public static toJsonObject(slotContainer: SlotContainer): any {
        let slots = slotContainer.getAllSlots();

        let jsonObject = {
            "-3": SlotManager.toJsonObject(slots[-3]),
            "-2": SlotManager.toJsonObject(slots[-2]),
            "-1": SlotManager.toJsonObject(slots[-1]),
            "0": SlotManager.toJsonObject(slots[0]),
            "1": SlotManager.toJsonObject(slots[1]),
            "2": SlotManager.toJsonObject(slots[2]),
            "3": SlotManager.toJsonObject(slots[3]),
            "4": SlotManager.toJsonObject(slots[4]),
            "5": SlotManager.toJsonObject(slots[5]),
            "6": SlotManager.toJsonObject(slots[6]),
            "7": SlotManager.toJsonObject(slots[7]),
            "8": SlotManager.toJsonObject(slots[8]),
            "9": SlotManager.toJsonObject(slots[9]),
        }
        return jsonObject;
    }

    public static toHtml(slotContainer: SlotContainer, handlers: HandlerContainer) {
        let slotsString = "";

        slotContainer.getAllSlots().forEach(slot => {
            let slotHandlers = handlers.getBySlotKey(slot.slotKey);
            let slotString = SlotManager.toHtml(slot, slotHandlers);
            slotsString += slotString;
        });

        return `<h3>Slots</h3><ul class="slots">${slotsString}</ul><br/>`;
    }

    public static slotIndexes: Array<number> = [
        -3,
        -2,
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ];
}