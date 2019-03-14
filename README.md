# du-project README

This extension for Visual Studio Code provide some tools to manage code project for the game Dual Universe


## Features

This extension is to be used to make it easier to manage code projects for Dual Universe outside of the game.
Using the built-in command we can display an HTML preview of Json files exported from the game, create projects folders and then recompile the project to Json in order to import it back into the game.

The files containing the code from the game should be named \<_`projectName`_\>**_`.json`_**

The folders containing the generated project with each .lua files are named **_`du_`_**\<`projectName`\>

```
Example of project structure :

du_projectName
│
└───projectName.json
│
└───Methods
|   method_000.lua
|   method_001.lua
|   method_<methodIndex>.lua
|
└───Slot_<slotKey>
    handler_<key>.lua
    method_<index>.lua

```

## Dependencies

No dependencies has been defined for this extension but as it will generate **.lua** files it is recommended to have a Lua parser.

## Extension Settings

This extension contributes the following settings:

* `duproject.isDebug`: enable/disable the debug mode
* `duproject.defaultWorkspace`: specify a default workspace to be use to contain project by default (implementation to be done)

## Known Issues

The **method** and **event** object are not defined yet, if the Json you try to parse contains such object the preview and/or generation of the project will fail. 

## Release Notes

### 0.1904.1 alpha version

Replace ContentProvider with Webview API

* Only two actions: 
* - Create project with copy/paste code from game
* - Overview an existing du project

* Improve and simplify project structure : 
* - Du project now rely on .json file from the game not the folder structure, only .lua code files are extracted with simpler naming

* Overview will check integrity of project (content of .lua files and content in json)

### 0.1903.3 alpha version

Refactor code: separate models and managers.

### 0.1903.2 alpha version

Fix load project and improve project files using header in lua files instead of filenames.

### 0.1903.1 alpha version

Bug fixes and file naming improvement.

### 0.1804.1 alpha version

Initial release of the DU Project extension, include :

* Preview of Json exported from the game as HTML, files must be name with **_.json_** extension, use command **_previewDUFile_** 

* Generate project from the preview of a file, will create a folder named **du_projectName** which contains all the lua as separate files named depending on the slot and filter (link in the preview page for the file)

* Preview project folder (generated with the extension) as HTML, use command **_previewDUProject_**

* Compile the project folder as a Json file in order to import it in game (link in the preview page for the folder)

* Public release on Github and publication on VS Code marketplace



**Enjoy!**
