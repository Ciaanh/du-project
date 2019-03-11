export interface IProject {
    "slots": ISlot[],
    "handlers": IHandler[],
    "methods": IMethod[],
    "events": string[]
}

export interface ISlot {
    "name": string,
    "type": IType
}

export interface IType {
    "methods": IMethod[],
    "events": string[]
}

export interface IMethod {
    "code": string,
    "signature": string,
}

export interface IHandler {
    "key": string,
    "filter": IFilter,
    "code": string
}

export interface IFilter {
    "slotKey": number,
    "signature": string,
    "args": IArg[]
}

export interface IArg {
    "value": string
}