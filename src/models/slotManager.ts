'use strict';

import * as vscode from 'vscode';
import { slotError } from './duProject';
import handlerManager from './handlerManager';
import methodManager from './methodManager';
import { ISlot, IHandler } from './duModel';
import { Slots, SlotErrorReason } from '../utils/enums';
import Files from '../utils/files';
import { isNullOrUndefined } from 'util';

export default class slotManager {
    public static AreValidSlots(errors: slotError[]): boolean {
        let isValid = true;

        errors.forEach(slotErrors => {
            if (!slotManager.IsValidSlot(slotErrors)) {
                isValid = false;
            }
        });

        return isValid;
    }

    public static IsValidSlot(slotErrors: slotError) {
        if (slotErrors && slotErrors.slotErrors.length > 0) {
            return false;
        }
        if (!handlerManager.AreValidHandlers(slotErrors.handlerErrors)) {
            return false;
        }
        if (!methodManager.AreValidMethods(slotErrors.methodsErrors)) {
            return false;
        }
        return true;
    }

    public static consolidateSlots(slots: ISlot[], rootUri: vscode.Uri, handlers: IHandler[]): slotError[] {
        let slotErrors = Slots.indexes.map((index) => {
            let slotDirUri = slotManager.GetSlotDirectoryUri(rootUri, index);

            let slot: ISlot = slots[index];
            let slotErrors = new slotError(index);

            let existsSlotDirectory = Files.exists(slotDirUri);
            // check if slot is defined and file is defined
            if (!existsSlotDirectory) {
                slotErrors.slotErrors.push(SlotErrorReason.NotExistDirectory);
            }

            let existsSlotJson = !isNullOrUndefined(slot)
            if (!existsSlotJson) {
                slotErrors.slotErrors.push(SlotErrorReason.NotExistJson);
            }

            if (existsSlotJson && existsSlotDirectory) {
                if (slot.type && slot.type.methods) {
                    let methodsErrors = methodManager.consolidateMethods(slot.type.methods, slotDirUri);
                    slotErrors.methodsErrors = methodsErrors;
                }

                let slotHandlers = handlerManager.getHandlersBySlot(index, handlers);
                if (slotHandlers && slotHandlers.length > 0) {
                    let handlersErrors = handlerManager.consolidateHandlers(slotHandlers, slotDirUri, index);
                    slotErrors.handlerErrors = handlersErrors;
                }
            }
            return slotErrors;
        });

        return slotErrors.filter((value) => { return value != null; });
    }

    public static GetSlotDirectoryUri(root: vscode.Uri, index: number): vscode.Uri {
        let slotDirName: string = `slot_${index}`;
        return vscode.Uri.file(root.fsPath + '\\' + slotDirName);
    }
}