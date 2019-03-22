'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from 'path';

export default class Files {

    public static makeLua(fileName: string, directory: vscode.Uri, content: string) {
        let fileNameWithExtension: string = `${fileName}.lua`;
        let fileUri = vscode.Uri.file(directory.fsPath + '\\' + fileNameWithExtension);

        return Files.makeFile(fileUri, content);
    }

    public static makeJson(fileName: string, directory: vscode.Uri, content: string) {
        let fileNameWithExtension: string = `${fileName}.json`;
        let fileUri = vscode.Uri.file(directory.fsPath + '\\' + fileNameWithExtension);

        return Files.makeFile(fileUri, content);
    }

    private static makeFile(fileUri: vscode.Uri, content: string) {
        if (!Files.exists(fileUri)) {
            fs.writeFileSync(fileUri.fsPath, content);
        }
    }


    public static makeDir(dir: vscode.Uri) {
        if (fs.existsSync(dir.fsPath)) {
            return;
        }
        fs.mkdirSync(dir.fsPath);
    }

    public static readFileStats(file: vscode.Uri): fs.Stats {
        return fs.statSync(file.fsPath);
    }

    public static readDirectory(directory: vscode.Uri): string[] {
        return fs.readdirSync(directory.fsPath);
    }

    public static readFile(file: vscode.Uri): string {
        return fs.readFileSync(file.fsPath, 'utf8');
    }

    public static exists(file: vscode.Uri): boolean {
        return fs.existsSync(file.fsPath);
    }
}