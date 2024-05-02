/// <reference path="Provider.ts"/>
/// <reference path="Managers/CharacterManager.ts"/>
/// <reference path="Managers/InputManager.ts"/>

namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  
  export const provider = new Provider();
  document.addEventListener("DOMContentLoaded", preStart);

  function preStart(){
    if(ƒ.Project.mode === ƒ.MODE.EDITOR) return;
    provider.add(InputManager)
    .add(CharacterManager);
    const inputManager = provider.get(InputManager);
    inputManager.setup(TouchMode.FREE);
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}