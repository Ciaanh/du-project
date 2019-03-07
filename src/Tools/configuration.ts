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

    public static hasDefaultWorkspace(): boolean {
        let config = Configuration.getConfiguration();
        if (config.has("defaultWorkspace")) {
            return true;
        }
        return false;
    }

    public static defaultWorkspace(): string {
        let config = Configuration.getConfiguration();
        if (Configuration.hasDefaultWorkspace()) {
            return config.get<string>("defaultWorkspace");
        }
        return null;
    }

    public static ExtensionPath: string;
}