'use strict';

import Slot from './slot'
import SlotContainerManager from '../managers/slotContainerManager';

export default class SlotContainer {
    private slot_3: Slot;
    private slot_2: Slot;
    private slot_1: Slot;
    private slot0: Slot;
    private slot1: Slot;
    private slot2: Slot;
    private slot3: Slot;
    private slot4: Slot;
    private slot5: Slot;
    private slot6: Slot;
    private slot7: Slot;
    private slot8: Slot;
    private slot9: Slot;

    public getAllSlotsAsArray(): Array<Slot> {
        let slotArray = new Array<Slot>();
        SlotContainerManager.slotIndexes.forEach(index => {
            slotArray.push(this.get(index));
        });
        return slotArray;
    }

    public getAllSlotsAsObject(): any {
        let slotObject = {};
        SlotContainerManager.slotIndexes.forEach(index => {
            slotObject[index.toString()] = this.get(index);
        });
        return slotObject;
    }

    // add get/set for slot index
    public get(index: number): Slot {
        switch (index) {
            case -3: return this.slot_3;
            case -2: return this.slot_2;
            case -1: return this.slot_1;
            case 0: return this.slot0;
            case 1: return this.slot1;
            case 2: return this.slot2;
            case 3: return this.slot3;
            case 4: return this.slot4;
            case 5: return this.slot5;
            case 6: return this.slot6;
            case 7: return this.slot7;
            case 8: return this.slot8;
            case 9: return this.slot9;

            default:
                console.log('unknown slot index in getSlot');
                return null;
        }
    }

    public set(index: number, slot: Slot) {
        switch (index) {
            case -3: this.slot_3 = slot; break;
            case -2: this.slot_2 = slot; break;
            case -1: this.slot_1 = slot; break;
            case 0: this.slot0 = slot; break;
            case 1: this.slot1 = slot; break;
            case 2: this.slot2 = slot; break;
            case 3: this.slot3 = slot; break;
            case 4: this.slot4 = slot; break;
            case 5: this.slot5 = slot; break;
            case 6: this.slot6 = slot; break;
            case 7: this.slot7 = slot; break;
            case 8: this.slot8 = slot; break;
            case 9: this.slot9 = slot; break;

            default:
                console.log('unknown slot index in getSlot');
                break;
        }
    }
}