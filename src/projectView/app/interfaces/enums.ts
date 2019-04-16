"use strict";

export enum ProjectErrorReason {
  ProjectUndefined,
  Content
}

export enum SlotErrorReason {
  NotExistDirectory,
  NotExistJson
}

export enum HandlerErrorReason {
  Code,
  Key,
  Filter,
  FilterSlotKey,
  FilterSignature,
  FilterArgs,
  KeyNotDefined,
  SlotNotDefined,
  NotExistFile,
  NotExistJson
}

export enum MethodErrorReason {
  Code,
  Signature,
  NotExistFile,
  NotExistJson
}
