'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";

export default class Files {

    public static readFileStats(file: vscode.Uri): Promise<fs.Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(file.fsPath, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(stats);
            });
        });
    }

    public static readDirectory(directory: vscode.Uri): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(directory.fsPath, (err, list) => {
                if (err) {
                    return reject(err);
                }
                resolve(list);
            });
        });
    }

    public static async readFile(file: vscode.Uri): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let readStream = fs.createReadStream(file.fsPath);
            let chunks = [];

            readStream.on('error', err => {
                return reject(err);
            });

            readStream.on('data', chunk => {
                chunks.push(chunk);
            });

            readStream.on('close', () => {
                return resolve(Buffer.concat(chunks).toString());
            });
        });
    }

    public static async exists(file: vscode.Uri): Promise<boolean> {
        let existsFile = false;
        await fs.exists(file.fsPath, (exists) => {
            existsFile = exists;
        })
        return existsFile;
    }
}