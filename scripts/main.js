/**
 * Hide Scene Ruler
 * 
 * A Foundry VTT module that allows GMs to hide the movement rulers
 * for all tokens in a specific scene via a scene flag. This is useful
 * for scenarios where distances are unimportant like in Theater of the Mind 
 * style gameplay.
 */

const MODULE_ID = "hide-scene-ruler";
const FLAG_NAME = "hideRuler";

Hooks.once("init", () => {
  // 1. Patch BaseTokenRuler.prototype.isVisible
  // We capture the original getter to call it if the ruler isn't hidden
  const descriptor = Object.getOwnPropertyDescriptor(foundry.canvas.placeables.tokens.BaseTokenRuler.prototype, "isVisible");
  const originalGet = descriptor.get;

  // Redefine the isVisible property
  Object.defineProperty(foundry.canvas.placeables.tokens.BaseTokenRuler.prototype, "isVisible", {
    get: function () {
      // Check if the current scene has the 'hideRuler' flag set
      if (canvas.scene?.getFlag(MODULE_ID, FLAG_NAME)) {
        return false;
      }
      // Otherwise, use the default logic
      return originalGet.call(this);
    },
    configurable: true
  });
});

// 2. Add checkbox to Scene Configuration
Hooks.on("renderSceneConfig", (app, html, data) => {
  const isHidden = app.document.getFlag(MODULE_ID, FLAG_NAME);
  
  // Create the form group
  const formGroup = `
    <div class="form-group">
        <label for="flags.${MODULE_ID}.${FLAG_NAME}">${game.i18n.localize("HSR.SettingLabel")}</label>
        <input type="checkbox" name="flags.${MODULE_ID}.${FLAG_NAME}" ${isHidden ? "checked" : ""}>
        <p class="hint">${game.i18n.localize("HSR.SettingHint")}</p>
    </div>
  `;

  // Inject after the "Token Vision" setting or at the end of the Basic tab
  $(html).find('input[name="navName"]').closest(".form-group").after(formGroup);
  
  // Recalculate window height to fit new content
  app.setPosition({ height: "auto" });
});

// 3. Live Update: Refresh tokens when the flag changes
Hooks.on("canvasReady", () => {
  const scene = canvas.scene;
  if (!scene.isView) return; // Only affect the currently viewed scene
  
  // Log the current state
  const isHidden = scene.getFlag(MODULE_ID, FLAG_NAME);
  if (isHidden) {
    console.log(`${MODULE_ID} | Hiding rulers for all tokens in scene "${scene.name}"`);
  } else {
    console.log(`${MODULE_ID} | Showing rulers for all tokens in scene "${scene.name}"`);
  }
  
  // Refresh all token rulers (the isVisible getter will automatically return the correct value)
  for (const token of canvas.tokens.placeables) {
    token.ruler.renderFlags.set({ refreshState: true });
  }
});

Hooks.on("updateScene", (scene, data, options, userId) => {
  if (data.flags?.[MODULE_ID]?.[FLAG_NAME] !== undefined) {
    // If the hideRuler flag was changed, refresh tokens in the current scene if it's the active one
    if (scene.id === canvas.scene?.id) {
      const isHidden = scene.getFlag(MODULE_ID, FLAG_NAME) || false;
      if (isHidden) {
        console.log(`${MODULE_ID} | Hiding rulers for all tokens in scene "${scene.name}"`);
      } else {
        console.log(`${MODULE_ID} | Showing rulers for all tokens in scene "${scene.name}"`);
      }
      
      for (const token of canvas.tokens.placeables) {
        token.ruler.renderFlags.set({ refreshState: true });
      }
    }
  }
});