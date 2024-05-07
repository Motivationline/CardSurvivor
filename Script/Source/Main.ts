/// <reference path="Provider.ts"/>
/// <reference path="Managers/CharacterManager.ts"/>
/// <reference path="Managers/InputManager.ts"/>

namespace Script {
  export import ƒ = FudgeCore;
  export enum GAMESTATE {
    IDLE,
    PLAYING,
    PAUSED,
  }

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export const provider = new Provider();
  document.addEventListener("DOMContentLoaded", preStart);

  export let gameState: GAMESTATE = GAMESTATE.IDLE;

  async function preStart() {
    if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
    provider
      .add(Config)
      .add(InputManager)
      .add(CharacterManager)
      .add(EnemyManager)
      .add(AnimationManager)

    const config = provider.get(Config);
    await config.loadFiles();
    const inputManager = provider.get(InputManager);
    inputManager.setup(TouchMode.FREE);
    const enemyManager = provider.get(EnemyManager);
    enemyManager.setup();
  }

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    gameState = GAMESTATE.PLAYING;
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}