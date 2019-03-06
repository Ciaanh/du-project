'use strict';

import * as vscode from 'vscode';
import Slot from './slot'
import Handlers from './handlerContainer';
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';

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

    private slotIndexes: Array<number> = [
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

    public getAllSlots(): Array<Slot> {
        let slotArray = new Array<Slot>();
        this.slotIndexes.forEach(index => {
            slotArray.push(this.getSlot(index));
        });
        return slotArray;
    }

    // add get/set for slot index
    public getSlot(index: number): Slot {
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

    public setSlot(index: number, slot: Slot) {
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