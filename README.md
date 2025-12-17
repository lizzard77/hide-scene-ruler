# Hide Scene Ruler

A Foundry VTT module that allows GMs to hide the movement rulers for all tokens in specific scenes. The topic was discussed on [GitHub](https://github.com/foundryvtt/foundryvtt/issues/12254) and this functionality will not be included in the core game.

This functionality is useful if, for example, you run scenes with Theatre of the Mind and want to hide the distracting rulers. 

## Features

- **Scene-based ruler visibility control**: Hide or show movement rulers on a per-scene basis with an easy-to-use checkbox in the Scene Configuration dialog

## How It Works

This module patches the `BaseTokenRuler.prototype.isVisible` property to check for a scene flag. When a scene has the "Hide Ruler" flag enabled, all token rulers in that scene will be hidden from view.

## Usage

1. Open the Scene Configuration for any scene (right-click the scene in the navigation bar and select "Configure")
2. Find the "Hide Token Rulers" checkbox in the configuration dialog
3. Check the box to hide rulers in that scene, or uncheck it to show them
4. Save the configuration

The change takes effect immediately when you view the scene. Each scene can have its own ruler visibility setting.

## Installation

1. In Foundry VTT setup, go to the Add-on Modules tab
2. Click "Install Module"
3. Paste the manifest URL: https://github.com/lizzard77/hide-scene-ruler/releases/latest/download/module.json
4. Click Install

## Compatibility

- **Minimum Foundry VTT Version**: 13
- **Verified Foundry VTT Version**: 13

## License

This module is provided as-is for use with Foundry Virtual Tabletop.
