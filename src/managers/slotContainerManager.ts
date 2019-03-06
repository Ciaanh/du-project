'use strict';

import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';
import SlotContainer from '../models/slotContainer';

export default class SlotContainerManager {
        public static LoadFromFiles(files: ProjectFileDescription): SlotContainer {
        let slots = new SlotContainer();
        files.subItems.forEach(slotDescription => {
            if (slotDescription.diskItemType == DiskItemType.Folder && slotDescription.itemType == ProjectItemType.Slot) {
                const slotInfos = slotDescription.name.split("_");
                const slotIndex = Number.parseInt(slotInfos[1]);
                const slotName = slotInfos[2];

                let slot = SlotManager.LoadFromFiles(slotDescription, slotIndex, slotName);

                slots.setSlot(slotIndex, slot);
            }
        });
        return slots;
    }

    public static LoadFromJson(slotsFromJson: any): SlotContainer {
        let slots = new SlotContainer();
        slots.slotIndexes.forEach(index => {
            if (slotsFromJson.hasOwnProperty(index)) {
                slots.setSlot(index, Slot.LoadFromJson(slotsFromJson[index], index));
            }
        });
        return slots;
    }



    public static toJsonObject(): any {
        let jsonObject = {
            "-3": this.slot_3.toJsonObject(),
            "-2": this.slot_2.toJsonObject(),
            "-1": this.slot_1.toJsonObject(),
            "0": this.slot0.toJsonObject(),
            "1": this.slot1.toJsonObject(),
            "2": this.slot2.toJsonObject(),
            "3": this.slot3.toJsonObject(),
            "4": this.slot4.toJsonObject(),
            "5": this.slot5.toJsonObject(),
            "6": this.slot6.toJsonObject(),
            "7": this.slot7.toJsonObject(),
            "8": this.slot8.toJsonObject(),
            "9": this.slot9.toJsonObject(),
        }
        return jsonObject;
    }

    public static toHtml(handlers: Handlers) {
        let slotsString = "";

        this.getAllSlots().forEach(slot => {
            let slotHandlers = handlers.getBySlotKey(slot.slotKey);
            let slotString = slot.toHtml(slotHandlers);
            slotsString += slotString;
        });

        return `<h3>Slots</h3><ul class="slots">${slotsString}</ul><br/>`;
    }
}