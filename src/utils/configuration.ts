"use strict";

import * as vscode from 'vscode';

export default class Configuration {
    private static extensionName() { return "duproject" };

    private static getConfiguration() {
        return vscode.workspace.getConfiguration(Configuration.extensionName());
    }

    public static isDebug(): boolean {
        let config = Configuration.getConfiguration();
        if (config.has("isDebug")) {
            return config.get<boolean>("isDebug");
        }
        return false;
    }

    // public static launchAtStart(): boolean {
    //     let config = Configuration.getConfiguration();
    //     return config.get("launchAtStart", false as boolean);
    // }

    // public static openProjectWorkspace(): boolean {
    //     let config = Configuration.getConfiguration();
    //     return config.get("openProjectWorkspace", false as boolean);
    // }

    // "duproject.launchAtStart": {
    //     "type": [
    //         "boolean"
    //     ],
    //     "scope": "application",
    //     "default": true,
    //     "description": "Launch overview on workspace load."
    // },
    // "duproject.openProjectWorkspace": {
    //     "type": [
    //         "boolean"
    //     ],
    //     "scope": "application",
    //     "default": true,
    //     "description": "Open project as a workspace on overview."
    // },

    public static ExtensionPath: string;

}