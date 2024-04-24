"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CharacterScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CharacterScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        speed = 1;
        maxDistance = 5;
        #movement = new ƒ.Vector3(Math.random(), Math.random());
        #distance = 0;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.loop.bind(this));
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, () => {
                this.node.addEventListener("graphInstantiated" /* ƒ.EVENT.GRAPH_INSTANTIATED */, this.init.bind(this), true);
            });
        }
        init() {
            console.log("char script", this.node.name);
            let ui = document.getElementById("ui");
            let uiCharacterScript = ƒui.Generator.createDetailsFromMutable(this);
            new ƒui.Controller(this, uiCharacterScript);
            ui.appendChild(uiCharacterScript);
            Script.EnemyManager.setCharacter(this.node);
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
    Script.CharacterScript = CharacterScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Enemy extends ƒ.Component {
        // #animator: ƒ.ComponentAnimator;
        #direction = 0;
        #visualDeactivated = true;
        // #centralAnimatorProvider: boolean = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            // ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded.bind(this));
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
            // this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, () => {
            //     this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, this.init.bind(this), true)
            // });
            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.loop);
            // ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.loop);
        }
        recycle() {
            //
            // if(this.#centralAnimatorProvider) {
            //     this.#animator.activate(true);
            // }
        }
        init = async () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
            // this.#animator = this.node.getComponent(ƒ.ComponentAnimator);
            // this.#texture = <ƒ.CoatTextured>this.node.getComponent(ƒ.ComponentMaterial).material.coat;
            this.setCentralAnimator();
            // this.#textures = {
            //     "s": <ƒ.TextureImage><unknown>await ƒ.Project.getResourcesByName("enemyTexture64"),
            //     "m": <ƒ.TextureImage><unknown>await ƒ.Project.getResourcesByName("enemyTexture256"),
            //     "l": <ƒ.TextureImage><unknown>await ƒ.Project.getResourcesByName("enemyTexture1024"),
            // }
        };
        loop = () => {
            if (this.#visualDeactivated !== Script.EnemyManager.Instance.disableVisuals) {
                this.#visualDeactivated = Script.EnemyManager.Instance.disableVisuals;
                this.node.getComponent(ƒ.ComponentMesh).activate(!this.#visualDeactivated);
            }
            if (Script.EnemyManager.Instance.noEnemyMovement)
                return;
            let diff = ƒ.Vector3.DIFFERENCE(Script.EnemyManager.Character.mtxWorld.translation, this.node.mtxLocal.translation);
            if (diff.magnitudeSquared < 1) {
                Script.EnemyManager.Instance.removeEnemy(this.node);
            }
            else {
                diff.normalize(Script.EnemyManager.Instance.enemySpeed * Math.min(ƒ.Loop.timeFrameGame / 1000, 1));
                this.node.mtxLocal.translate(diff, false);
                let dir = Math.sign(diff.x);
                if (dir !== this.#direction) {
                    this.#direction = dir;
                    if (this.#direction > 0) {
                        this.node.mtxLocal.rotation = new ƒ.Vector3();
                    }
                    else if (this.#direction < 0) {
                        this.node.mtxLocal.rotation = new ƒ.Vector3(0, 180, 0);
                    }
                }
            }
        };
        setCentralAnimator() {
            // this.#animator.activate(false);
            let mat = this.node.getComponent(ƒ.ComponentMaterial);
            // console.log(EnemyManager.Instance.centralAnimationMtx);
            // if (!EnemyManager.Instance.centralAnimationMtx) {
            //     EnemyManager.Instance.centralAnimationMtx = mat.mtxPivot;
            //     this.#animator.activate(true);
            //     this.#centralAnimatorProvider = true;
            // }
            mat.mtxPivot = Script.EnemyManager.Instance.getAnimMtx(24, 24);
            // this.#centralAnimator = true;
        }
    }
    Script.Enemy = Enemy;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class EnemyGraphInstance extends ƒ.GraphInstance {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        recycle() {
            this.getComponent(Script.Enemy).recycle();
        }
        async set(_graph) {
            await super.set(_graph);
            this.initialized = true;
        }
    }
    Script.EnemyGraphInstance = EnemyGraphInstance;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class EnemyManager extends ƒ.Component {
        static Instance;
        static Character;
        // Register the script as component for use in the editor via drag&drop
        // Properties may be mutated by users in the editor via the automatically created user interface
        spawnRadius = 10;
        maxEnemies = 100;
        enemySpeed = 2;
        currentEnemies = 0;
        animate = false;
        disableVisuals = false;
        lockCamera = false;
        noEnemyMovement = false;
        #centralAnimationAnimators = {};
        #enemies = [];
        #enemiesScripts = [];
        #enemy;
        #cameraWasLocked = this.lockCamera;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.loop.bind(this));
            ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, this.loaded.bind(this));
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init.bind(this));
            EnemyManager.Instance = this;
        }
        async loaded() {
            this.#enemy = await ƒ.Project.getResourcesByName("enemy")[0];
        }
        init() {
            console.log("enemy manager");
            let ui = document.getElementById("ui");
            let uiCharacterScript = ƒui.Generator.createDetailsFromMutable(this);
            new ƒui.Controller(this, uiCharacterScript);
            ui.appendChild(uiCharacterScript);
        }
        async loop() {
            if (this.animate)
                this.updateAnimationMtxs();
            if (this.#enemies.length < this.maxEnemies) {
                let newEnemyGraphInstance = ƒ.Recycler.get(Script.EnemyGraphInstance);
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
                this.#enemiesScripts.push(newEnemyGraphInstance.getComponent(Script.Enemy));
                this.currentEnemies = this.#enemies.length;
            }
            this.#enemiesScripts.forEach(e => { e.loop(); });
            if (this.lockCamera !== this.#cameraWasLocked) {
                this.#cameraWasLocked = this.lockCamera;
                if (this.lockCamera) {
                    Script.viewport.camera = EnemyManager.Character.getChild(0).getComponent(ƒ.ComponentCamera);
                }
                else {
                    Script.viewport.camera = Script.freeCam;
                }
            }
        }
        static setCharacter(_node) {
            this.Character = _node;
        }
        removeEnemy(_node) {
            let index = this.#enemies.findIndex((n) => n === _node);
            if (index >= 0) {
                let enemy = this.#enemies.splice(index, 1)[0];
                this.node.removeChild(_node);
                this.currentEnemies = this.#enemies.length;
                ƒ.Recycler.store(enemy);
            }
            let scr = _node.getComponent(Script.Enemy);
            let index2 = this.#enemiesScripts.findIndex((n) => n === scr);
            this.#enemiesScripts.splice(index2, 1);
        }
        getAnimMtx(_frames, _fps) {
            let type = `${_frames}_${_fps}`;
            if (!this.#centralAnimationAnimators[type]) {
                let gameTime = ƒ.Time.game.get();
                let animTime = Math.floor((_frames / _fps) * 1000);
                this.#centralAnimationAnimators[type] = [
                    new Script.SpriteAnimator(_frames, _fps, gameTime),
                    new Script.SpriteAnimator(_frames, _fps, gameTime + Math.floor((Math.random() * animTime))),
                    new Script.SpriteAnimator(_frames, _fps, gameTime + Math.floor((Math.random() * animTime))),
                    new Script.SpriteAnimator(_frames, _fps, gameTime + Math.floor((Math.random() * animTime))),
                ];
            }
            return this.#centralAnimationAnimators[type][Math.floor(Math.random() * this.#centralAnimationAnimators[type].length)].matrix;
        }
        updateAnimationMtxs() {
            let time = ƒ.Time.game.get();
            for (let type in this.#centralAnimationAnimators) {
                for (let sa of this.#centralAnimationAnimators[type]) {
                    sa.setTime(time);
                }
            }
        }
    }
    Script.EnemyManager = EnemyManager;
})(Script || (Script = {}));
/*namespace Script {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class FPSMonitor {
    public static instance = new FPSMonitor();
    private htmlElement: HTMLElement;
    private frames: number[] = [];

    constructor() {
      if (FPSMonitor.instance) return FPSMonitor.instance;

      FPSMonitor.instance = this;

      document.addEventListener("DOMContentLoaded", () => {
        this.htmlElement = document.createElement("p");
        this.htmlElement.innerText = "FPS";
        let ui: HTMLElement = document.getElementById("ui");
        ui.appendChild(this.htmlElement);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.frame);
      })

    }

    private frame = () => {
      let time = ƒ.Loop.timeFrameReal;
      this.frames.unshift(time);
      if (this.frames.length <= 100) return;
      this.frames.pop();
      let totalTimeFor100Frames = this.frames.reduce((prev, curr) => curr + prev, 0);
      let avgFrameTime = totalTimeFor100Frames / 100;
      let fps = 1000 / avgFrameTime;
      this.htmlElement.innerText = `FPS: ${fps.toPrecision(2)}`;
    }
  }
}*/ 
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail.vp;
        Script.freeCam = _event.detail.cam;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    /** Helper function to set up a (deep) proxy object that calls the onChange function __before__ the element is modified*/
    function onChange(object, onChange) {
        const handler = {
            get(target, property, receiver) {
                try {
                    return new Proxy(target[property], handler);
                }
                catch (err) {
                    return Reflect.get(target, property, receiver);
                }
            },
            defineProperty(target, property, descriptor) {
                onChange();
                return Reflect.defineProperty(target, property, descriptor);
            },
            deleteProperty(target, property) {
                onChange();
                return Reflect.deleteProperty(target, property);
            }
        };
        return new Proxy(object, handler);
    }
    Script.onChange = onChange;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class SpriteAnimator {
        mtx;
        startTime;
        frames;
        fps;
        totalTime;
        frameTime;
        frameWidth;
        constructor(_frames, _fps, _startTime, _mtx = new ƒ.Matrix3x3()) {
            this.mtx = _mtx;
            this.startTime = _startTime;
            this.frames = _frames;
            this.fps = _fps;
            this.totalTime = Math.floor((this.frames / this.fps) * 1000);
            this.frameTime = Math.floor((1 / this.fps) * 1000);
            this.frameWidth = 1 / this.frames;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, 1);
        }
        get matrix() {
            return this.mtx;
        }
        setTime(_time) {
            _time = (_time - this.startTime) % this.totalTime;
            let frame = Math.floor(_time / this.frameTime);
            this.mtx.translation = new ƒ.Vector2(frame * this.frameWidth);
        }
    }
    Script.SpriteAnimator = SpriteAnimator;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map