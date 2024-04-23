namespace Script {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CharacterScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CharacterScript);
    // Properties may be mutated by users in the editor via the automatically created user interface

    public speed: number = 1;
    public maxDistance: number = 5;
    #movement: ƒ.Vector3 = new ƒ.Vector3(Math.random(), Math.random());
    #distance: number = 0;

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.loop.bind(this));
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, () => {
        this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, this.init.bind(this), true)
      });

    }

    init() {
      console.log("char script", this.node.name)
      let ui: HTMLElement = document.getElementById("ui");
      let uiCharacterScript: HTMLElement = ƒui.Generator.createDetailsFromMutable(this);
      new ƒui.Controller(this, uiCharacterScript);
      ui.appendChild(uiCharacterScript);

      EnemyManager.setCharacter(this.node);
    }

    loop() {
      let move = ƒ.Vector3.NORMALIZATION(this.#movement, this.speed * ƒ.Loop.timeFrameGame / 1000);
      this.node.cmpTransform.mtxLocal.translate(move);
      this.#distance += move.magnitude;
      if (this.#distance > this.maxDistance) {
        this.#distance = 0;
        this.#movement = new ƒ.Vector3(Math.random() - 0.5, Math.random() - 0.5);
      }
    }
  }
}