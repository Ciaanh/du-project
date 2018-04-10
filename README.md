# du-project README

This extension for Visual Studio Code provide some tools to manage code project for the game Dual Universe

There is a trello available to notify Bugs and Ideas: https://trello.com/b/Dnl4fPQ9/vs-code-du-project-extension

## Features

This extension is to be used to make it easier to manage code projects for Dual Universe outside of the game.
Using the built-in command we can display an HTML preview of Json files exported from the game, create projects folders and then recompile the project to Json in order to import it back into the game.

The files containing the code from the game should be named \<_`projectName`_\>**_`.du.json`_**

The folders containing the generated project with each .lua files are named **_`du_`_**\<`projectName`\>

```
Example of project structure :

du_project
│
└───Events
│
└───Methods
|
└───Slots
│   │
│   └───slot_<slotKey>_<slotName>
|       │   handler_<key>_<filter-action>_<filter-args>.txt
|       │   file112.txt
|       |
│       └───Type
|       |   │
|       |   └───Events
|       |   │
|       |   └───Methods
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

### 0.184.1 alpha version

Initial release of the DU Project extension, include :

* Preview of Json exported from the game as HTML, files must be name with **_.du.json_** extension, use command **_previewDUFile_** 

* Generate project from the preview of a file, will create a folder named **du_projectName** which contains all the lua as separate files named depending on the slot and filter (link in the preview page for the file)

* Preview project folder (generated with the extension) as HTML, use command **_previewDUProject_**

* Compile the project folder as a Json file in order to import it in game (link in the preview page for the folder)

* Public release on Github and publication on VS Code marketplace


**Enjoy!**
