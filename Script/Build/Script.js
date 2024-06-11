"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Animateable extends ƒ.Component {
        material;
        currentlyActiveSprite;
        currentlyActiveEventListener;
        uniqueAnimationId;
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserialized);
        }
        deserialized = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserialized);
            this.material = this.node.getComponent(ƒ.ComponentMaterial);
        };
        getSprite(_sp) {
            if (!_sp)
                return undefined;
            if (("frames" in _sp)) {
                return _sp;
            }
            else {
                return Script.provider.get(Script.Config).getAnimation(_sp[0], _sp[1]);
            }
        }
        setCentralAnimator(_as, _unique = false, _eventListener) {
            if (!_as)
                return;
            let am = Script.provider.get(Script.AnimationManager);
            this.removeAnimationEventListeners();
            if (this.uniqueAnimationId) {
                am.removeUniqueAnimationMtx(this.uniqueAnimationId);
                this.uniqueAnimationId = undefined;
            }
            if (_unique) {
                [this.material.mtxPivot, this.uniqueAnimationId] = am.getUniqueAnimationMtx(_as);
            }
            else {
                this.material.mtxPivot = am.getAnimationMtx(_as);
            }
            if (_as.material)
                this.material.material = _as.material;
            this.currentlyActiveSprite = _as;
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events && _eventListener) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.addEventListener(event.event, _eventListener);
                }
                this.currentlyActiveEventListener = _eventListener;
            }
        }
        removeAnimationEventListeners() {
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events && this.currentlyActiveEventListener) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.removeEventListener(event.event, this.currentlyActiveEventListener);
                }
            }
        }
        update(_charPosition, _frameTimeInSeconds) { }
        ;
        removeAttachments() { }
        ;
    }
    Script.Animateable = Animateable;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    async function initI18n(..._languages) {
        let resources = {};
        for (let lang of _languages) {
            try {
                let resource = await (await fetch(`Assets/Text/${lang}.json`)).json();
                resources[lang] = { translation: resource };
            }
            catch (error) {
                console.error(`failed to load language ${lang} due to error:`, error);
            }
        }
        i18next.init({
            lng: "en",
            fallbackLng: "en",
            resources,
            debug: true,
        });
    }
    Script.initI18n = initI18n;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class InitializableGraphInstance extends ƒ.GraphInstance {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            // if (ƒ.Project.mode == ƒ.MODE.EDITOR)
            //     return;
        }
        recycle() {
            // this.getComponent(ProjectileComponent).recycle();
        }
        async set(_graph) {
            await super.set(_graph);
            this.initialized = true;
        }
    }
    Script.InitializableGraphInstance = InitializableGraphInstance;
    class ProjectileGraphInstance extends InitializableGraphInstance {
    }
    Script.ProjectileGraphInstance = ProjectileGraphInstance;
    class HitZoneGraphInstance extends InitializableGraphInstance {
    }
    Script.HitZoneGraphInstance = HitZoneGraphInstance;
    class EnemyGraphInstance extends InitializableGraphInstance {
        distanceToCharacter;
    }
    Script.EnemyGraphInstance = EnemyGraphInstance;
    class AOEGraphInstance extends InitializableGraphInstance {
    }
    Script.AOEGraphInstance = AOEGraphInstance;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Provider {
        items;
        constructor() {
            this.items = [];
        }
        add(type) {
            const information = this.getNewItemInformationOrThrow(type);
            information.itemConstructor = type;
            information.state = 1 /* ItemState.notInstantiated */;
            return this;
        }
        addInstance(type, instance) {
            const information = this.getNewItemInformationOrThrow(type);
            information.instance = instance;
            information.state = 3 /* ItemState.instantiated */;
            return this;
        }
        addFactory(type, factory) {
            const information = this.getNewItemInformationOrThrow(type);
            information.factory = factory;
            information.state = 1 /* ItemState.notInstantiated */;
            return this;
        }
        addSuper(type, constructor) {
            const information = this.getNewItemInformationOrThrow(type);
            information.itemConstructor = constructor;
            information.state = 1 /* ItemState.notInstantiated */;
            return this;
        }
        getRaw(type) {
            const information = this.getItemInformation(type);
            if (information.state === 0 /* ItemState.notAdded */) {
                throw new Error(`${information.type.name} hasn't been added and can't be provided.`);
            }
            if (information.state === 2 /* ItemState.instantiating */) {
                throw new Error(`${information.type.name} is in the middle of being instantiated. This propably means there is a dependency loop.`);
            }
            if (information.state === 1 /* ItemState.notInstantiated */) {
                this.instantiateItem(information);
            }
            if (!information.instance) {
                throw new Error(`Unable to get instance of ${information.type.name}.`);
            }
            return information.instance;
        }
        get(type) {
            const information = this.getItemInformation(type);
            if (information.proxy) {
                return information.proxy;
            }
            const provider = this;
            function getInstance() {
                if (information.instance) {
                    return information.instance;
                }
                return provider.getRaw(type);
            }
            const handler = {
                has(_, key) {
                    return key in getInstance();
                },
                get(_, key) {
                    return getInstance()[key];
                },
                set(_, key, value) {
                    getInstance()[key] = value;
                    return true;
                }
            };
            const proxy = new Proxy({}, handler);
            information.proxy = proxy;
            return proxy;
        }
        instantiateItem(information) {
            information.state = 2 /* ItemState.instantiating */;
            try {
                if (information.factory) {
                    const instance = information.factory(this);
                    information.instance = instance;
                }
                else if (information.itemConstructor) {
                    const instance = new information.itemConstructor(this);
                    information.instance = instance;
                }
                else {
                    throw new Error(`Unable to instatiate ${information.type.name}. Failed to find factory function or constructor.`);
                }
                information.state = 3 /* ItemState.instantiated */;
            }
            catch (error) {
                information.state = 1 /* ItemState.notInstantiated */;
                throw error;
            }
        }
        getNewItemInformationOrThrow(type) {
            const information = this.getItemInformation(type);
            if (information.state !== 0 /* ItemState.notAdded */) {
                throw new Error(`${type.name} has already been added to the provider.`);
            }
            return information;
        }
        getItemInformation(type) {
            const itemInformation = this.items.find(item => item.type === type);
            if (itemInformation) {
                return itemInformation;
            }
            const newInformation = {
                state: 0 /* ItemState.notAdded */,
                type: type,
            };
            this.items.push(newInformation);
            return newInformation;
        }
    }
    Script.Provider = Provider;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class CharacterManager {
        provider;
        movementVector = new ƒ.Vector2();
        #character;
        constructor(provider) {
            this.provider = provider;
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        get character() {
            return this.#character;
        }
        set character(_char) {
            this.#character = _char;
        }
        setMovement(_direction) {
            this.movementVector = _direction;
        }
        getMovement() {
            return this.movementVector;
        }
        update = () => {
            if (!this.#character)
                return;
            if (Script.gameState === Script.GAMESTATE.PAUSED)
                return;
            if (Script.gameState === Script.GAMESTATE.IDLE)
                return;
            this.#character.update(this.movementVector);
        };
        async upgradeCards(_amountOverride, _newCards = false, _rerolls = 0) {
            return new Promise((resolve) => {
                let rerollButton = document.getElementById("card-upgrade-popup-reroll");
                const reroll = async () => {
                    rerollButton.removeEventListener("click", reroll);
                    if (_rerolls > 0) {
                        await this.upgradeCards(_amountOverride, _newCards, _rerolls - 1);
                    }
                    resolve();
                };
                rerollButton.innerText = `Reroll (${_rerolls})`;
                if (_rerolls > 0) {
                    rerollButton.addEventListener("click", reroll);
                    rerollButton.classList.remove("hidden");
                }
                else {
                    rerollButton.classList.add("hidden");
                }
                let defaultCardsToChooseFromAmount = 3;
                let cm = Script.provider.get(Script.CardManager);
                let cardAmount = cm.modifyValuePlayer(defaultCardsToChooseFromAmount, Script.PassiveCardEffect.CARD_UPGRADE_SLOTS);
                if (_amountOverride)
                    cardAmount = _amountOverride;
                let cards = cm.getCardsToChooseFrom(cardAmount, _newCards);
                let elementsToShow = [];
                let parent = document.getElementById("card-upgrade-popup-wrapper");
                if (!cards || cards.length === 0) {
                    //TODO add other bonus, like health or something
                    let element = document.createElement("div");
                    element.classList.add("card");
                    elementsToShow.push(element);
                    element.addEventListener("click", () => {
                        Script.provider.get(Script.MenuManager).openMenu(Script.MenuType.NONE);
                        rerollButton.removeEventListener("click", reroll);
                        resolve();
                    });
                }
                else {
                    // we have cards we can upgrade / add
                    for (let card of cards) {
                        let cv = new Script.CardVisual(card, parent, card.id, card.level);
                        elementsToShow.push(cv.htmlElement);
                        cv.htmlElement.addEventListener("click", selectCard);
                        if (cm.activeCards.includes(card))
                            cv.htmlElement.classList.add("upgrade");
                        else
                            cv.htmlElement.classList.add("unlock");
                        function selectCard() {
                            cm.updateCardOrAdd(card.id);
                            Script.provider.get(Script.MenuManager).openMenu(Script.MenuType.NONE);
                            rerollButton.removeEventListener("click", reroll);
                            resolve();
                        }
                    }
                }
                parent.replaceChildren(...elementsToShow);
                Script.provider.get(Script.MenuManager).openMenu(Script.MenuType.CARD_UPGRADE);
            });
        }
    }
    Script.CharacterManager = CharacterManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let TouchMode;
    (function (TouchMode) {
        TouchMode[TouchMode["FREE"] = 0] = "FREE";
        TouchMode[TouchMode["LOCKED"] = 1] = "LOCKED";
    })(TouchMode = Script.TouchMode || (Script.TouchMode = {}));
    class InputManager {
        provider;
        touchEventDispatcher;
        touchCircle;
        touchCircleInner;
        curentlyActiveTouchId = 0;
        touchRadiusVW = 15;
        touchRadiusPx = (screen.width / 100) * this.touchRadiusVW;
        touchRadiusScale = 1 / this.touchRadiusPx;
        characterManager;
        #touchMode;
        #touchStart;
        constructor(provider) {
            this.provider = provider;
            this.characterManager = provider.get(Script.CharacterManager);
        }
        get touchMode() {
            return this.#touchMode;
        }
        set touchMode(_touchMode) {
            this.#touchMode = _touchMode;
            if (_touchMode === TouchMode.LOCKED) {
                this.touchCircle.classList.remove("hidden");
                this.touchCircle.classList.add("locked");
                this.touchCircle.style.top = this.touchCircle.style.left = "";
            }
            else if (_touchMode === TouchMode.FREE) {
                this.touchCircle.classList.add("hidden");
                this.touchCircle.classList.remove("locked");
            }
        }
        setup(_touchMode = TouchMode.FREE) {
            let touchOverlay = document.getElementById("swipe-game-overlay");
            this.touchEventDispatcher = new ƒ.TouchEventDispatcher(touchOverlay);
            // touchOverlay.addEventListener(ƒ.EVENT_TOUCH.TAP, <EventListener>hndTouchEvent);
            touchOverlay.addEventListener(ƒ.EVENT_TOUCH.MOVE, this.hndTouchEvent);
            touchOverlay.addEventListener("touchstart", this.hndTouchEvent);
            // touchOverlay.addEventListener("touchmove", <EventListener>hndTouchEvent);
            touchOverlay.addEventListener("touchend", this.hndTouchEvent);
            this.touchCircle = document.getElementById("touch-circle");
            this.touchCircleInner = document.getElementById("touch-circle-inner");
            this.touchMode = _touchMode;
            document.addEventListener("keydown", this.hndKeyboardInput);
            document.addEventListener("keyup", this.hndKeyboardInput);
            document.addEventListener("keypress", this.hndKeyboardInput);
        }
        hndTouchEvent = (_event) => {
            let touches = _event.changedTouches ?? _event.detail.touches;
            if (!touches)
                return;
            if (_event.type === "touchstart" && !this.curentlyActiveTouchId) {
                if (this.#touchMode === TouchMode.LOCKED) {
                    if (_event.target !== this.touchCircle)
                        return;
                    let bcr = this.touchCircle.getBoundingClientRect();
                    this.#touchStart = new ƒ.Vector2(bcr.left + bcr.width / 2, bcr.top + bcr.height / 2);
                }
                else {
                    this.touchCircle.style.left = `calc(${touches[0].clientX}px - 7.5vw)`;
                    this.touchCircleInner.style.left = "";
                    this.touchCircle.style.top = `calc(${touches[0].clientY}px - 7.5vw)`;
                    this.touchCircleInner.style.top = "";
                    this.touchCircle.classList.remove("hidden");
                }
                this.curentlyActiveTouchId = touches[0].identifier;
                return;
            }
            if (_event.type === "touchend" && this.curentlyActiveTouchId === touches[0].identifier) {
                this.curentlyActiveTouchId = 0;
                this.touchCircleInner.style.top = "";
                this.touchCircleInner.style.left = "";
                if (this.#touchMode === TouchMode.FREE) {
                    this.touchCircle.classList.add("hidden");
                }
                this.characterManager.setMovement(ƒ.Vector2.ZERO());
                return;
            }
            if (_event.type === ƒ.EVENT_TOUCH.MOVE && this.curentlyActiveTouchId === touches[0].identifier) {
                let offsetX = _event.detail.offset.x;
                let offsetY = _event.detail.offset.y;
                if (this.#touchMode === TouchMode.LOCKED) {
                    offsetX = _event.detail.position.x - this.#touchStart.x;
                    offsetY = _event.detail.position.y - this.#touchStart.y;
                }
                let direction = new ƒ.Vector2(offsetX, -offsetY);
                direction.scale(this.touchRadiusScale);
                if (direction.magnitudeSquared > 1) {
                    direction.normalize(1);
                }
                this.characterManager.setMovement(direction);
                this.touchCircleInner.style.top = `${-direction.y * this.touchRadiusVW / 2 + 2.5}vw`;
                this.touchCircleInner.style.left = `${direction.x * this.touchRadiusVW / 2 + 2.5}vw`;
            }
        };
        hndKeyboardInput = () => {
            let direction = new ƒ.Vector2();
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                direction.add(new ƒ.Vector2(-1, 0));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                direction.add(new ƒ.Vector2(1, 0));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
                direction.add(new ƒ.Vector2(0, -1));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
                direction.add(new ƒ.Vector2(0, 1));
            let mgtSqrt = direction.magnitudeSquared;
            if (mgtSqrt === 0) {
                this.characterManager.setMovement(direction);
                return;
            }
            if (mgtSqrt > 1) {
                direction.normalize(1);
            }
            this.characterManager.setMovement(direction);
        };
    }
    Script.InputManager = InputManager;
})(Script || (Script = {}));
/// <reference path="Provider.ts"/>
/// <reference path="Managers/CharacterManager.ts"/>
/// <reference path="Managers/InputManager.ts"/>
var Script;
/// <reference path="Provider.ts"/>
/// <reference path="Managers/CharacterManager.ts"/>
/// <reference path="Managers/InputManager.ts"/>
(function (Script) {
    Script.ƒ = FudgeCore;
    let GAMESTATE;
    (function (GAMESTATE) {
        GAMESTATE[GAMESTATE["IDLE"] = 0] = "IDLE";
        GAMESTATE[GAMESTATE["PLAYING"] = 1] = "PLAYING";
        GAMESTATE[GAMESTATE["PAUSED"] = 2] = "PAUSED";
        GAMESTATE[GAMESTATE["ROOM_CLEAR"] = 3] = "ROOM_CLEAR";
    })(GAMESTATE = Script.GAMESTATE || (Script.GAMESTATE = {}));
    document.addEventListener("interactiveViewportStarted", start);
    Script.provider = new Script.Provider();
    document.addEventListener("DOMContentLoaded", preStart);
    Script.gameState = GAMESTATE.IDLE;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    async function preStart() {
        if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
            return;
        document.documentElement.addEventListener("click", startViewport);
        await Script.initI18n("en");
        Script.provider
            .add(Script.Config)
            .add(Script.InputManager)
            .add(Script.CharacterManager)
            .add(Script.ProjectileManager)
            .add(Script.EnemyManager)
            .add(Script.AnimationManager)
            .add(Script.CardManager)
            .add(Script.DataManager)
            .add(Script.CardCollection)
            .add(Script.MenuManager);
        const dataManager = Script.provider.get(Script.DataManager);
        await dataManager.load();
        const config = Script.provider.get(Script.Config);
        await config.loadFiles();
        const inputManager = Script.provider.get(Script.InputManager);
        inputManager.setup(Script.TouchMode.FREE);
        const enemyManager = Script.provider.get(Script.EnemyManager);
        enemyManager.setup();
        const projectileManager = Script.provider.get(Script.ProjectileManager);
        projectileManager.setup();
        const cardManager = Script.provider.get(Script.CardManager);
        cardManager.updateEffects();
        const cardCollector = Script.provider.get(Script.CardCollection);
        cardCollector.setup();
        const menuManager = Script.provider.get(Script.MenuManager);
        menuManager.setup();
    }
    function start(_event) {
        Script.viewport = _event.detail;
        // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        // ƒ.Time.game.setScale(0.1);
        Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        Script.ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        // gameState = GAMESTATE.IDLE;
    }
    async function startViewport() {
        document.documentElement.removeEventListener("click", startViewport);
        if (isMobile)
            document.documentElement.requestFullscreen();
        await Script.ƒ.Project.loadResourcesFromHTML();
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        let graph = Script.ƒ.Project.resources[graphId];
        let canvas = document.querySelector("canvas");
        let viewport = new Script.ƒ.Viewport();
        let camera = findFirstCameraInGraph(graph);
        viewport.initialize("GameViewport", graph, camera, canvas);
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
        //TODO: init/add audio listener?
    }
    function findFirstCameraInGraph(_graph) {
        let cam = _graph.getComponent(Script.ƒ.ComponentCamera);
        if (cam)
            return cam;
        for (let child of _graph.getChildren()) {
            cam = findFirstCameraInGraph(child);
            if (cam)
                return cam;
        }
        return undefined;
    }
    function update(_event) {
        Script.ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        // ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class SpriteAnimator {
        mtx;
        sprite;
        startTime;
        totalTime;
        frameTime;
        frameWidth;
        frameHeight;
        prevFrame = -1;
        constructor(_as, _startTime = ƒ.Time.game.get(), _mtx = new ƒ.Matrix3x3()) {
            this.mtx = _mtx;
            this.reset(_as, _startTime);
        }
        get matrix() {
            return this.mtx;
        }
        setTime(_time = ƒ.Time.game.get()) {
            _time = (_time - this.startTime) % this.totalTime;
            let frame = Math.floor(_time / this.frameTime);
            if (frame === this.prevFrame)
                return;
            this.fireEvents(this.prevFrame, frame);
            this.prevFrame = frame;
            let column = frame % this.sprite.wrapAfter;
            let row = Math.floor(frame / this.sprite.wrapAfter);
            // console.log(frame, column, row);
            this.mtx.translation = new ƒ.Vector2(column * this.frameWidth, row * this.frameHeight);
        }
        reset(_as, _time = ƒ.Time.game.get()) {
            this.sprite = _as;
            this.startTime = _time;
            this.totalTime = (_as.frames / _as.fps) * 1000;
            this.frameTime = (1 / _as.fps) * 1000;
            this.frameWidth = _as.width / _as.totalWidth;
            this.frameHeight = _as.height / _as.totalHeight;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, this.frameHeight);
        }
        fireEvents(_prevFrame, _currentFrame) {
            if (!this.sprite.events || !this.sprite.events.length)
                return;
            if (_prevFrame < 0 || _currentFrame < 0 || _prevFrame > this.sprite.frames || _currentFrame > this.sprite.frames)
                return;
            if (_currentFrame < _prevFrame)
                _currentFrame += this.sprite.frames;
            for (let frame = _prevFrame + 1; frame <= _currentFrame; frame++) {
                for (let event of this.sprite.events) {
                    if (event.frame === frame % this.sprite.frames) {
                        this.matrix.dispatchEvent(new CustomEvent(event.event, { detail: { frame, sprite: this.sprite }, bubbles: true }));
                    }
                }
            }
        }
    }
    Script.SpriteAnimator = SpriteAnimator;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let PassiveCardEffect;
    (function (PassiveCardEffect) {
        PassiveCardEffect["COOLDOWN_REDUCTION"] = "cooldownReduction";
        PassiveCardEffect["PROJECTILE_SIZE"] = "projectileSize";
        PassiveCardEffect["PROJECTILE_SPEED"] = "projectileSpeed";
        PassiveCardEffect["PROJECTILE_AMOUNT"] = "projectileAmount";
        PassiveCardEffect["PROJECTILE_RANGE"] = "projectileRange";
        PassiveCardEffect["PROJECTILE_PIERCING"] = "projectilePiercing";
        PassiveCardEffect["DAMAGE"] = "damage";
        PassiveCardEffect["EFFECT_DURATION"] = "effectDuration";
        PassiveCardEffect["WEAPON_DURATION"] = "weaponDuration";
        PassiveCardEffect["KNOCKBACK"] = "knockback";
        PassiveCardEffect["CRIT_CHANCE"] = "criticalHitChance";
        PassiveCardEffect["CRIT_DAMAGE"] = "critialHitDamage";
        PassiveCardEffect["HEALTH"] = "health";
        PassiveCardEffect["REGENERATION"] = "regeneration";
        PassiveCardEffect["COLLECTION_RADIUS"] = "collectionRadius";
        PassiveCardEffect["DAMAGE_REDUCTION"] = "damageReduction";
        PassiveCardEffect["CARD_SLOTS"] = "cardSlots";
        PassiveCardEffect["CARD_UPGRADE_SLOTS"] = "cardUpgradeSlots";
        PassiveCardEffect["MOVEMENT_SPEED"] = "movementSpeed";
    })(PassiveCardEffect = Script.PassiveCardEffect || (Script.PassiveCardEffect = {}));
    let CardRarity;
    (function (CardRarity) {
        CardRarity["COMMON"] = "common";
        CardRarity["UNCOMMON"] = "uncommon";
        CardRarity["RARE"] = "rare";
        CardRarity["EPIC"] = "epic";
        CardRarity["LEGENDARY"] = "legendary";
    })(CardRarity = Script.CardRarity || (Script.CardRarity = {}));
    let ProjectileTargetMode;
    (function (ProjectileTargetMode) {
        ProjectileTargetMode[ProjectileTargetMode["NONE"] = 0] = "NONE";
        ProjectileTargetMode[ProjectileTargetMode["CLOSEST"] = 1] = "CLOSEST";
        ProjectileTargetMode[ProjectileTargetMode["FURTHEST"] = 2] = "FURTHEST";
        ProjectileTargetMode[ProjectileTargetMode["STRONGEST"] = 3] = "STRONGEST";
        ProjectileTargetMode[ProjectileTargetMode["RANDOM"] = 4] = "RANDOM";
    })(ProjectileTargetMode = Script.ProjectileTargetMode || (Script.ProjectileTargetMode = {}));
    let ProjectileTarget;
    (function (ProjectileTarget) {
        ProjectileTarget[ProjectileTarget["PLAYER"] = 0] = "PLAYER";
        ProjectileTarget[ProjectileTarget["ENEMY"] = 1] = "ENEMY";
    })(ProjectileTarget = Script.ProjectileTarget || (Script.ProjectileTarget = {}));
    //#endregion
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class AOE extends Script.Animateable {
        duration;
        events;
        targetMode;
        size;
        damage;
        sprite;
        stunDuration;
        variant;
        target;
        rigidbody;
        defaults = {
            size: 1,
            damage: 0,
            sprite: ["aoe", "explosion"],
            duration: 1,
            variant: "explosion",
            target: Script.ProjectileTarget.ENEMY,
            stunDuration: 0,
        };
        setup(_options, _modifier) {
            let cm = Script.provider.get(Script.CardManager);
            _options = { ...this.defaults, ..._options };
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.PROJECTILE_SIZE, _modifier);
            this.damage = cm.modifyValue(_options.damage, Script.PassiveCardEffect.DAMAGE, _modifier);
            this.variant = _options.variant;
            this.stunDuration = cm.modifyValue(_options.stunDuration, Script.PassiveCardEffect.EFFECT_DURATION, _modifier);
            this.duration = this.variant === "explosion" ? _options.duration : cm.modifyValue(_options.duration, Script.PassiveCardEffect.EFFECT_DURATION, _modifier);
            this.targetMode = _options.targetMode;
            this.target = _options.target;
            this.events = _options.events;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite, true, this.eventListener);
            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            setTimeout(() => {
                this.removeAnimationEventListeners();
                Script.provider.get(Script.ProjectileManager).removeAOE(this);
            }, this.duration * 1000);
        }
        // should be called through a timing listener
        explode() {
            if (this.variant !== "explosion")
                return;
            for (let collision of this.rigidbody.collisions) {
                if (this.target === Script.ProjectileTarget.ENEMY && collision.node.name === "enemy") {
                    collision.node.getComponent(Script.Enemy).hit({ damage: this.damage, stun: this.stunDuration });
                }
                else if (this.target === Script.ProjectileTarget.PLAYER && collision.node.name === "character") {
                    let char = Script.provider.get(Script.CharacterManager).character;
                    char.hit({ damage: this.damage });
                }
            }
        }
        update(_charPosition, _frameTimeInSeconds) {
            if (this.variant !== "aoe")
                return;
        }
        eventListener = (_event) => {
            if (!this.events)
                return;
            if (!this.events[_event.type])
                return;
            this.events[_event.type].call(this, _event);
        };
    }
    Script.AOE = AOE;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
/// <reference path="../Animateable.ts" />
var Script;
/// <reference path="../Types.ts" />
/// <reference path="../Animateable.ts" />
(function (Script) {
    class ProjectileComponent extends Script.Animateable {
        tracking;
        direction;
        targetPosition;
        damage;
        size;
        speed;
        range;
        piercing;
        target;
        diminishing;
        artillery;
        rotateInDirection;
        impact;
        targetMode;
        lockedToEntity;
        sprite;
        stunDuration;
        hazardZone;
        prevDistance;
        modifiers = {};
        functions = {};
        static defaults = {
            targetPosition: undefined,
            direction: new Script.ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 0.5,
            speed: 2,
            damage: 1,
            stunDuration: 0,
            target: Script.ProjectileTarget.ENEMY,
            tracking: undefined,
            diminishing: false,
            targetMode: Script.ProjectileTargetMode.NONE,
            lockedToEntity: false,
            impact: undefined,
            artillery: false,
            rotateInDirection: false,
            sprite: ["projectile", "toast"],
            methods: {}
        };
        constructor() {
            super();
            if (Script.ƒ.Project.mode == Script.ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
        }
        init = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
            // setup physics
            this.node.getComponent(Script.ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_ENTER */, this.onTriggerEnter);
            this.node.getComponent(Script.ƒ.ComponentRigidbody).addEventListener("TriggerLeftCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_EXIT */, this.onTriggerExit);
        };
        async setup(_options, _modifier) {
            let cm = Script.provider.get(Script.CardManager);
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = cm.modifyValue(_options.damage, Script.PassiveCardEffect.DAMAGE, _modifier);
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.PROJECTILE_SIZE, _modifier);
            this.speed = cm.modifyValue(_options.speed, Script.PassiveCardEffect.PROJECTILE_SPEED, _modifier);
            this.range = cm.modifyValue(_options.range, Script.PassiveCardEffect.PROJECTILE_RANGE, _modifier);
            this.piercing = cm.modifyValue(_options.piercing, Script.PassiveCardEffect.PROJECTILE_PIERCING, _modifier);
            this.target = _options.target;
            this.artillery = _options.artillery;
            this.rotateInDirection = _options.rotateInDirection;
            this.diminishing = _options.diminishing;
            this.impact = _options.impact;
            this.targetMode = _options.targetMode;
            this.lockedToEntity = _options.lockedToEntity;
            this.functions = _options.methods;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite);
            this.node.mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.size);
            this.hazardZone = undefined;
            this.prevDistance = Infinity;
            this.modifiers = _modifier;
            //TODO rotate projectile towards flight direction
            if (this.artillery) {
                let pos = new Script.ƒ.Vector3();
                if (this.target === Script.ProjectileTarget.PLAYER) {
                    pos = await Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation.clone;
                }
                else if (this.target === Script.ProjectileTarget.ENEMY) {
                    pos = Script.provider.get(Script.EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                    if (!pos)
                        return this.remove();
                }
                let hz = await Script.provider.get(Script.ProjectileManager).createHitZone(pos);
                this.tracking = {
                    strength: 1,
                    target: hz,
                    startTrackingAfter: 1
                };
                this.hazardZone = hz;
                this.direction = Script.ƒ.Vector3.Y(this.speed);
                this.targetPosition = pos;
            }
            if (this.targetMode !== Script.ProjectileTargetMode.NONE) {
                let targetPosition = Script.provider.get(Script.EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                if (!targetPosition) {
                    return this.remove();
                }
                ;
                this.direction = Script.ƒ.Vector3.DIFFERENCE(targetPosition, this.node.mtxLocal.translation);
            }
            if (this.tracking) {
                this.tracking = { ...{ stopTrackingAfter: Infinity, stopTrackingInRadius: 0, strength: 1, startTrackingAfter: 0 }, ...this.tracking };
            }
            if (this.functions.afterSetup) {
                this.functions.afterSetup.call(this);
            }
        }
        update(_charPosition, _frameTimeInSeconds) {
            if (this.functions.preUpdate)
                this.functions.preUpdate.call(this, _charPosition, _frameTimeInSeconds);
            if (this.functions.preMove)
                this.functions.preMove.call(this, _frameTimeInSeconds);
            this.move(_frameTimeInSeconds);
            if (this.functions.postMove)
                this.functions.postMove.call(this, _frameTimeInSeconds);
            this.rotate();
            if (this.functions.postUpdate)
                this.functions.postUpdate.call(this, _charPosition, _frameTimeInSeconds);
        }
        removeAttachments() {
            this.removeHazardZone();
        }
        removeHazardZone() {
            if (!this.hazardZone)
                return;
            Script.ƒ.Recycler.store(this.hazardZone);
            this.hazardZone.getParent().removeChild(this.hazardZone);
            this.hazardZone = undefined;
        }
        move(_frameTimeInSeconds) {
            if (this.tracking && this.tracking.target) {
                this.tracking.startTrackingAfter -= _frameTimeInSeconds;
                if (this.tracking.startTrackingAfter <= 0) {
                    this.tracking.stopTrackingAfter -= _frameTimeInSeconds;
                    let diff = Script.ƒ.Vector3.DIFFERENCE(this.tracking.target.mtxWorld.translation, this.node.mtxWorld.translation);
                    // we need to track a certain node, so modify direction accordingly
                    this.direction = Script.ƒ.Vector3.SUM(diff.scale(this.tracking.strength ?? 1), this.direction.scale(1 - (this.tracking.strength ?? 1)));
                    // this.direction.add(ƒ.Vector3.SCALE(diff, (this.tracking.strength ?? 1) * Math.min(_frameTimeInSeconds, 1)));
                    let mgtSqrd = diff.magnitudeSquared;
                    if (this.tracking.stopTrackingAfter <= 0 || (mgtSqrd <= Math.pow(this.tracking.stopTrackingInRadius, 2) && mgtSqrd !== 0)) {
                        // console.log("stop tracking", this.tracking.stopTrackingAfter)
                        // end of tracking
                        this.tracking = undefined;
                    }
                }
            }
            let dir = this.direction.clone;
            if (dir.magnitudeSquared > 0)
                dir.normalize(Math.min(1, _frameTimeInSeconds) * this.speed);
            this.node.mtxLocal.translate(dir);
            //TODO check if flew past target position (due to lag?) and still explode
            if (this.targetPosition) {
                let distanceToTarget = Script.ƒ.Vector3.DIFFERENCE(this.targetPosition, this.node.mtxWorld.translation).magnitudeSquared;
                if (this.targetPosition && (this.node.mtxWorld.translation.equals(this.targetPosition, 0.5) || distanceToTarget > this.prevDistance)) {
                    this.prevDistance = distanceToTarget;
                    if (this.artillery && this.tracking.startTrackingAfter > 0)
                        return;
                    // target position reached
                    this.removeHazardZone();
                    if (this.impact && this.impact.length) {
                        for (let impact of this.impact) {
                            //TODO implement impacts
                            switch (impact.type) {
                                case "projectile":
                                    Script.provider.get(Script.ProjectileManager).createProjectile(Script.projectiles[impact.projectile], this.targetPosition, Script.provider.get(Script.CardManager).combineEffects(impact.modifiers, this.modifiers));
                                    break;
                                case "aoe":
                                    Script.provider.get(Script.ProjectileManager).createAOE(Script.areasOfEffect[impact.aoe], this.targetPosition, Script.provider.get(Script.CardManager).combineEffects(impact.modifiers, this.modifiers));
                                    break;
                            }
                        }
                    }
                    this.remove();
                }
            }
            // remove projectile if outside of room
            if (this.node.cmpTransform.mtxLocal.translation.magnitudeSquared > 850 /* 15 width, 25 height playarea => max magnSqr = 850 */) {
                this.remove();
            }
        }
        rotate() {
            if (!this.rotateInDirection)
                return;
            let refVector = Script.ƒ.Vector3.X(1);
            let angle = Math.acos(Script.ƒ.Vector3.DOT(this.direction, refVector) / (refVector.magnitude * this.direction.magnitude));
            angle = angle * 180 / Math.PI;
            let pivot = this.node.getComponent(Script.ƒ.ComponentMesh).mtxPivot;
            pivot.rotation = new Script.ƒ.Vector3(pivot.rotation.x, pivot.rotation.y, angle);
        }
        onTriggerEnter = (_event) => {
            if (this.artillery || this.targetPosition)
                return;
            if (_event.cmpRigidbody.node.name === "enemy" && this.target === Script.ProjectileTarget.ENEMY) {
                this.hit(_event.cmpRigidbody.node.getComponent(Script.Enemy));
            }
            else if (_event.cmpRigidbody.node.name === "character" && this.target === Script.ProjectileTarget.PLAYER) {
                this.hit(_event.cmpRigidbody.node.getComponent(Script.Character));
            }
        };
        onTriggerExit = (_event) => {
            // console.log("onTriggerExit", _event);
        };
        hit(_hitable) {
            if (this.functions.preHit)
                this.functions.preHit.call(this, _hitable);
            _hitable.hit({ damage: this.damage, stun: this.stunDuration });
            this.piercing--;
            if (this.functions.postHit)
                this.functions.postHit.call(this, _hitable);
            if (this.piercing < 0)
                this.remove();
        }
        remove() {
            Script.provider.get(Script.ProjectileManager).removeProjectile(this);
        }
    }
    Script.ProjectileComponent = ProjectileComponent;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.projectiles = {
        "toastEnemy": {
            damage: 1,
            speed: 20,
            artillery: true,
            impact: [{
                    type: "aoe",
                    aoe: "toastImpact"
                }],
            sprite: ["projectile", "toast"],
            target: Script.ProjectileTarget.PLAYER,
        },
        "anvilPlayer": {
            damage: 0,
            speed: 20,
            impact: [{
                    type: "aoe",
                    aoe: "anvilImpact"
                }],
            sprite: ["projectile", "anvil"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.RANDOM,
            methods: {
                afterSetup: function () {
                    this.targetPosition = Script.provider.get(Script.EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                    if (this.targetPosition) {
                        let target = this.targetPosition.clone;
                        this.node.mtxLocal.translation = target;
                        this.node.mtxLocal.translate(Script.ƒ.Vector3.Y(10));
                        this.direction = Script.ƒ.Vector3.Y(-1);
                    }
                }
            }
        },
        "hammerPlayer": {
            damage: 8,
            speed: 7,
            size: 0.6,
            sprite: ["projectile", "hammer"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.NONE,
            methods: {
                afterSetup: function () {
                    this.direction = new Script.ƒ.Vector3(0.5 - Math.random() * 1, 1, 0);
                },
                preMove: function (_fts) {
                    this.direction.y = Math.max(-1, this.direction.y - (_fts * (10 / this.speed)));
                }
            }
        },
        "discusPlayer": {
            damage: 5,
            speed: 20,
            sprite: ["projectile", "discus"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.NONE,
            methods: {
                afterSetup: function () {
                    let enemy = Script.provider.get(Script.EnemyManager).getEnemy(Script.ProjectileTargetMode.CLOSEST);
                    this.tracking = {
                        stopTrackingAfter: Infinity,
                        startTrackingAfter: 0,
                        stopTrackingInRadius: 0,
                        strength: 1,
                        target: enemy,
                    };
                },
                preUpdate: function () {
                    let target = this.tracking.target;
                    if (!target?.getParent()) {
                        let newEnemy = Script.provider.get(Script.EnemyManager).getEnemy(Script.ProjectileTargetMode.CLOSEST, this.node.mtxWorld.translation);
                        this.tracking.target = newEnemy;
                    }
                },
                postHit: function (_hitable) {
                    let newEnemy = Script.provider.get(Script.EnemyManager).getEnemy(Script.ProjectileTargetMode.CLOSEST, _hitable.node.mtxWorld.translation, [_hitable.node]);
                    this.tracking.target = newEnemy;
                },
            }
        },
        "penPlayer": {
            damage: 2,
            speed: 20,
            sprite: ["projectile", "pen"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "codeCivilPlayer": {
            damage: 3,
            speed: 20,
            sprite: ["projectile", "codecivil"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.FURTHEST,
            methods: {
                afterSetup: function () {
                    this.minDamage = this.damage;
                    this.maxDamage = this.damage * 10;
                    this.totalDistance = 0;
                },
                postMove: function (_frameTimeInSeconds) {
                    this.totalDistance += this.speed * _frameTimeInSeconds;
                    this.damage = Math.min(this.maxDamage, this.minDamage * (Math.max(1, this.totalDistance)));
                }
            }
        },
        "dividerPlayer": {
            damage: 5,
            speed: 10,
            sprite: ["projectile", "divider"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.CLOSEST,
            methods: {
                afterSetup: function () {
                    this.tracking = {
                        target: Script.provider.get(Script.CharacterManager).character.node,
                        startTrackingAfter: 0.5,
                        stopTrackingAfter: 0.5,
                        strength: 0.1,
                    };
                },
            }
        },
        "chiselPlayer": {
            damage: 15,
            speed: 15,
            sprite: ["projectile", "chisel"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "needlePlayer": {
            damage: 5,
            speed: 0,
            sprite: ["aoe", "needles"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.NONE,
        }
    };
    Script.areasOfEffect = {
        "toastImpact": {
            variant: "explosion",
            damage: 10,
            size: 1,
            sprite: ["aoe", "explosion"],
            duration: 1,
            target: Script.ProjectileTarget.PLAYER,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "anvilImpact": {
            variant: "explosion",
            damage: 10,
            size: 1.5,
            sprite: ["aoe", "explosion"],
            duration: 1,
            target: Script.ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "lightbulbPlayer": {
            variant: "explosion",
            damage: 5,
            size: 2,
            duration: 16 / 24,
            sprite: ["aoe", "lightbulb"],
            stunDuration: 1,
            target: Script.ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "smokeMaskPlayer": {
            variant: "explosion",
            damage: 2,
            size: 2,
            duration: 30 / 24,
            sprite: ["aoe", "smokemask"],
            target: Script.ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        }
    };
})(Script || (Script = {}));
/// <reference path="../Attacks/Projectiles.ts" />
var Script;
/// <reference path="../Attacks/Projectiles.ts" />
(function (Script) {
    class Card {
        name;
        description;
        image;
        rarity;
        levels;
        id;
        #level;
        #cm;
        #pm;
        #charm;
        constructor(_init, _id, _level = 0) {
            this.name = _init.name ?? `card.${_id}.name`;
            this.description = _init.description ?? `card.${_id}.description`;
            this.image = _init.image;
            this.rarity = _init.rarity;
            this.levels = _init.levels;
            this.level = _level;
            this.id = _id;
            this.#cm = Script.provider.get(Script.CardManager);
            this.#pm = Script.provider.get(Script.ProjectileManager);
            this.#charm = Script.provider.get(Script.CharacterManager);
        }
        get level() {
            return this.#level;
        }
        set level(_level) {
            this.#level = Math.max(0, Math.min(this.levels.length, _level));
        }
        get effects() {
            return structuredClone(this.levels[this.level].passiveEffects);
        }
        update(_time, _cumulatedEffects) {
            if (!this.levels[this.level].activeEffects || !this.levels[this.level].activeEffects.length)
                return;
            for (let effect of this.levels[this.level].activeEffects) {
                if (isNaN(effect.currentCooldown))
                    effect.currentCooldown = effect.cooldown;
                if (effect.cooldownBasedOnDistance) {
                    effect.currentCooldown -= this.#charm.getMovement().magnitude * this.#charm.character.speed * _time;
                }
                else {
                    effect.currentCooldown -= _time;
                }
                if (effect.currentCooldown <= 0) {
                    effect.currentCooldown = this.#cm.modifyValuePlayer(effect.cooldown, Script.PassiveCardEffect.COOLDOWN_REDUCTION, effect.modifiers);
                    switch (effect.type) {
                        case "projectile":
                            for (let i = 0; i < (effect.amount ?? 1); i++) {
                                setTimeout(() => {
                                    let pos = this.#charm.character.node.mtxWorld.translation.clone;
                                    if (effect.offset) {
                                        if (typeof effect.offset === "string") {
                                            pos.add(eval(effect.offset));
                                        }
                                        else {
                                            pos.add(effect.offset);
                                        }
                                    }
                                    let projectile = Script.projectiles[effect.projectile];
                                    this.#pm.createProjectile(projectile, pos, this.#cm.combineEffects(_cumulatedEffects, effect.modifiers), projectile.lockedToEntity ? this.#charm.character.node : undefined);
                                }, i * (effect.delay ?? 0.1) * 1000);
                            }
                            break;
                        case "aoe":
                            let pos = this.#charm.character.node.mtxWorld.translation.clone;
                            let aoe = Script.areasOfEffect[effect.aoe];
                            this.#pm.createAOE(aoe, pos, this.#cm.combineEffects(_cumulatedEffects, effect.modifiers));
                            break;
                    }
                }
            }
        }
    }
    Script.Card = Card;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CardCollection {
        collection;
        deck;
        // private selection: string[];
        maxDeckSize = 20;
        maxSelectedSize = 0;
        deckElement;
        // private selectionElement: HTMLElement;
        collectionElement;
        popupElement;
        popupButtons;
        deckSelectionSizeElement;
        selectedCard;
        cardVisuals = new Map();
        constructor(provider) {
            let dm = provider.get(Script.DataManager);
            this.collection = dm.savedCollectionRaw;
            this.deck = dm.savedDeckRaw;
            // this.selection = dm.savedSelectionRaw;
        }
        setup() {
            // this.selectionElement = document.getElementById("selection");
            this.deckElement = document.getElementById("deck");
            this.collectionElement = document.getElementById("collection-wrapper");
            this.popupElement = document.getElementById("card-popup");
            this.deckSelectionSizeElement = document.getElementById("deck-selection-size");
            this.popupButtons = {
                deckFrom: document.getElementById("card-popup-deck-from"),
                // deckToFrom: <HTMLButtonElement>document.getElementById("card-popup-deck-to-from"),
                deckTo: document.getElementById("card-popup-deck-to"),
                // selectionFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-from"),
                // selectionToFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-to-from"),
                // selectionTo: <HTMLButtonElement>document.getElementById("card-popup-selection-to"),
            };
            this.installListeners();
            for (let cardID in Script.cards) {
                let card = Script.cards[cardID];
                let visual = new Script.CardVisual(card, this.collectionElement, cardID);
                this.cardVisuals.set(cardID, visual);
                visual.htmlElement.addEventListener("click", this.openPopup);
                visual.htmlElement.dataset.card = cardID;
            }
            this.updateVisuals(true);
        }
        openPopup = (_event) => {
            let cardID = _event.currentTarget.dataset.card;
            if (!cardID)
                return;
            // TODO change this to not create a popup
            // if (!this.collection[cardID]) return;
            if (!this.collection[cardID]) {
                this.addCardToCollection(cardID, 1);
                return;
            }
            let visual = this.cardVisuals.get(cardID);
            if (!visual)
                return;
            this.popupElement.classList.remove("hidden");
            let cardElement = visual.htmlElement.cloneNode(true);
            cardElement.classList.remove("locked", "selected");
            this.popupElement.querySelector("#card-popup-card").replaceChildren(cardElement);
            this.selectedCard = cardID;
            // hide/show correct buttons
            for (let button in this.popupButtons) {
                //@ts-ignore
                this.popupButtons[button].classList.add("hidden");
                //@ts-ignore
                this.popupButtons[button].classList.remove("disabled");
            }
            if (this.collection[cardID]) {
                // card is in selection, so it's selectable
                // if (this.selection.includes(cardID)) {
                // this.popupButtons.deckToFrom.classList.remove("hidden");
                // this.popupButtons.selectionFrom.classList.remove("hidden");
                // }
                if (this.deck.includes(cardID)) {
                    this.popupButtons.deckFrom.classList.remove("hidden");
                    // this.popupButtons.selectionToFrom.classList.remove("hidden");
                }
                else {
                    this.popupButtons.deckTo.classList.remove("hidden");
                    // this.popupButtons.selectionTo.classList.remove("hidden");
                }
                if (this.deck.length >= this.maxDeckSize) {
                    this.popupButtons.deckTo.classList.add("disabled");
                    // this.popupButtons.deckToFrom.classList.add("disabled");
                }
                // if (this.selection.length >= this.maxSelectedSize) {
                //     this.popupButtons.selectionTo.classList.add("disabled");
                //     this.popupButtons.selectionToFrom.classList.add("disabled");
                // }
            }
        };
        addCardToCollection(_name, _amount) {
            if (!this.collection[_name]) {
                this.collection[_name] = { amount: 0, lvl: 0 };
            }
            this.collection[_name].amount += _amount;
            this.updateVisuals(true);
        }
        getCardLevel(_name) {
            return this.collection[_name]?.lvl ?? 0;
        }
        addCardToDeck(_name) {
            this.addToArray(_name, this.deck);
            // this.removeCardFromSelection(_name, false);
            this.updateVisuals();
        }
        removeCardFromDeck(_name, _updateVisuals = true) {
            this.removeFromArray(_name, this.deck);
            if (_updateVisuals)
                this.updateVisuals();
        }
        // addCardToSelection(_name: string) {
        //     this.addToArray(_name, this.selection);
        //     this.removeCardFromDeck(_name, false);
        //     this.updateVisuals();
        // }
        // removeCardFromSelection(_name: string, _updateVisuals: boolean = true) {
        //     this.removeFromArray(_name, this.selection);
        //     if (_updateVisuals) this.updateVisuals();
        // }
        hidePopup() {
            this.popupElement.classList.add("hidden");
        }
        removeFromArray(_element, _array) {
            let index = _array.indexOf(_element);
            if (index >= 0) {
                _array.splice(index, 1);
            }
        }
        addToArray(_element, _array) {
            if (_array.includes(_element))
                return;
            _array.push(_element);
        }
        installListeners() {
            document.getElementById("card-popup-close").querySelector("img").addEventListener("click", () => { this.hidePopup(); });
            document.getElementById("deck-back-button").querySelector("button").addEventListener("click", () => {
                this.hidePopup();
                Script.provider.get(Script.MenuManager).openMenu(Script.MenuType.MAIN);
            });
            // this.popupButtons.selectionTo.addEventListener("click", (_event) => { this.popupClickListener(_event, this.addCardToSelection); })
            // this.popupButtons.selectionToFrom.addEventListener("click", (_event) => { this.popupClickListener(_event, this.addCardToSelection); })
            // this.popupButtons.selectionFrom.addEventListener("click", (_event) => { this.popupClickListener(_event, this.removeCardFromSelection); })
            this.popupButtons.deckTo.addEventListener("click", (_event) => { this.popupClickListener(_event, this.addCardToDeck); });
            // this.popupButtons.deckToFrom.addEventListener("click", (_event) => { this.popupClickListener(_event, this.addCardToDeck); })
            this.popupButtons.deckFrom.addEventListener("click", (_event) => { this.popupClickListener(_event, this.removeCardFromDeck); });
            this.popupElement.addEventListener("click", (_e) => {
                if (_e.target === this.popupElement)
                    this.hidePopup();
            });
        }
        popupClickListener(_event, _func) {
            if (_event.target.classList.contains("disabled"))
                return;
            _func.call(this, this.selectedCard);
            this.hidePopup();
        }
        updateVisuals(_fullReset = false) {
            // collection
            let allCardsForCollection = [];
            let collectionEntires = Object.keys(this.collection).sort(this.compareRarity);
            for (let cardID of collectionEntires) {
                let visual = this.cardVisuals.get(cardID);
                if (!visual)
                    continue;
                allCardsForCollection.push(visual.htmlElement);
                visual.htmlElement.classList.remove("locked", "selected");
            }
            for (let cardID in Script.cards) {
                if (this.collection[cardID])
                    continue;
                let visual = this.cardVisuals.get(cardID);
                if (!visual)
                    continue;
                allCardsForCollection.push(visual.htmlElement);
                if (!_fullReset) {
                    visual.htmlElement.classList.add("locked");
                }
            }
            // for debugging we're adding a bunch of empty stuff to fill up to 100.
            // this.fillWithPlaceholders(allCardsForCollection, 100);
            if (_fullReset) {
                this.collectionElement.replaceChildren(...allCardsForCollection);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        this.updateVisuals();
                    });
                });
            }
            else {
                // selection
                // this.putCardsInDeck(this.selection, this.selectionElement, this.maxSelectedSize);
                // deck
                this.putCardsInDeck(this.deck, this.deckElement, this.maxDeckSize);
            }
            // number
            this.deckSelectionSizeElement.innerText = `${this.deck.length /* + this.selection.length */}/${this.maxDeckSize + this.maxSelectedSize}`;
        }
        putCardsInDeck(_selection, _parent, _maxSize) {
            let cards = [];
            for (let card of _selection) {
                let visual = this.cardVisuals.get(card);
                if (!visual)
                    continue;
                let clone = visual.htmlElement.cloneNode(true);
                clone.classList.remove("selected", "locked");
                clone.addEventListener("click", this.openPopup);
                cards.push(clone);
                visual.htmlElement.classList.add("selected");
            }
            this.fillWithPlaceholders(cards, _maxSize);
            _parent.replaceChildren(...cards);
        }
        fillWithPlaceholders(_array, _maxAmount) {
            for (let i = _array.length; i < _maxAmount; i++) {
                _array.push(this.getCardPlaceholder());
            }
        }
        getCardPlaceholder() {
            let elem = document.createElement("div");
            elem.classList.add("card", "placeholder");
            return elem;
        }
        compareRarity = (a, b) => {
            let cardA = Script.cards[a];
            let cardB = Script.cards[b];
            if (!cardA)
                return -1;
            if (!cardB)
                return 1;
            return this.getRarityNumber(cardA.rarity) - this.getRarityNumber(cardB.rarity);
        };
        getRarityNumber(_rarity) {
            if (_rarity === Script.CardRarity.UNCOMMON)
                return 1;
            if (_rarity === Script.CardRarity.RARE)
                return 2;
            if (_rarity === Script.CardRarity.EPIC)
                return 3;
            if (_rarity === Script.CardRarity.LEGENDARY)
                return 4;
            return 0;
        }
    }
    Script.CardCollection = CardCollection;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CardVisual {
        static template;
        static canvas;
        #name;
        #image;
        #text;
        #htmlElement;
        constructor(_card, _parent, _nameFallback = "unknown", _level = 0) {
            this.#name = _card.name ?? _nameFallback;
            this.#text = this.getFirstTranslatableText(_card.description ?? "unknown", _card.description, `card.${this.#name}.description`);
            this.#image = _card.image;
            this.#name = i18next.t(`card.${this.#name}.name`).toLocaleUpperCase();
            this.#htmlElement = CardVisual.template.content.cloneNode(true).childNodes[1];
            // figure out how large the title text should be
            let fontSize = 10;
            let heightRaw = getComputedStyle(_parent).getPropertyValue("--card-size");
            let tmpDiv = document.createElement("div");
            tmpDiv.style.width = heightRaw;
            document.documentElement.appendChild(tmpDiv);
            let height = tmpDiv.offsetWidth;
            document.documentElement.removeChild(tmpDiv);
            let cardWidth = height * (15 / 21) - 0.15 * height;
            let currentTextWidth = this.getTextWidth(this.#name, `normal  ${height / 100 * fontSize}px 'Luckiest Guy'`);
            let factor = cardWidth / currentTextWidth;
            fontSize *= factor;
            fontSize = Math.min(15, fontSize);
            let nameElement = this.#htmlElement.querySelector(".card-name");
            nameElement.style.fontSize = `calc(var(--card-size) / 100 * ${fontSize})`;
            // fill card with data
            nameElement.innerHTML = this.#name;
            requestAnimationFrame(() => {
                // turn into circle
                new CircleType(nameElement).radius(cardWidth * 2);
            });
            this.#htmlElement.querySelector(".card-text").innerText = this.#text;
            this.#htmlElement.querySelector(".card-image img").src = "Assets/Cards/Items/" + this.#image;
            this.#htmlElement.style.setProperty("--delay", `${Math.random() * -10}s`);
            this.#htmlElement.classList.add(_card.rarity);
            this.#htmlElement.classList.add(`level-${_level}`);
        }
        get htmlElement() {
            return this.#htmlElement;
        }
        getTextWidth(_text, _font) {
            const canvas = CardVisual.canvas || (CardVisual.canvas = document.createElement("canvas"));
            const context = canvas.getContext("2d");
            context.font = _font;
            const metrics = context.measureText(_text);
            return metrics.width;
        }
        getCanvasFont(el = document.body) {
            const fontWeight = this.getCssStyle(el, 'font-weight') || 'normal';
            const fontSize = this.getCssStyle(el, 'font-size') || '10vh';
            const fontFamily = this.getCssStyle(el, 'font-family') || 'Luckiest Guy';
            return `${fontWeight} ${fontSize} ${fontFamily}`;
        }
        getFirstTranslatableText(_fallback, ..._texts) {
            for (let text of _texts) {
                if (!text)
                    continue;
                let translatedText = i18next.t(text);
                if (translatedText !== text) {
                    return translatedText;
                }
            }
            return "";
        }
        getCssStyle(element, prop) {
            return window.getComputedStyle(element, null).getPropertyValue(prop);
        }
    }
    Script.CardVisual = CardVisual;
    document.addEventListener("DOMContentLoaded", initCardTemplate);
    function initCardTemplate() {
        CardVisual.template = document.getElementById("card");
    }
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.cards = {
        // ---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---
        "Hammer": {
            image: "Hammer.png",
            rarity: Script.CardRarity.COMMON,
            name: "Hammer",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "hammerPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 0, //8 Base Damage
                                    projectilePiercing: 2
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "hammerPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 4, //8 Base Damage
                                    projectilePiercing: 2
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "hammerPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 4, //8 Base Damage
                                    projectilePiercing: 2
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "hammerPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 7, //8 Base Damage
                                    projectilePiercing: 3
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "hammerPlayer",
                            amount: 2,
                            cooldown: 1.5,
                            modifiers: {
                                absolute: {
                                    damage: 7, //8 Base Damage
                                    projectilePiercing: 4
                                }
                            }
                        }]
                },
            ]
        },
        "Anvil": {
            image: "Anvil.png",
            rarity: Script.CardRarity.COMMON,
            name: "Anvil",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "anvilPlayer",
                            amount: 1,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 0 //10 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "anvilPlayer",
                            amount: 1,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 4 //10 Base Damage
                                }
                            }
                        }],
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "anvilPlayer",
                            amount: 2,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 4 //10 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "anvilPlayer",
                            amount: 2,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 10 //10 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "anvilPlayer",
                            amount: 3,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 10 //10 Base Damage
                                }
                            }
                        }]
                },
            ]
        },
        "Pen": {
            image: "Pen.png",
            rarity: Script.CardRarity.COMMON,
            name: "Pen",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "penPlayer",
                            amount: 1,
                            cooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 0 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "penPlayer",
                            amount: 1,
                            cooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 2 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "penPlayer",
                            amount: 2,
                            cooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 2 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "penPlayer",
                            amount: 2,
                            cooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 4 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "penPlayer",
                            amount: 3,
                            cooldown: 0.4,
                            modifiers: {
                                absolute: {
                                    damage: 4 //2 Base Damage
                                }
                            }
                        }]
                },
            ]
        },
        "Lightbulb": {
            image: "Bulb.png",
            rarity: Script.CardRarity.COMMON,
            name: "Lightbulb",
            levels: [
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "lightbulbPlayer",
                            cooldown: 4,
                            modifiers: {
                                absolute: {
                                    damage: 0, //5 Base Damage
                                    effectDuration: 0 //1 Base Duration
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "lightbulbPlayer",
                            cooldown: 4,
                            modifiers: {
                                absolute: {
                                    damage: 1, //5 Base Damage
                                    effectDuration: 0, //1 Base Duration
                                    projectileSize: 1.1
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "lightbulbPlayer",
                            cooldown: 4,
                            modifiers: {
                                absolute: {
                                    damage: 1, //5 Base Damage
                                    effectDuration: 0.5, //1 Base Duration
                                    projectileSize: 1.3
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "lightbulbPlayer",
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 1, //5 Base Damage
                                    effectDuration: 0.5, //1 Base Duration
                                    projectileSize: 1.5
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "lightbulbPlayer",
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                    effectDuration: 1, //1 Base Duration
                                    projectileSize: 2
                                }
                            }
                        }]
                },
            ]
        },
        "Smoke Mask": {
            image: "SmokeMask.png",
            rarity: Script.CardRarity.COMMON,
            name: "Smoke Mask",
            levels: [
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 0 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 1 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 1.5,
                            modifiers: {
                                absolute: {
                                    damage: 1 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 2 //2 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 3, //2 Base Damage
                                },
                                multiplier: {
                                    projectileSize: 1.5
                                }
                            }
                        }]
                },
            ]
        },
        "Discus": {
            image: "Discus.png",
            rarity: Script.CardRarity.COMMON,
            name: "Discus",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "discusPlayer",
                            amount: 1,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 0, //5 Base Damage
                                    projectilePiercing: 1
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "discusPlayer",
                            amount: 1,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                    projectilePiercing: 1
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "discusPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                    projectilePiercing: 1
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "discusPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                    projectilePiercing: 2
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "discusPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                    projectilePiercing: 3
                                }
                            }
                        }]
                },
            ]
        },
        "Code Civil": {
            image: "CodeCivil.png",
            rarity: Script.CardRarity.COMMON,
            name: "Code Civil",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "codeCivilPlayer",
                            amount: 1,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 0 //3 Base Damage (x10 for max distance)
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "codeCivilPlayer",
                            amount: 1,
                            cooldown: 3,
                            modifiers: {
                                absolute: {
                                    damage: 1 //3 Base Damage (x10 for max distance)
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "codeCivilPlayer",
                            amount: 1,
                            cooldown: 2.5,
                            modifiers: {
                                absolute: {
                                    damage: 2 //3 Base Damage (x10 for max distance)
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "codeCivilPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 3 //3 Base Damage (x10 for max distance)
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "codeCivilPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 5 //3 Base Damage (x10 for max distance)
                                }
                            }
                        }]
                },
            ]
        },
        "Divider": {
            image: "Divider.png",
            rarity: Script.CardRarity.COMMON,
            name: "Divider",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 0, //5 Base Damage
                                    projectilePiercing: 3
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 2, //5 Base Damage
                                    projectilePiercing: 3
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 2, //5 Base Damage
                                    projectilePiercing: 3
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                    projectilePiercing: 4
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                    projectilePiercing: 6
                                }
                            }
                        }]
                },
            ]
        },
        "Needles": {
            image: "Needles.png",
            rarity: Script.CardRarity.COMMON,
            name: "Needles",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "needlePlayer",
                            amount: 1,
                            cooldown: 4, //TODO: Leave a projectile every 5 units moved
                            cooldownBasedOnDistance: true,
                            modifiers: {
                                absolute: {
                                    damage: 0, //5 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "needlePlayer",
                            amount: 1,
                            cooldown: 3.5, //TODO: Leave a projectile every 4 units moved
                            cooldownBasedOnDistance: true,
                            modifiers: {
                                absolute: {
                                    damage: 1, //5 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "needlePlayer",
                            amount: 1,
                            cooldown: 3, //TODO: Leave a projectile every 4 units moved
                            cooldownBasedOnDistance: true,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "needlePlayer",
                            amount: 1,
                            cooldown: 2, //TODO: Leave a projectile every 3 units moved
                            cooldownBasedOnDistance: true,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "needlePlayer",
                            amount: 1,
                            cooldown: 1, //TODO: Leave a projectile every 2 units moved
                            cooldownBasedOnDistance: true,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                }
                            }
                        }]
                },
            ]
        },
        "Chisel": {
            image: "Chisel.png",
            rarity: Script.CardRarity.COMMON,
            name: "Chisel",
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "chiselPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 0, //15 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "chiselPlayer",
                            amount: 1,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 10, //15 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "chiselPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 10, //15 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "chiselPlayer",
                            amount: 2,
                            cooldown: 2,
                            modifiers: {
                                absolute: {
                                    damage: 20, //15 Base Damage
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "chiselPlayer",
                            amount: 2,
                            cooldown: 1.5,
                            modifiers: {
                                absolute: {
                                    damage: 25, //15 Base Damage
                                }
                            }
                        }]
                },
            ]
        },
        "Helmet": {
            image: "Helmet.png",
            rarity: Script.CardRarity.COMMON,
            name: "Helmet",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.9 //TODO: Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.8 //TODO: Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.7 //TODO: Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.6 //TODO: Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.4 //TODO: Less Damage from projectiles
                        }
                    }
                },
            ]
        },
        "Safety Boots": {
            image: "SafetyBoots.png",
            rarity: Script.CardRarity.COMMON,
            name: "Safety Boots",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.9 //TODO: More resistant against ground effects
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.8 //TODO: More resistant against ground effects
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.7 //TODO: More resistant against ground effects
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.6 //TODO: More resistant against ground effects
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.4 //TODO: More resistant against ground effects
                        }
                    }
                },
            ]
        },
        "Microphone": {
            image: "Microphone.png",
            rarity: Script.CardRarity.COMMON,
            name: "Microphone",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.15
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.3
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.5
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.7
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 2
                        }
                    }
                },
            ]
        },
        "Gavel": {
            image: "Gavel.png",
            rarity: Script.CardRarity.COMMON,
            name: "Gavel",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            damage: 1,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damage: 2,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damage: 3,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damage: 5,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damage: 8,
                        }
                    }
                },
            ]
        },
        "First Aid Kit": {
            image: "FirstAidKit.png",
            rarity: Script.CardRarity.COMMON,
            name: "First Aid Kit",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            health: 10,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 20,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 35,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 50,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 75,
                        }
                    }
                },
            ]
        },
        "Running Shoes": {
            image: "RunningShoes.png",
            rarity: Script.CardRarity.COMMON,
            name: "Running Shoes",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 0.25,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 0.5,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 0.75,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 1.25,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 2,
                        }
                    }
                },
            ]
        },
        "Disposable Gloves": {
            image: "DisposableGloves.png",
            rarity: Script.CardRarity.COMMON,
            name: "Disposable Gloves",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: 1
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: 2
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: 4
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: 6
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: 10
                        }
                    }
                },
            ]
        },
        "Printer": {
            image: "Printer.png",
            rarity: Script.CardRarity.COMMON,
            name: "Printer",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +25% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +40% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +60% increased XP
                        }
                    }
                },
            ]
        }, "Solar Panel": {
            image: "SolarPanel.png",
            rarity: Script.CardRarity.COMMON,
            name: "Solar Panel",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 0.5,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 1,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 2,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 4,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 7,
                        }
                    }
                },
            ]
        },
        "Drone": {
            image: "Drone.png",
            rarity: Script.CardRarity.COMMON,
            name: "Drone",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% increased field of view (camera zoom)
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% increased field of view (camera zoom)
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +20% increased field of view (camera zoom)
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +35% increased field of view (camera zoom)
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% increased field of view (camera zoom)
                        }
                    }
                },
            ]
        },
        // ---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---
        "Pills": {
            image: "Pills.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Pills",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.2
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.3
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.5
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.7
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 2
                        }
                    }
                },
            ]
        },
        "Fire Hose": {
            image: "FireHose.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Fire Hose",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.1
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.15
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.25
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.4
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.6
                        }
                    }
                },
            ]
        },
        "Syringe": {
            image: "Syrringe.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Syringe",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.01 //TODO: Double check if this actually works correctly xD
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.02 //TODO: Double check if this actually works correctly xD
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.03 //TODO: Double check if this actually works correctly xD
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.05 //TODO: Double check if this actually works correctly xD
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.1 //TODO: Double check if this actually works correctly xD
                        }
                    }
                },
            ]
        },
        "Sketchbook": {
            image: "Sketchbook.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Sketchbook",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +20% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +30% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% increased effect radius
                        }
                    }
                },
            ]
        },
        "Plow": {
            image: "Plow.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Plow",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -2% enemy speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -5% enemy speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -10% enemy speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -15% enemy speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -25% enemy speed
                        }
                    }
                },
            ]
        },
        "Jump Rope": {
            image: "JumpRope.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Jump Rope",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +20% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +30% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% dodge chance
                        }
                    }
                },
            ]
        },
        "Tape Measure": {
            image: "TapeMeasure.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Tape Measure",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -5% enemy projectile speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -10% enemy projectile speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -20% enemy projectile speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -30% enemy projectile speed
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -50% enemy projectile speed
                        }
                    }
                },
            ]
        },
        "LegalWig": {
            image: "LegalWig.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Legal Wig",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -5% enemies, +5% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -10% enemies, +10% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -20% enemies, +20% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -30% enemies, +30% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -50% enemies, +50% enemy stats
                        }
                    }
                },
            ]
        },
        "Toolbelt": {
            image: "Toolbelt.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Toolbelt",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% damage for every weapon equipped
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +2% damage for every weapon equipped
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% damage for every weapon equipped
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% damage for every weapon equipped
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +20% damage for every weapon equipped
                        }
                    }
                },
            ]
        },
        "Razor": {
            image: "Razor.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Razor",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +2% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +3% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% permanent attack speed every time you take damage.
                        }
                    }
                },
            ]
        },
        "Binder": {
            image: "Binder.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Binder",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.05
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.1
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.2
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.4
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.75
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
            ]
        },
        "Flashlight": {
            image: "Flashlight.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Flashlight",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            health: 20
                            //TODO: start the room with 90% health
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 40
                            //TODO: start the room with 75% health
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 75
                            //TODO: start the room with 50% health
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 100
                            //TODO: start the room with 25% health
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            health: 150
                            //TODO: start the room with 25% health
                        }
                    }
                },
            ]
        },
        "Hard Drive": {
            image: "HardDrive.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Hard Drive",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 2% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 5% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 10% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 15% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 25% more enemies
                        }
                    }
                },
            ]
        },
        "Stethoscope": {
            image: "Stethoscope.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Stethoscope",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% damage every time you heal (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +2% damage every time you heal (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +3% damage every time you heal (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% damage every time you heal (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% permanent damage every time you heal.
                        }
                    }
                },
            ]
        },
        "Apple": {
            image: "Apple.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Apple",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                        //TODO: +0.5 health for every enemy that spawns.
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                        //TODO: +1 health for every enemy that spawns.
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                        //TODO: +2 health for every enemy that spawns.
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                        //TODO: +3 health for every enemy that spawns.
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                        //TODO: +5 health for every enemy that spawns.
                        }
                    }
                },
            ]
        },
        // ---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---
        "Magnifying Glass": {
            image: "MagnifyingGlas.png",
            rarity: Script.CardRarity.RARE,
            name: "Magnifying Glass",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.05
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.1
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.2
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.35
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.6
                        }
                    }
                },
            ]
        },
        "Tattoo Ink": {
            image: "TatooInk.png",
            rarity: Script.CardRarity.RARE,
            name: "Tattoo Ink",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.15
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.3
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.5
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.7
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 2
                        }
                    }
                },
            ]
        },
        "Calculator": {
            image: "Calculator.png",
            rarity: Script.CardRarity.RARE,
            name: "Calculator",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.05
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.1
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.2
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.35
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.6
                        }
                    }
                },
            ]
        },
        "Bandages": {
            image: "Bandages.png",
            rarity: Script.CardRarity.RARE,
            name: "Bandages",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            health: 1.05
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            health: 1.1
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            health: 1.2
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            health: 1.3
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            health: 1.5
                        }
                    }
                },
            ]
        },
        "Face Shield": {
            image: "FaceShield.png",
            rarity: Script.CardRarity.RARE,
            name: "Face Shield",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.95
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.9
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.8
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.7
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.5
                        }
                    }
                },
            ]
        },
        "3D Printer": {
            image: "3DPrinter.png",
            rarity: Script.CardRarity.RARE,
            name: "3D Printer",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 10% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 25% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 40% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 60% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 100% chance to copy another random card effect (resets each room).
                        }
                    }
                },
            ]
        },
        "Ear Protection": {
            image: "EarProtection.png",
            rarity: Script.CardRarity.RARE,
            name: "Ear Protection",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +25% duration of invincibility after taking damage.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% duration of invincibility after taking damage.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +75% duration of invincibility after taking damage.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +100% duration of invincibility after taking damage.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +150% duration of invincibility after taking damage.
                        }
                    }
                },
            ]
        },
        "Athletic Tape": {
            image: "AthleticTape.png",
            rarity: Script.CardRarity.RARE,
            name: "Athletic Tape",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +15% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +30% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% healing effects.
                        }
                    }
                },
            ]
        },
        "Newspaper": {
            image: "Newspaper.png",
            rarity: Script.CardRarity.RARE,
            name: "Newspaper",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.05
                            //TODO: -5% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.1
                            //TODO: -10% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.15
                            //TODO: -15% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.25
                            //TODO: -25% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.5
                            //TODO: -25% damage while standing still.
                        }
                    }
                },
            ]
        },
        "Screwdriver": {
            image: "Screwdriver.png",
            rarity: Script.CardRarity.RARE,
            name: "Screwdriver",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +2% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +3% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% permanent attack speed every time you kill an enemy.
                        }
                    }
                },
            ]
        },
        "Bucket": {
            image: "Bucket.png",
            rarity: Script.CardRarity.RARE,
            name: "Bucket",
            levels: [
                {
                    passiveEffects: {
                    //TODO: Negates the first 1 instance of damage per room.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Negates the first 2 instances of damage per room.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Negates the first 3 instances of damage per room.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Negates the first 4 instances of damage per room.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Negates the next 4 instances of damage every new room (stays inbetween rooms).
                    }
                },
            ]
        },
        "Riot Shield": {
            image: "RiotShield.png",
            rarity: Script.CardRarity.RARE,
            name: "Riot Shield",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% chance to reflect projectiles.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +15% chance to reflect projectiles.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +25% chance to reflect projectiles.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +35% chance to reflect projectiles.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% chance to reflect projectiles.
                        }
                    }
                },
            ]
        },
        // ---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---
        "Piercing Gun": {
            image: "PiercingGun.png",
            rarity: Script.CardRarity.EPIC,
            name: "Piercing Gun",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 1
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 2
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 3
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 4
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 6
                        }
                    }
                },
            ]
        },
        "Stopwatch": {
            image: "Stopwatch.png",
            rarity: Script.CardRarity.EPIC,
            name: "Stopwatch",
            levels: [
                {
                    passiveEffects: {
                    //TODO: Stuns 1 random enemy for 1 second everytime you take damage.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Stuns 2 random enemies for 1 second everytime you take damage.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Stuns 3 random enemies for 1.5 seconds everytime you take damage.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Stuns 4 random enemies for 1.5 seconds everytime you take damage.
                    }
                },
                {
                    passiveEffects: {
                    //TODO: Stuns 5 random enemies for 2 seconds everytime you take damage.
                    }
                },
            ]
        },
        "Rake": {
            image: "Rake.png",
            rarity: Script.CardRarity.EPIC,
            name: "Rake",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +10% map size.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +15% map size.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +25% map size.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +35% map size.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +50% map size.
                        }
                    }
                },
            ]
        },
        "Jumper Cable": {
            image: "JumperCable.png",
            rarity: Script.CardRarity.EPIC,
            name: "Jumper Cable",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Heal 1% of the damage you deal.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Heal 2% of the damage you deal.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Heal 5% of the damage you deal.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Heal 15% of the damage you deal.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Heal 30% of the damage you deal.
                        }
                    }
                },
            ]
        },
        "Shredder": {
            image: "Shredder.png",
            rarity: Script.CardRarity.EPIC,
            name: "Shredder",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.1,
                            damageReduction: 1.1
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.25,
                            damageReduction: 1.25
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.4,
                            damageReduction: 1.4
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 1.6,
                            damageReduction: 1.6
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damage: 2,
                            damageReduction: 2
                        }
                    }
                },
            ]
        },
        "Whiteboard": {
            image: "Whiteboard.png",
            rarity: Script.CardRarity.EPIC,
            name: "Whiteboard",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -30% all stats, +1% all stats per level on your equipped cards.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -20% all stats, +1% all stats per level on your equipped cards.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -60% all stats, +2% all stats per level on your equipped cards.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -40% all stats, +2% all stats per level on your equipped cards.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -90% all stats, +3% all stats per level on your equipped cards.
                        }
                    }
                },
            ]
        },
        "Drawing Tablet": {
            image: "DrawingTablet.png",
            rarity: Script.CardRarity.EPIC,
            name: "Drawing Tablet",
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 1
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 2
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 3
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 4
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 6
                        }
                    }
                },
            ]
        },
        "Press Vest": {
            image: "PressVest.png",
            rarity: Script.CardRarity.EPIC,
            name: "Press Vest",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +1% Damage resistance per current movement speed (maximum 60%).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +2% Damage resistance per current movement speed (maximum 65%).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +3% Damage resistance per current movement speed (maximum 70%).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +5% Damage resistance per current movement speed (maximum 75%).
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +8% Damage resistance per current movement speed (maximum 90%).
                        }
                    }
                },
            ]
        },
        "Tong": {
            image: "Tong.png",
            rarity: Script.CardRarity.EPIC,
            name: "Tong",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +20% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +30% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +40% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +60% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +100% attack speed while standing still.
                        }
                    }
                },
            ]
        },
        "High-Vis West": {
            image: "HighVisWest.png",
            rarity: Script.CardRarity.EPIC,
            name: "High-Vis West",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 20% chance to deal received damage back to enemies.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 30% chance to deal received damage back to enemies.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 40% chance to deal received damage back to enemies.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 60% chance to deal received damage back to enemies.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: 100% chance to deal received damage back to enemies.
                        }
                    }
                },
            ]
        },
        // ---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---
        "Apprenticeship": {
            image: "Apprenticeship.gif",
            rarity: Script.CardRarity.LEGENDARY,
            name: "Apprenticeship",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: +25% all stats.
                        }
                    }
                },
            ]
        },
        "Diploma": {
            image: "Diploma.gif",
            rarity: Script.CardRarity.LEGENDARY,
            name: "Diploma",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: -50% on all stats, but every cleared room has a 10% chance to drop a booster pack (+10% per cleared room).
                        }
                    }
                },
            ]
        },
        "Internship": {
            image: "Internship.gif",
            rarity: Script.CardRarity.LEGENDARY,
            name: "Internship",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Every job gets +1 for their set.
                        }
                    }
                },
            ]
        },
        "Certification": {
            image: "Certification.gif",
            rarity: Script.CardRarity.LEGENDARY,
            name: "Certification",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                        //TODO: Rerolls every outcome twice and takes the better option.
                        }
                    }
                },
            ]
        },
        "Training": {
            image: "Training.gif",
            rarity: Script.CardRarity.LEGENDARY,
            name: "Training",
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            health: 2
                        }
                    }
                },
            ]
        },
    };
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Character extends ƒ.Component {
        #animator;
        #walkingSprite = {
            fps: 24,
            frames: 24,
            height: 256,
            width: 256,
            totalHeight: 1280,
            totalWidth: 1280,
            wrapAfter: 5,
        };
        #idleSprite = {
            fps: 24,
            frames: 24,
            height: 256,
            width: 256,
            totalHeight: 1280,
            totalWidth: 1280,
            wrapAfter: 5,
        };
        prevAnimation = AnimationState.IDLE;
        #layers = [];
        #healthElement;
        prevDirection = 0;
        health = 100;
        maxHealth = 100;
        rigidbody;
        cardManager;
        speed = 3.5;
        visualChildren = [];
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, () => {
                this.node.addEventListener("graphInstantiated" /* ƒ.EVENT.GRAPH_INSTANTIATED */, () => {
                    Script.provider.get(Script.CharacterManager).character = this;
                    this.init();
                    this.setupAnimator();
                }, true);
            });
        }
        init() {
            this.#healthElement = document.getElementById("healthbar");
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.cardManager = Script.provider.get(Script.CardManager);
            this.visualChildren = this.node.getChildrenByName("visuals")[0].getChildren();
        }
        move(_direction, _time) {
            let scale = this.cardManager.modifyValuePlayer(this.speed, Script.PassiveCardEffect.MOVEMENT_SPEED);
            // prevent player from leaving playarea
            let charPosition = this.node.mtxWorld.translation.clone;
            let newVelocity = ƒ.Vector3.SCALE(new ƒ.Vector3(_direction.x, _direction.y), scale);
            charPosition.add(ƒ.Vector3.SCALE(newVelocity, ƒ.Loop.timeFrameGame / 1000));
            if (charPosition.x > 12 || charPosition.x < -12)
                newVelocity.x = 0;
            if (charPosition.y > 7 || charPosition.y < -7)
                newVelocity.y = 0;
            //TODO: update this to use physics
            this.rigidbody.setVelocity(newVelocity);
            this.#animator.setTime();
            if (_direction.magnitudeSquared === 0) {
                this.setAnimation(AnimationState.IDLE);
            }
            else {
                this.setAnimation(AnimationState.WALKING);
            }
            let dir = Math.sign(_direction.x);
            if (dir !== this.prevDirection && dir !== 0) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.changeVisualDirection();
                }
                else if (this.prevDirection < 0) {
                    this.changeVisualDirection(180);
                }
            }
            // for (let collision of this.rigidbody.collisions) {
            //     if (collision.node.name === "enemy") {
            //         this.hit({ damage: collision.node.getComponent(Enemy).damage * _time });
            //     }
            // }
        }
        update(_direction) {
            let time = Math.min(1, ƒ.Loop.timeFrameGame / 1000);
            this.move(_direction, time);
            // regenerate health
            if (Script.gameState === Script.GAMESTATE.PLAYING) {
                let regeneration = this.cardManager.modifyValuePlayer(0, Script.PassiveCardEffect.REGENERATION);
                if (regeneration > 0) {
                    this.health = Math.min(this.maxHealth, this.health + regeneration);
                    this.updateHealthVisually();
                }
            }
        }
        hit(_hit) {
            this.health -= _hit.damage;
            //TODO display damage numbers
            //update display
            this.updateHealthVisually();
            if (this.health > 0)
                return _hit.damage;
            // TODO: Game Over
            return 0;
        }
        reset() {
            this.health = this.maxHealth;
            this.updateHealthVisually();
            this.rigidbody.activate(false);
            this.node.mtxLocal.translation = new ƒ.Vector3();
            this.rigidbody.activate(true);
        }
        changeVisualDirection(_rot = 0) {
            for (let child of this.visualChildren) {
                let mesh = child.getComponent(ƒ.ComponentMesh);
                if (mesh)
                    mesh.mtxPivot.rotation = new ƒ.Vector3(0, _rot, 0);
            }
        }
        updateHealthVisually() {
            this.#healthElement.max = this.maxHealth;
            this.#healthElement.value = this.health;
        }
        setAnimation(_state) {
            if (_state === this.prevAnimation)
                return;
            this.prevAnimation = _state;
            switch (this.prevAnimation) {
                case AnimationState.IDLE:
                    this.#animator.reset(this.#idleSprite);
                    break;
                case AnimationState.WALKING:
                    this.#animator.reset(this.#walkingSprite);
                    break;
            }
            for (let layer of this.#layers) {
                layer.setTexture(_state);
            }
        }
        setupAnimator = () => {
            this.#animator = new Script.SpriteAnimator(this.#idleSprite);
            for (let child of this.visualChildren) {
                child.getComponent(ƒ.ComponentMaterial).mtxPivot = this.#animator.matrix;
                this.#layers.push(child.getComponent(Script.CharacterLayer));
            }
            this.setAnimation(AnimationState.IDLE);
        };
    }
    Script.Character = Character;
    let AnimationState;
    (function (AnimationState) {
        AnimationState["IDLE"] = "idle";
        AnimationState["WALKING"] = "walking";
    })(AnimationState = Script.AnimationState || (Script.AnimationState = {}));
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class CharacterLayer extends ƒ.Component {
        #layerId = 0;
        #material;
        #textures;
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, () => {
                this.#layerId = Number(this.node.name.slice(9));
                this.#material = this.node.getComponent(ƒ.ComponentMaterial).material.coat;
            });
            ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, async () => {
                let allTextures = await ƒ.Project.getResourcesByType(ƒ.TextureImage);
                this.#textures = {
                    idle: allTextures.find(t => t.name.includes("Robot_base_idle_Layer" + this.#layerId)),
                    walking: allTextures.find(t => t.name.includes("Robot_base_walk_Layer" + this.#layerId)),
                };
            });
        }
        setTexture(_state) {
            if (!this.#textures[_state])
                return;
            this.#material.texture = this.#textures[_state];
        }
    }
    Script.CharacterLayer = CharacterLayer;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.enemies = {
        microwave: {
            moveSprite: ["microwave", "move"],
            damage: 5,
            desiredDistance: [0, 0],
            health: 15,
            speed: 0.8,
            knockbackMultiplier: 1,
            dropXP: 2,
        },
        chair: {
            moveSprite: ["chair", "move"],
            damage: 4,
            desiredDistance: [0, 0],
            health: 10,
            speed: 1.2,
            knockbackMultiplier: 1.2,
            dropXP: 2,
        },
        toaster: {
            moveSprite: ["toaster", "move"],
            desiredDistance: [3, 4],
            health: 10,
            speed: 0.5,
            knockbackMultiplier: 1.2,
            dropXP: 3,
            attacks: [
                {
                    cooldown: 2,
                    requiredDistance: [2, 3],
                    attackSprite: ["toaster", "attack"],
                    cooldownSprite: ["toaster", "idle"],
                    windUp: 1,
                    movement: () => { },
                    events: {
                        fire: function () {
                            Script.provider.get(Script.ProjectileManager).createProjectile(Script.projectiles["toastEnemy"], Script.ƒ.Vector3.SUM(this.node.mtxWorld.translation, Script.ƒ.Vector3.Y(0.3)), undefined);
                        }
                    }
                }
            ]
        },
        closet: {
            moveSprite: ["closet", "move"],
            damage: 30,
            desiredDistance: [0, 0],
            health: 50,
            speed: 0.2,
            knockbackMultiplier: 0.2,
            dropXP: 3,
        },
        motor: {
            moveSprite: ["motor", "move"],
            damage: 10,
            desiredDistance: [0, 1],
            health: 25,
            speed: 2,
            dropXP: 4,
            attacks: [
                {
                    cooldown: 2,
                    requiredDistance: [0, 0],
                    windUp: 2,
                    movement: () => { },
                }
            ]
        },
        ventilator: {
            moveSprite: ["ventilator", "move"],
            damage: 2,
            speed: 2,
            health: 4,
            dropXP: 0.5
        },
        mixer: {
            moveSprite: ["mixer", "move"],
            damage: 20,
            desiredDistance: [2, 3],
            health: 25,
            speed: 1.5,
            dropXP: 5,
            attacks: [
                {
                    cooldown: 4,
                    requiredDistance: [0, 0],
                    attackSprite: ["mixer", "digup"],
                    cooldownSprite: ["mixer", "idle"],
                    windUp: 2,
                    movement: () => { },
                }
            ]
        },
    };
})(Script || (Script = {}));
/// <reference path="../Animateable.ts" />
var Script;
/// <reference path="../Animateable.ts" />
(function (Script) {
    class Enemy extends Script.Animateable {
        speed = 1;
        damage = 1;
        knockbackMultiplier = 1;
        health = 1;
        attacks = [];
        moveSprite;
        desiredDistance = [0, 0];
        directionOverride;
        currentlyDesiredDistance = [0, 0];
        currentlyDesiredDistanceSquared = [0, 0];
        dropXP = 0;
        enemyManager;
        prevDirection;
        currentlyActiveAttack;
        rigidbody;
        touchingPlayer;
        stunned = 0;
        static defaults = {
            attacks: [],
            damage: 1,
            speed: 1,
            desiredDistance: [0, 0],
            dropXP: 1,
            health: 1,
            knockbackMultiplier: 1,
            moveSprite: {
                fps: 1,
                frames: 1,
                height: 256,
                width: 256,
                totalHeight: 256,
                totalWidth: 256,
                wrapAfter: 1,
            },
            directionOverride: undefined,
        };
        constructor() {
            super();
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserializedListener);
        }
        deserializedListener = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserializedListener);
            this.enemyManager = Script.provider.get(Script.EnemyManager);
            this.rigidbody = this.node.getComponent(Script.ƒ.ComponentRigidbody);
            this.rigidbody.effectGravity = 0;
            this.rigidbody.effectRotation = new Script.ƒ.Vector3(0, 0, 0);
            this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.onCollisionEnter);
            this.rigidbody.addEventListener("ColliderLeftCollision" /* ƒ.EVENT_PHYSICS.COLLISION_EXIT */, this.onCollisionExit);
        };
        setup(_options) {
            _options = { ...Enemy.defaults, ..._options };
            this.speed = _options.speed;
            this.damage = _options.damage;
            this.knockbackMultiplier = _options.knockbackMultiplier;
            this.health = _options.health;
            this.attacks = _options.attacks;
            this.desiredDistance = _options.desiredDistance;
            this.dropXP = _options.dropXP;
            this.directionOverride = _options.directionOverride;
            this.updateDesiredDistance(this.desiredDistance);
            this.moveSprite = this.getSprite(_options.moveSprite);
            this.setCentralAnimator(this.moveSprite);
            this.stunned = 0;
        }
        updateDesiredDistance(_distance) {
            this.currentlyDesiredDistance = _distance;
            this.currentlyDesiredDistanceSquared = [this.currentlyDesiredDistance[0] * this.currentlyDesiredDistance[0], this.currentlyDesiredDistance[1] * this.currentlyDesiredDistance[1]];
        }
        update(_charPosition, _frameTimeInSeconds) {
            if (this.stunned > 0) {
                this.stunned = Math.max(0, this.stunned - _frameTimeInSeconds);
                if (this.stunned <= 0) {
                    this.setCentralAnimator(this.moveSprite);
                }
                return;
            }
            // check distance to player
            let diff = Script.ƒ.Vector3.DIFFERENCE(_charPosition, this.node.mtxLocal.translation);
            let mgtSqrd = diff.magnitudeSquared;
            if (this.currentlyActiveAttack && this.currentlyActiveAttack.movement && this.currentlyActiveAttack.started) {
                this.currentlyActiveAttack.movement.call(this, diff, mgtSqrd, _charPosition, _frameTimeInSeconds);
            }
            else {
                this.move(diff, mgtSqrd, _frameTimeInSeconds);
            }
            // if the enemy has special attacks and none are active, choose one
            this.chooseAttack();
            // if there is a currently active attack, execute it
            this.executeAttack(mgtSqrd, _frameTimeInSeconds);
        }
        stun(_time) {
            if (this.stunned <= 0) {
                this.removeAnimationEventListeners();
                let am = Script.provider.get(Script.AnimationManager);
                if (this.uniqueAnimationId) {
                    am.removeUniqueAnimationMtx(this.uniqueAnimationId);
                    this.uniqueAnimationId = undefined;
                }
                let sa = new Script.SpriteAnimator(this.moveSprite, 0);
                this.material.mtxPivot = sa.matrix;
            }
            this.stunned += _time;
            this.currentlyActiveAttack = undefined;
        }
        move(_diff, _mgtSqrd, _frameTimeInSeconds) {
            if (this.directionOverride) {
                // do we have a movement override?
                let direction = this.directionOverride.clone;
                direction.normalize(this.speed);
                //TODO: change to physics based movement
                // this.node.mtxLocal.translate(direction, false);
                this.rigidbody.setVelocity(direction);
            }
            else {
                // normal movement
                _diff.normalize(this.speed);
                //move towards or away from player?
                if (_mgtSqrd < this.currentlyDesiredDistanceSquared[0]) {
                    // we're too close to the player, gotta move away
                    _diff.scale(-1);
                }
                else if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // we're in a good distance to the player, no need to move further
                    _diff = Script.ƒ.Vector3.ZERO();
                    //TODO: set idle animation
                }
                //TODO: change to physics based movement
                // this.node.mtxLocal.translate(_diff, false);
                this.rigidbody.setVelocity(_diff);
            }
            // rotate visually to face correct direction
            let dir = Math.sign(_diff.x);
            if (dir !== this.prevDirection && dir !== 0) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.node.getComponent(Script.ƒ.ComponentMesh).mtxPivot.rotation = new Script.ƒ.Vector3();
                }
                else if (this.prevDirection < 0) {
                    this.node.getComponent(Script.ƒ.ComponentMesh).mtxPivot.rotation = new Script.ƒ.Vector3(0, 180, 0);
                }
            }
            // are we touching the player?
            if (this.touchingPlayer) {
                let character = Script.provider.get(Script.CharacterManager).character;
                // let mag = ƒ.Vector3.DIFFERENCE(character.node.mtxWorld.translation, this.node.mtxWorld.translation).magnitudeSquared;
                // if (mag < 0.64 /* 0.8² (player hitbox size) TODO: update this if player or enemy size changes */)
                character.hit({ damage: this.damage * _frameTimeInSeconds });
                // console.log(this.rigidbody.collisions);
            }
        }
        chooseAttack() {
            if (this.currentlyActiveAttack || this.attacks.length === 0)
                return;
            this.currentlyActiveAttack = { ...this.attacks[Math.floor(Math.random() * this.attacks.length)] };
            this.currentlyActiveAttack.started = false;
            this.currentlyActiveAttack.done = false;
            this.updateDesiredDistance(this.currentlyActiveAttack.requiredDistance);
        }
        executeAttack(_mgtSqrd, _frameTimeInSeconds) {
            if (!this.currentlyActiveAttack)
                return;
            if (!this.currentlyActiveAttack.started) {
                // attack hasn't started yet. should we start it?
                if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // start the attack
                    this.currentlyActiveAttack.started = true;
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.attackSprite), true, this.eventListener);
                }
            }
            if (this.currentlyActiveAttack.started) {
                // attack is ongoingw
                if (this.currentlyActiveAttack.windUp > 0) {
                    // still preparing
                    this.currentlyActiveAttack.windUp -= _frameTimeInSeconds;
                }
                else if (!this.currentlyActiveAttack.done) {
                    // time to execute attack
                    this.currentlyActiveAttack.done = true;
                    this.currentlyActiveAttack.attack?.call(this);
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.cooldownSprite), true, this.eventListener);
                }
                else {
                    //we're on cooldown now
                    this.currentlyActiveAttack.cooldown -= _frameTimeInSeconds;
                    if (this.currentlyActiveAttack.cooldown < 0) {
                        // cooldown is up, we're ready to do something else
                        this.currentlyActiveAttack = undefined;
                        this.updateDesiredDistance(this.desiredDistance);
                        this.setCentralAnimator(this.moveSprite);
                    }
                }
            }
        }
        eventListener = (_event) => {
            if (!this.currentlyActiveAttack.events)
                return;
            if (!this.currentlyActiveAttack.events[_event.type])
                return;
            this.currentlyActiveAttack.events[_event.type].call(this, _event);
        };
        onCollisionEnter = (_event) => {
            if (_event.cmpRigidbody.node.name !== "character")
                return;
            this.touchingPlayer = true;
        };
        onCollisionExit = (_event) => {
            if (_event.cmpRigidbody.node.name !== "character")
                return;
            this.touchingPlayer = false;
        };
        hit(_hit) {
            this.health -= _hit.damage;
            //display damage numbers
            this.enemyManager.displayDamage(_hit.damage, this.node.mtxWorld.translation);
            //TODO apply knockback
            if (_hit.stun) {
                this.stun(_hit.stun);
            }
            if (this.health > 0)
                return _hit.damage;
            this.enemyManager.removeEnemy(this);
            this.removeAnimationEventListeners();
            if (isFinite(_hit.damage)) {
                this.enemyManager.addXP(this.dropXP);
            }
            else {
                this.enemyManager.addXP(this.dropXP / 2);
            }
            return _hit.damage + this.health;
        }
    }
    Script.Enemy = Enemy;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class AnimationManager {
        provider;
        shared = {};
        unique = new Map();
        currentUniqueId = 0;
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let time = Script.ƒ.Time.game.get();
            for (let type in this.shared) {
                for (let sa of this.shared[type]) {
                    sa.setTime(time);
                }
            }
            for (let sa of this.unique.values()) {
                sa.setTime(time);
            }
        };
        getUniqueAnimationMtx(_sprite) {
            this.currentUniqueId++;
            this.unique.set(this.currentUniqueId, new Script.SpriteAnimator(_sprite));
            return [this.unique.get(this.currentUniqueId).matrix, this.currentUniqueId];
        }
        getAnimationMtx(_sprite) {
            let type = `${_sprite.width}x${_sprite.height}in${_sprite.totalWidth}x${_sprite.totalHeight}with${_sprite.frames}at${_sprite.fps}and${_sprite.wrapAfter}`;
            if (!this.shared[type]) {
                let gameTime = Script.ƒ.Time.game.get();
                let animTime = Math.floor((_sprite.frames / _sprite.fps) * 1000);
                this.shared[type] = [
                    new Script.SpriteAnimator(_sprite, gameTime),
                    new Script.SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                    new Script.SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                    new Script.SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                ];
            }
            return this.shared[type][Math.floor(Math.random() * this.shared[type].length)].matrix;
        }
        removeUniqueAnimationMtx(_id) {
            this.unique.delete(_id);
        }
    }
    Script.AnimationManager = AnimationManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CardManager {
        currentlyActiveCards = [];
        deckCards = [];
        cumulativeEffects = { absolute: {}, multiplier: {} };
        defaultMaxActiveCardAmount = 10;
        currentMaxActiveCardAmount = 10;
        constructor() {
            this.updateEffects();
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        get activeCards() {
            return this.currentlyActiveCards;
        }
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let card of this.currentlyActiveCards) {
                card.update(time, this.cumulativeEffects);
            }
        };
        getEffectAbsolute(_effect, _modifier = this.cumulativeEffects) {
            return _modifier.absolute?.[_effect] ?? 0;
        }
        getEffectMultiplier(_effect, _modifier = this.cumulativeEffects) {
            return _modifier.multiplier?.[_effect] ?? 1;
        }
        modifyValuePlayer(_value, _effect, _localModifiers) {
            if (_localModifiers) {
                _value = (_value + this.getEffectAbsolute(_effect, _localModifiers)) * this.getEffectMultiplier(_effect, _localModifiers);
            }
            return (_value + this.getEffectAbsolute(_effect)) * this.getEffectMultiplier(_effect);
        }
        modifyValue(_value, _effect, _modifier) {
            if (!_modifier)
                return _value;
            return (_value + this.getEffectAbsolute(_effect, _modifier)) * this.getEffectMultiplier(_effect, _modifier);
        }
        updateEffects() {
            let cardEffects = [];
            for (let card of this.currentlyActiveCards) {
                let effects = card.effects;
                if (!effects)
                    continue;
                cardEffects.push(effects);
            }
            this.cumulativeEffects = this.combineEffects(...cardEffects);
            this.currentMaxActiveCardAmount = this.modifyValuePlayer(this.defaultMaxActiveCardAmount, Script.PassiveCardEffect.CARD_SLOTS);
        }
        combineEffects(..._effects) {
            let combined = { absolute: {}, multiplier: {} };
            for (let effectObj of _effects) {
                if (!effectObj)
                    continue;
                let effect;
                for (effect in effectObj.absolute) {
                    combined.absolute[effect] = (combined.absolute[effect] ?? 0) + effectObj.absolute[effect];
                }
                for (effect in effectObj.multiplier) {
                    combined.multiplier[effect] = (combined.multiplier[effect] ?? 1) * effectObj.multiplier[effect];
                }
            }
            return combined;
        }
        prevChosenCards = [];
        setCards(_selection, _deck) {
            this.currentlyActiveCards = [];
            this.deckCards = [];
            this.prevChosenCards = [];
            for (let cardId of _selection) {
                this.currentlyActiveCards.push(new Script.Card(Script.cards[cardId], cardId, 0));
            }
            for (let cardId of _deck) {
                this.deckCards.push(new Script.Card(Script.cards[cardId], cardId, 0));
            }
            this.updateEffects();
        }
        getCardsToChooseFrom(_maxAmt, _newCards = false) {
            let possibleCards = [...this.currentlyActiveCards];
            if (this.currentlyActiveCards.length < this.currentMaxActiveCardAmount) {
                possibleCards.push(...this.deckCards);
            }
            for (let i = 0; i < possibleCards.length; i++) {
                let card = possibleCards[i];
                if ((_newCards && this.prevChosenCards.includes(card)) ||
                    (card.level >= card.levels.length - 1 && this.activeCards.includes(card))) {
                    possibleCards.splice(i, 1);
                    i--;
                }
            }
            // shuffle options
            possibleCards = possibleCards
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            possibleCards.length = Math.min(Math.floor(_maxAmt), possibleCards.length);
            this.prevChosenCards = possibleCards;
            return possibleCards;
        }
        updateCardOrAdd(_cardId) {
            let card = this.currentlyActiveCards.find((card) => card.id === _cardId);
            if (card) {
                // update
                card.level = Math.min(card.level + 1, card.levels.length - 1);
                return this.updateEffects();
            }
            ;
            // add
            for (let i = 0; i < this.deckCards.length; i++) {
                let deckCard = this.deckCards[i];
                if (deckCard.id === _cardId) {
                    this.currentlyActiveCards.push(deckCard);
                    this.deckCards.splice(i, 1);
                    return this.updateEffects();
                }
            }
        }
    }
    Script.CardManager = CardManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Config {
        animations;
        constructor() {
        }
        async loadFiles() {
            const animationFilePath = "./Assets/Enemies/animations.json";
            this.animations = await (await fetch(animationFilePath)).json();
        }
        getAnimation(_enemyID, _animationID) {
            if (!this.animations[_enemyID])
                return undefined;
            if (!this.animations[_enemyID].animations[_animationID])
                return undefined;
            let anim = this.animations[_enemyID].animations[_animationID];
            if (!anim.material) {
                let materials = Script.ƒ.Project.getResourcesByType(Script.ƒ.Material);
                anim.material = materials.find(mat => mat.idResource === anim.materialString);
            }
            return anim;
        }
    }
    Script.Config = Config;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class DataManager {
        savedCollectionRaw = {};
        savedDeckRaw = [];
        savedSelectionRaw = [];
        async load() {
            this.savedCollectionRaw = this.catchObjChange(JSON.parse(localStorage.getItem("collection") ?? "{}"), () => { localStorage.setItem("collection", JSON.stringify(this.savedCollectionRaw)); });
            this.savedDeckRaw = this.catchArrayChange(JSON.parse(localStorage.getItem("deck") ?? "[]"), () => { localStorage.setItem("deck", JSON.stringify(this.savedDeckRaw)); });
            this.savedSelectionRaw = this.catchArrayChange(JSON.parse(localStorage.getItem("selection") ?? "[]"), () => { localStorage.setItem("selection", JSON.stringify(this.savedSelectionRaw)); });
        }
        catchObjChange(object, onChange) {
            const handler = {
                get(target, property, receiver) {
                    try {
                        return new Proxy(target[property], handler);
                    }
                    catch (err) {
                        return Reflect.get(target, property, receiver);
                    }
                },
                set(target, prop, value, receiver) {
                    let result = Reflect.set(target, prop, value, receiver);
                    if (result)
                        onChange();
                    return result;
                }
            };
            const handlerForArray = {};
            return new Proxy(object, handler);
        }
        catchArrayChange(object, onChange) {
            const handler = {
                set(target, prop, value, receiver) {
                    let result = Reflect.set(target, prop, value, receiver);
                    if (result)
                        onChange();
                    return result;
                }
            };
            return new Proxy(object, handler);
        }
    }
    Script.DataManager = DataManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    const pools = {
        "electronics": [
            ["microwave", "chair"],
            ["toaster", "closet"],
            ["motor"],
            ["ventilator"],
            ["chair"],
        ]
    };
    const rooms = {
        "electronics": [
            // room 1
            {
                duration: 20,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 5,
                    duration: 4,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
            },
            // room 2
            {
                duration: 30,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 6,
                    duration: 5,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 1 }
                        ],
                        amount: 4,
                        duration: 10,
                    }
                ]
            },
            // room 3
            {
                duration: 40,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 8,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 1, weight: 4 },
                            { pool: 0, elite: true },
                        ],
                        amount: 6,
                        duration: 10,
                    }
                ],
            },
            // room bonus
            {
                duration: Infinity,
                reward: true,
            },
            // room 4
            {
                duration: 50,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 55 },
                        { pool: 1, weight: 25 },
                        { pool: 2, weight: 20 },
                    ],
                    amount: 10,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 2 },
                        ],
                        amount: 4,
                        duration: 10,
                    }
                ],
            },
            // room 5
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 1,
                    duration: 60,
                    enemies: ["microwave-boss"],
                },
                waveAmount: 1
            },
            //room 6
            {
                duration: 60,
                bonus: {
                    multiplier: {
                        health: 1.5
                    }
                }
            }
        ]
    };
    class EnemyManager {
        provider;
        characterManager;
        config;
        enemyScripts = [];
        enemies = [];
        enemyGraph;
        enemyNode;
        currentWave = -1;
        currentRoom = -1;
        currentArea = "electronics";
        currentWaveEnd = 0;
        currentRoomEnd = 0;
        currentXP = 0;
        xpElement;
        timeElement = document.getElementById("timer");
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            document.addEventListener("interactiveViewportStarted", this.start);
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            Script.ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, this.loaded);
            this.characterManager = provider.get(Script.CharacterManager);
            this.config = provider.get(Script.Config);
            document.addEventListener("keydown", this.debugEvents);
            document.getElementById("debug-next-wave").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-end-room").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-next-room").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-kill-enemies").addEventListener("touchstart", this.debugButtons);
            this.xpElement = document.getElementById("xp-display");
        }
        setup() {
            Script.ƒ.Debug.log("EnemyManager setup");
        }
        start = (_event) => {
            let viewport = _event.detail;
            this.enemyNode = viewport.getBranch().getChildrenByName("enemies")[0];
        };
        loaded = async () => {
            this.enemyGraph = await Script.ƒ.Project.getResourcesByName("enemy")[0];
        };
        update = () => {
            if (Script.gameState === Script.GAMESTATE.PAUSED)
                return;
            if (Script.gameState === Script.GAMESTATE.IDLE)
                return;
            let character = this.characterManager.character;
            if (!character)
                return;
            this.roomManagement();
            // update enemies
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let enemy of this.enemyScripts) {
                enemy.update(character.node.mtxWorld.translation, time);
            }
            // dmg numbers
            for (let dmg of this.dmgDisplayElements) {
                let pos = Script.viewport.pointWorldToClient(dmg[1]);
                dmg[0].style.top = pos.y + "px";
                dmg[0].style.left = pos.x + "px";
            }
        };
        nextWaveOverride = false;
        async roomManagement() {
            if (Script.gameState === Script.GAMESTATE.ROOM_CLEAR)
                return;
            let currentTime = Script.ƒ.Time.game.get();
            let nextWave = this.getWave(this.currentArea, this.currentRoom, this.currentWave + 1);
            // should we start a new wave?
            if (nextWave && (this.nextWaveOverride ||
                this.currentWave < 0 || // no wave yet
                this.currentWaveEnd < currentTime || // wave timer is up
                this.enemies.length <= (nextWave?.minEnemiesOverride ?? 0) // wave min enemies are reached
            )) {
                this.nextWaveOverride = false;
                if (await this.spawnWave(nextWave)) {
                    this.currentWave++;
                }
            }
            // no more enenmies left, everything was killed
            // @ts-expect-error
            if (this.enemies.length === 0 && Script.gameState !== Script.GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }
            // is the rooms timer up?
            // TODO special cases for boss rooms and no-damage runs
            // @ts-expect-error
            if (this.currentRoomEnd < currentTime && Script.gameState !== Script.GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }
            // update timer
            this.timeElement.innerText = `room ${this.currentRoom} ends in: ${Math.floor(this.currentRoomEnd - currentTime)}ms - wave ${this.currentWave} ends in: ${Math.floor(this.currentWaveEnd - currentTime)}ms`;
        }
        async endRoom(_cleanup = false) {
            Script.gameState = Script.GAMESTATE.PAUSED;
            while (this.enemyScripts.length > 0) {
                this.enemyScripts[0].hit({ damage: Infinity });
            }
            Script.provider.get(Script.ProjectileManager).cleanup();
            console.log(`Room ${this.currentRoom} done. Press N to continue.`);
            Script.ƒ.Time.game.setScale(0);
            if (!_cleanup) {
                // collect XP
                while (this.currentXP >= 100) {
                    this.currentXP -= 100;
                    await this.characterManager.upgradeCards();
                }
                this.nextRoom();
            }
        }
        nextRoom() {
            Script.ƒ.Time.game.setScale(1);
            this.currentRoom++;
            this.currentWave = -1;
            this.currentWaveEnd = 0;
            if (rooms[this.currentArea].length <= this.currentRoom) {
                console.log("LAST ROOM CLEARED");
                Script.gameState = Script.GAMESTATE.IDLE;
                return;
            }
            let room = rooms[this.currentArea][this.currentRoom];
            this.currentRoomEnd = Script.ƒ.Time.game.get() + room.duration * 1000;
            Script.gameState = Script.GAMESTATE.PLAYING;
            if (room.reward) {
                //TODO spawn reward stuff
            }
        }
        async spawnWave(wave) {
            if (!wave) {
                this.currentWaveEnd = Infinity;
                return false;
            }
            console.log(`spawning wave ${this.currentWave + 1} in room ${this.currentRoom}`);
            this.currentWaveEnd = Script.ƒ.Time.game.get() + wave.duration * 1000;
            let { totalWeight, enemies, elites } = this.getEnemyList(wave);
            for (let elite of elites) {
                this.spawnEnemy(elite);
            }
            for (let i = 0; i < wave.amount; i++) {
                let x = Math.random() * totalWeight;
                for (let enemy of enemies) {
                    x -= enemy.weight;
                    if (x <= 0) {
                        await this.spawnEnemy(enemy.name);
                        break;
                    }
                }
            }
            return true;
        }
        getWave(_area, _room, _wave) {
            if (!rooms[_area])
                return undefined;
            if (!rooms[_area][_room])
                return undefined;
            if (rooms[_area][_room].waveAmount !== undefined && rooms[_area][_room].waveAmount <= _wave)
                return undefined;
            return rooms[_area][_room].waves?.[_wave] ?? rooms[_area][_room].defaultWave;
        }
        poolSelections = [];
        getEnemyList(_wave) {
            let totalWeight = 0;
            let enemies = [];
            let elites = [];
            for (let enemy of _wave.enemies) {
                if (typeof enemy === "string") {
                    enemies.push({ name: enemy, weight: 1 });
                    totalWeight++;
                }
                else {
                    if (!this.poolSelections[enemy.pool]) {
                        this.poolSelections[enemy.pool] = pools[this.currentArea][enemy.pool][Math.floor(Math.random() * pools[this.currentArea][enemy.pool].length)];
                    }
                    let name = this.poolSelections[enemy.pool];
                    if (enemy.elite) {
                        elites.push(name);
                    }
                    else {
                        enemy.weight = enemy.weight ?? 1;
                        enemies.push({ name, weight: enemy.weight });
                        totalWeight += enemy.weight;
                    }
                }
            }
            return { totalWeight, enemies, elites };
        }
        async spawnEnemy(_enemy, _relativePosition = Script.ƒ.Vector3.NORMALIZATION(new Script.ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5)) {
            let newEnemyGraphInstance = Script.ƒ.Recycler.get(Script.EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(_relativePosition);
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Script.Enemy);
            enemyScript.setup(Script.enemies[_enemy]);
            this.enemyScripts.push(enemyScript);
        }
        debugEvents = (_event) => {
            switch (_event.key) {
                case "v":
                    this.nextWaveOverride = true;
                    break;
                case "b":
                    this.endRoom();
                    break;
                case "n":
                    this.nextRoom();
                    break;
                case "k":
                    this.debugRemoveEnemies();
                    break;
                case "l":
                    this.characterManager.upgradeCards();
                    break;
                case "Escape":
                    if (Script.gameState === Script.GAMESTATE.PLAYING || Script.gameState === Script.GAMESTATE.ROOM_CLEAR)
                        this.provider.get(Script.MenuManager).openPauseMenu();
                    break;
            }
        };
        debugButtons = (_event) => {
            switch (_event.target.id) {
                case "debug-next-wave":
                    this.nextWaveOverride = true;
                    break;
                case "debug-end-room":
                    this.endRoom();
                    break;
                case "debug-next-room":
                    this.nextRoom();
                    break;
                case "debug-kill-enemies":
                    this.debugRemoveEnemies();
                    break;
            }
        };
        debugRemoveEnemies(_amt = 5) {
            for (let i = 0; i < 5; i++) {
                if (this.enemyScripts.length > 0) {
                    this.enemyScripts[0].hit({ damage: Infinity });
                }
            }
        }
        async spawnEnemies() {
            if (this.enemies.length >= 2) {
                return;
            }
            // debug: spawn two different enemies
            /*
            let newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies["toaster"]);
            this.enemyScripts.push(enemyScript);

            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies["chair"]);
            this.enemyScripts.push(enemyScript);


            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation.clone;
            newEnemyGraphInstance.mtxLocal.translate(new ƒ.Vector3(0, 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: this.config.getAnimation("motor", "move"),
                speed: 3,
                directionOverride: ƒ.Vector3.Y(-1),
            });
            this.enemyScripts.push(enemyScript);
            */
        }
        removeEnemy(_enemy) {
            let index = this.enemyScripts.findIndex((n) => n === _enemy);
            if (index >= 0) {
                this.enemyScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(...this.enemies.splice(index, 1));
            }
            _enemy.node.getParent()?.removeChild(_enemy.node);
        }
        getEnemy(_mode, _pos = Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation, _exclude = [], _maxDistance = 20) {
            if (!this.enemies || this.enemies.length === 0)
                return undefined;
            _maxDistance *= _maxDistance;
            let enemies = [...this.enemies];
            if (_mode === Script.ProjectileTargetMode.RANDOM) {
                //TODO: make sure chosen enemy is visible on screen
                while (enemies.length > 0) {
                    let index = Math.floor(Math.random() * this.enemies.length);
                    let enemy = this.enemies.splice(index, 1)[0];
                    if (_exclude.includes(enemy))
                        continue;
                    if (Script.ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, _pos).magnitudeSquared <= _maxDistance) {
                        return enemy;
                    }
                }
            }
            else if (_mode === Script.ProjectileTargetMode.CLOSEST || _mode === Script.ProjectileTargetMode.FURTHEST) {
                for (let e of enemies) {
                    e.distanceToCharacter = Script.ƒ.Vector3.DIFFERENCE(e.mtxWorld.translation, _pos).magnitudeSquared;
                }
                enemies.sort((a, b) => a.distanceToCharacter - b.distanceToCharacter);
                if (_mode === Script.ProjectileTargetMode.FURTHEST)
                    enemies.reverse();
                for (let i = 0; i < enemies.length; i++) {
                    if (!_exclude.includes(enemies[i]))
                        return (enemies[i]);
                }
            }
            return undefined;
        }
        dmgDisplayElements = [];
        displayDamage(_amt, _pos) {
            if (!isFinite(_amt))
                return;
            let dmgText = _amt.toFixed(0);
            let textElement = document.createElement("span");
            textElement.classList.add(("dmg-number"));
            textElement.innerText = dmgText;
            document.documentElement.appendChild(textElement);
            this.dmgDisplayElements.push([textElement, _pos.clone]);
            setTimeout(() => {
                document.documentElement.removeChild(textElement);
                this.dmgDisplayElements.shift();
            }, 1000);
        }
        reset() {
            this.endRoom(true);
            this.currentXP = 0;
            this.addXP(0);
            this.currentWave = -1;
            this.currentRoom = -1;
            this.currentRoomEnd = 0;
            this.currentWaveEnd = 0;
        }
        addXP(_xp) {
            this.currentXP += _xp;
            this.xpElement.innerText = this.currentXP.toString();
        }
    }
    Script.EnemyManager = EnemyManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let MenuType;
    (function (MenuType) {
        MenuType[MenuType["NONE"] = 0] = "NONE";
        MenuType[MenuType["MAIN"] = 1] = "MAIN";
        MenuType[MenuType["COLLECTION"] = 2] = "COLLECTION";
        MenuType[MenuType["SETTINGS"] = 3] = "SETTINGS";
        MenuType[MenuType["PAUSE"] = 4] = "PAUSE";
        MenuType[MenuType["CARD_UPGRADE"] = 5] = "CARD_UPGRADE";
        MenuType[MenuType["END_CONFIRM"] = 6] = "END_CONFIRM";
    })(MenuType = Script.MenuType || (Script.MenuType = {}));
    class MenuManager {
        menus = new Map();
        prevGameState = Script.GAMESTATE.PLAYING;
        setup() {
            let main = document.getElementById("main-menu-overlay");
            this.menus.set(MenuType.MAIN, main);
            this.menus.set(MenuType.COLLECTION, document.getElementById("collection-overlay"));
            this.menus.set(MenuType.SETTINGS, document.getElementById("settings-overlay"));
            this.menus.set(MenuType.PAUSE, document.getElementById("pause-overlay"));
            this.menus.set(MenuType.CARD_UPGRADE, document.getElementById("card-upgrade-popup"));
            this.menus.set(MenuType.END_CONFIRM, document.getElementById("end-confirm"));
            main.querySelector("#main-menu-deck").addEventListener("click", () => { this.openMenu(MenuType.COLLECTION); });
            main.querySelector("#main-menu-game").addEventListener("click", () => {
                this.startGame();
            });
            document.getElementById("game-overlay-pause").addEventListener("click", () => {
                this.openPauseMenu();
            });
            document.getElementById("pause-resume").addEventListener("click", () => {
                this.openMenu(MenuType.NONE);
                Script.gameState = this.prevGameState;
                Script.ƒ.Time.game.setScale(1);
            });
            document.getElementById("pause-quit").addEventListener("click", () => { this.openMenu(MenuType.END_CONFIRM); });
            document.getElementById("end-abort").addEventListener("click", () => { this.openPauseMenu(); });
            document.getElementById("end-quit").addEventListener("click", () => {
                this.openMenu(MenuType.MAIN);
                //TODO handle game abort.
                Script.provider.get(Script.EnemyManager).reset();
            });
        }
        openMenu(_menu) {
            for (let menu of this.menus.entries()) {
                if (menu[0] === _menu) {
                    menu[1].classList.remove("hidden");
                }
                else {
                    menu[1].classList.add("hidden");
                }
            }
        }
        async startGame() {
            this.openMenu(MenuType.NONE);
            Script.gameState = Script.GAMESTATE.ROOM_CLEAR;
            let dataManager = Script.provider.get(Script.DataManager);
            let cardManager = Script.provider.get(Script.CardManager);
            cardManager.setCards([], dataManager.savedDeckRaw);
            let character = Script.provider.get(Script.CharacterManager).character;
            character?.reset();
            await Script.provider.get(Script.CharacterManager).upgradeCards(5, true, 1);
            Script.ƒ.Time.game.setScale(1);
            Script.provider.get(Script.EnemyManager).nextRoom();
        }
        openPauseMenu() {
            if (Script.gameState !== Script.GAMESTATE.PAUSED)
                this.prevGameState = Script.gameState;
            Script.gameState = Script.GAMESTATE.PAUSED;
            Script.ƒ.Time.game.setScale(0);
            this.openMenu(MenuType.PAUSE);
            let cardsForPauseMenu = [];
            let cm = Script.provider.get(Script.CardManager);
            let element = document.getElementById("pause-overlay-cards");
            for (let card of cm.activeCards) {
                let cv = new Script.CardVisual(card, element, card.id, card.level);
                cardsForPauseMenu.push(cv.htmlElement);
                cv.htmlElement.addEventListener("click", this.openPauseCardPopup);
            }
            element.replaceChildren(...cardsForPauseMenu);
        }
        openPauseCardPopup = (_event) => {
        };
    }
    Script.MenuManager = MenuManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class ProjectileManager {
        provider;
        characterManager;
        config;
        projectileScripts = [];
        projectiles = [];
        static projectileGraph;
        static aoeGraph;
        static hitZoneGraph;
        projectilesNode;
        hitzoneNode;
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            document.addEventListener("interactiveViewportStarted", this.start);
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            Script.ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, this.loaded);
            this.characterManager = provider.get(Script.CharacterManager);
            this.config = provider.get(Script.Config);
        }
        setup() {
            Script.ƒ.Debug.log("EnemyManager setup");
        }
        start = (_event) => {
            let viewport = _event.detail;
            this.projectilesNode = viewport.getBranch().getChildrenByName("projectiles")[0];
            this.hitzoneNode = viewport.getBranch().getChildrenByName("hitzones")[0];
        };
        loaded = async () => {
            ProjectileManager.projectileGraph = await Script.ƒ.Project.getResourcesByName("projectile")[0];
            ProjectileManager.hitZoneGraph = await Script.ƒ.Project.getResourcesByName("hitzone")[0];
            ProjectileManager.aoeGraph = await Script.ƒ.Project.getResourcesByName("aoe")[0];
        };
        update = () => {
            if (Script.gameState === Script.GAMESTATE.PAUSED)
                return;
            if (Script.gameState === Script.GAMESTATE.IDLE)
                return;
            let character = this.characterManager.character;
            if (!character)
                return;
            // update projectiles
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let projectile of this.projectileScripts) {
                projectile.update(character.node.mtxWorld.translation, time);
            }
        };
        removeProjectile(_projectile) {
            let index = this.projectileScripts.findIndex((n) => n === _projectile);
            if (index >= 0) {
                this.projectileScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(...this.projectiles.splice(index, 1));
            }
            _projectile.node.getParent().removeChild(_projectile.node);
        }
        removeAOE(_aoe) {
            let index = this.projectileScripts.findIndex((n) => n === _aoe);
            if (index >= 0) {
                this.projectileScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(...this.projectiles.splice(index, 1));
            }
            _aoe.node.getParent().removeChild(_aoe.node);
        }
        async createProjectile(_options, _position, _modifiers, _parent = this.projectilesNode) {
            let pgi = Script.ƒ.Recycler.get(Script.ProjectileGraphInstance);
            if (!pgi.initialized) {
                await pgi.set(ProjectileManager.projectileGraph);
            }
            pgi.mtxLocal.translation = Script.ƒ.Vector3.SUM(_position);
            let p = pgi.getComponent(Script.ProjectileComponent);
            _parent.addChild(pgi);
            this.projectileScripts.push(p);
            this.projectiles.push(pgi);
            p.setup(_options, _modifiers);
        }
        async createAOE(_options, _position, _modifiers, _parent = this.projectilesNode) {
            let aoeGi = Script.ƒ.Recycler.get(Script.AOEGraphInstance);
            if (!aoeGi.initialized) {
                await aoeGi.set(ProjectileManager.aoeGraph);
            }
            let a = aoeGi.getComponent(Script.AOE);
            a.setup(_options, _modifiers);
            aoeGi.mtxLocal.translation = Script.ƒ.Vector3.SUM(_position);
            _parent.addChild(aoeGi);
            this.projectileScripts.push(a);
            this.projectiles.push(aoeGi);
        }
        async createHitZone(_position, _size = 1, _parent = this.hitzoneNode) {
            let hz = Script.ƒ.Recycler.get(Script.HitZoneGraphInstance);
            if (!hz.initialized) {
                await hz.set(ProjectileManager.hitZoneGraph);
            }
            hz.getComponent(Script.ƒ.ComponentMesh).mtxPivot.scaling = Script.ƒ.Vector3.ONE(_size);
            hz.mtxLocal.translation = _position;
            _parent.addChild(hz);
            return hz;
        }
        cleanup() {
            Script.ƒ.Recycler.storeMultiple(...this.projectiles);
            for (let projectile of this.projectileScripts) {
                projectile.node.getParent().removeChild(projectile.node);
                projectile.removeAttachments();
            }
            this.projectiles.length = 0;
            this.projectileScripts.length = 0;
        }
    }
    Script.ProjectileManager = ProjectileManager;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map