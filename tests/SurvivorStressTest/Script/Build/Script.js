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
        #animator;
        #direction = 0;
        #visualDeactivated = true;
        #size = "s";
        #texture;
        #textures;
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
        }
        init = async () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
            this.#animator = this.node.getComponent(ƒ.ComponentAnimator);
            this.#texture = this.node.getComponent(ƒ.ComponentMaterial).material.coat;
            this.#textures = {
                "s": await ƒ.Project.getResourcesByName("enemyTexture64"),
                "m": await ƒ.Project.getResourcesByName("enemyTexture256"),
                "l": await ƒ.Project.getResourcesByName("enemyTexture1024"),
            };
        };
        loop = () => {
            if (Script.EnemyManager.Instance.animate !== this.#animator.isActive) {
                this.#animator.activate(Script.EnemyManager.Instance.animate);
            }
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
            // console.log("recycle me");
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
    }
    Script.EnemyManager = EnemyManager;
})(Script || (Script = {}));
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
//# sourceMappingURL=Script.js.map