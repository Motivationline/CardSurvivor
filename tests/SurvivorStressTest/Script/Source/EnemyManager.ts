namespace Script {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class EnemyManager extends ƒ.Component {
    static Instance: EnemyManager;
    static Character: ƒ.Node;
    // Register the script as component for use in the editor via drag&drop
    // Properties may be mutated by users in the editor via the automatically created user interface
    public spawnRadius: number = 10;
    public maxEnemies: number = 100;
    public enemySpeed: number = 2;
    public currentEnemies: number = 0;
    public animate: boolean = false;
    public disableVisuals: boolean = false;
    public lockCamera: boolean = false;
    public noEnemyMovement: boolean = false;
    #enemies: EnemyGraphInstance[] = [];
    #enemiesScripts: Enemy[] = [];
    #enemy: ƒ.Graph;
    #cameraWasLocked: boolean = this.lockCamera;

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.loop.bind(this));
      ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded.bind(this));
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init.bind(this));

      EnemyManager.Instance = this;
    }

    private async loaded() {
      this.#enemy = <ƒ.Graph>await ƒ.Project.getResourcesByName("enemy")[0];
    }

    private init() {
      console.log("enemy manager")
      let ui: HTMLElement = document.getElementById("ui");
      let uiCharacterScript: HTMLElement = ƒui.Generator.createDetailsFromMutable(this);
      new ƒui.Controller(this, uiCharacterScript);
      ui.appendChild(uiCharacterScript);

    }

    private async loop() {
      if (this.#enemies.length < this.maxEnemies) {
        let newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
        if (!newEnemyGraphInstance.initialized) {
          await newEnemyGraphInstance.set(this.#enemy);
        }
        // newEnemyGraphInstance.set(this.enemy);
        // if(!newEnemyGraphInstance){
        //   let g = new ƒ.GraphInstance(this.#enemy);
        //   g.set(this.#enemy);
        //   newEnemy = (await ƒ.Project.createGraphInstance(this.#enemy))
        //   .getComponent(Enemy);
        //   ƒ.Recycler.get(ƒ.GraphInstance);
        // }
        newEnemyGraphInstance.mtxLocal.translation = EnemyManager.Character.mtxWorld.translation;
        newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), this.spawnRadius));
        this.node.addChild(newEnemyGraphInstance);
        this.#enemies.push(newEnemyGraphInstance);
        this.#enemiesScripts.push(newEnemyGraphInstance.getComponent(Enemy));

        this.currentEnemies = this.#enemies.length;
      }
      this.#enemiesScripts.forEach(e => { e.loop() });

      if (this.lockCamera !== this.#cameraWasLocked) {
        this.#cameraWasLocked = this.lockCamera;
        if (this.lockCamera) {
          viewport.camera = EnemyManager.Character.getChild(0).getComponent(ƒ.ComponentCamera);
        } else {
          viewport.camera = freeCam;
        }
      }
    }

    static setCharacter(_node: ƒ.Node) {
      this.Character = _node;
    }

    removeEnemy(_node: ƒ.Node) {
      let index = this.#enemies.findIndex((n) => n === _node);
      if (index >= 0) {
        let enemy = this.#enemies.splice(index, 1)[0];
        this.node.removeChild(_node);
        this.currentEnemies = this.#enemies.length;
        ƒ.Recycler.store(enemy);
      }

      let scr = _node.getComponent(Enemy);
      let index2 = this.#enemiesScripts.findIndex((n) => n === scr);
      this.#enemiesScripts.splice(index2, 1);
    }
  }

  export type TextureSize = "s" | "m" | "l";
}