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
            lng: "de",
            fallbackLng: "en",
            resources,
            debug: true,
        });
    }
    Script.initI18n = initI18n;
    const elementsWithLangData = [];
    function updateI18nInDOM() {
        if (elementsWithLangData.length > 0) {
            for (let element of elementsWithLangData) {
                element.innerText = i18next.t(element.dataset.langText);
            }
            updateCardsInDeck();
            return;
        }
        let elementsToCheck = [document.documentElement];
        while (elementsToCheck.length > 0) {
            let element = elementsToCheck.pop();
            elementsToCheck.push(...Array.from(element.children));
            if (element.dataset?.langText) {
                elementsWithLangData.push(element);
                element.innerText = i18next.t(element.dataset.langText);
            }
        }
    }
    Script.updateI18nInDOM = updateI18nInDOM;
    function updateCardsInDeck() {
        let overlay = document.getElementById("collection-overlay");
        overlay.classList.remove("hidden");
        Script.provider.get(Script.CardCollection).updateVisuals(true);
    }
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
        isSpawning;
        untargetable;
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
        isMoving() {
            return this.movementVector.magnitudeSquared === 0;
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
        async upgradeCards(_amountOverride, _newCards = false, _rerolls = 0, _weaponsOnly = false) {
            let firstPlaythroughDone = Script.provider.get(Script.DataManager).firstPlaythroughDone;
            if (!firstPlaythroughDone) {
                _rerolls = 0;
            }
            return new Promise((resolve) => {
                let rerollButton = document.getElementById("card-upgrade-popup-reroll");
                const reroll = async () => {
                    rerollButton.removeEventListener("click", reroll);
                    if (_rerolls > 0) {
                        await this.upgradeCards(_amountOverride, _newCards, _rerolls - 1, _weaponsOnly);
                    }
                    resolve();
                };
                rerollButton.querySelector("span:nth-child(2n)").innerText = ` (${_rerolls})`;
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
                let cards = cm.getCardsToChooseFrom(cardAmount, _newCards, _weaponsOnly);
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
        await Script.initI18n("en", "de");
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
        PassiveCardEffect["EFFECT_SIZE"] = "effectSize";
        PassiveCardEffect["PROJECTILE_PIERCING"] = "projectilePiercing";
        PassiveCardEffect["DAMAGE"] = "damage";
        PassiveCardEffect["EFFECT_DURATION"] = "effectDuration";
        PassiveCardEffect["WEAPON_DURATION"] = "weaponDuration";
        PassiveCardEffect["KNOCKBACK"] = "knockback";
        PassiveCardEffect["CRIT_CHANCE"] = "criticalHitChance";
        PassiveCardEffect["CRIT_DAMAGE"] = "critialHitDamage";
        PassiveCardEffect["HEALTH"] = "health";
        PassiveCardEffect["REGENERATION"] = "regeneration";
        PassiveCardEffect["REGENERATION_RELATIVE"] = "regenerationRelativeToMaxHealth";
        PassiveCardEffect["COLLECTION_RADIUS"] = "collectionRadius";
        PassiveCardEffect["DAMAGE_REDUCTION"] = "damageReduction";
        PassiveCardEffect["CARD_SLOTS"] = "cardSlots";
        PassiveCardEffect["CARD_UPGRADE_SLOTS"] = "cardUpgradeSlots";
        PassiveCardEffect["MOVEMENT_SPEED"] = "movementSpeed";
        PassiveCardEffect["XP"] = "xp";
        PassiveCardEffect["ENEMY_SIZE"] = "enemySize";
        PassiveCardEffect["ENEMY_AMOUNT"] = "enemyAmount";
        PassiveCardEffect["CAMERA_FOV"] = "cameraFOV";
        PassiveCardEffect["DODGE"] = "dodge";
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
    let HitType;
    (function (HitType) {
        HitType["PROJECTILE"] = "projectile";
        HitType["AOE"] = "aoe";
        HitType["MELEE"] = "melee";
    })(HitType = Script.HitType || (Script.HitType = {}));
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
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.EFFECT_SIZE, _modifier);
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
                    collision.node.getComponent(Script.Enemy).hit({ damage: this.damage, stun: this.stunDuration, type: Script.HitType.AOE });
                }
                else if (this.target === Script.ProjectileTarget.PLAYER && collision.node.name === "character") {
                    let char = Script.provider.get(Script.CharacterManager).character;
                    char.hit({ damage: this.damage, stun: this.stunDuration, type: Script.HitType.AOE });
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
        dontNormalizeMovement;
        hazardZone;
        prevDistance;
        modifiers = {};
        functions = {};
        static defaults = {
            targetPosition: undefined,
            direction: new Script.ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 1,
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
            dontNormalizeMovement: false,
            sprite: ["projectile", "toast"],
            methods: {},
            hitboxSize: 1,
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
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.functions = _options.methods;
            if (this.functions.beforeSetup) {
                this.functions.beforeSetup.call(this, _options, _modifier);
            }
            let limitation = undefined;
            if (_options.target === Script.ProjectileTarget.ENEMY) {
                if (Script.provider.get(Script.CharacterManager).isMoving())
                    limitation = "stopped";
            }
            let cm = Script.provider.get(Script.CardManager);
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = cm.modifyValue(_options.damage, Script.PassiveCardEffect.DAMAGE, _modifier, limitation);
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.PROJECTILE_SIZE, _modifier, limitation);
            this.speed = cm.modifyValue(_options.speed, Script.PassiveCardEffect.PROJECTILE_SPEED, _modifier, limitation);
            this.range = cm.modifyValue(_options.range, Script.PassiveCardEffect.PROJECTILE_RANGE, _modifier, limitation);
            this.piercing = cm.modifyValue(_options.piercing, Script.PassiveCardEffect.PROJECTILE_PIERCING, _modifier, limitation);
            this.target = _options.target;
            this.artillery = _options.artillery;
            this.rotateInDirection = _options.rotateInDirection;
            this.diminishing = _options.diminishing;
            this.impact = _options.impact;
            this.targetMode = _options.targetMode;
            this.lockedToEntity = _options.lockedToEntity;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite);
            this.node.mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.size);
            this.node.getComponent(Script.ƒ.ComponentRigidbody).mtxPivot.scaling = Script.ƒ.Vector3.ONE(_options.hitboxSize);
            this.hazardZone = undefined;
            this.prevDistance = Infinity;
            this.modifiers = _modifier;
            //TODO rotate projectile towards flight direction
            if (this.artillery) {
                let pos = new Script.ƒ.Vector3();
                if (this.target === Script.ProjectileTarget.PLAYER) {
                    pos = Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation.clone;
                }
                else if (this.target === Script.ProjectileTarget.ENEMY) {
                    pos = Script.provider.get(Script.EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                    if (!pos)
                        return this.remove();
                }
                let hzSize = this.size;
                for (let impact of this.impact) {
                    hzSize = Math.max(hzSize, cm.modifyValue(1, Script.PassiveCardEffect.PROJECTILE_SIZE, impact.modifiers));
                }
                let hz = await Script.provider.get(Script.ProjectileManager).createHitZone(pos, hzSize);
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
            this.node.getComponent(Script.ƒ.ComponentMesh).mtxPivot.rotation = new Script.ƒ.Vector3();
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
            if (dir.magnitudeSquared > 0 && !this.dontNormalizeMovement)
                dir.normalize(Math.min(1, _frameTimeInSeconds) * this.speed);
            else
                dir.scale(Math.min(1, _frameTimeInSeconds) * this.speed);
            this.node.mtxLocal.translate(dir);
            this.range -= dir.magnitude;
            if (this.range < 0) {
                this.remove();
            }
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
            if (this.node.cmpTransform.mtxLocal.translation.magnitudeSquared > 18500 /* 15 width, 25 height playarea => max magnSqr = 850 */) {
                this.remove();
            }
        }
        rotate() {
            if (!this.rotateInDirection)
                return;
            let refVector = Script.ƒ.Vector3.X(1);
            let angle = Math.acos(Script.ƒ.Vector3.DOT(this.direction, refVector) / (refVector.magnitude * this.direction.magnitude));
            angle = angle * 180 / Math.PI * Math.sign(this.direction.y);
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
            if (_hitable?.node?.untargetable)
                return;
            if (this.functions.preHit)
                this.functions.preHit.call(this, _hitable);
            _hitable.hit({ damage: this.damage, stun: this.stunDuration, type: Script.HitType.PROJECTILE });
            this.piercing--;
            if (this.functions.postHit)
                this.functions.postHit.call(this, _hitable);
            if (this.piercing < 0)
                this.remove();
        }
        remove() {
            Script.provider.get(Script.ProjectileManager).removeProjectile(this);
            this.removeHazardZone();
        }
    }
    Script.ProjectileComponent = ProjectileComponent;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.projectiles = {
        "genericBullet": {
            damage: 1,
            speed: 0.8,
            size: 0.5,
            rotateInDirection: true,
            sprite: ["projectile", "genericBullet"],
            target: Script.ProjectileTarget.PLAYER,
        },
        "flatToast": {
            damage: 1,
            speed: 1,
            rotateInDirection: true,
            sprite: ["projectile", "flatToast"],
            target: Script.ProjectileTarget.PLAYER,
            hitboxSize: 0.5,
        },
        "toastEnemy": {
            damage: 1,
            speed: 20,
            artillery: true,
            size: 0.5,
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
            size: 0.7,
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
            dontNormalizeMovement: true,
            methods: {
                afterSetup: function () {
                    this.direction = new Script.ƒ.Vector3(0.5 - Math.random() * 1, 1, 0).normalize();
                    this.maxY = -1 * this.direction.y;
                },
                preMove: function (_fts) {
                    this.direction.y = Math.max(this.maxY, this.direction.y - (_fts * (10 / this.speed)));
                }
            }
        },
        "discusPlayer": {
            damage: 5,
            speed: 10,
            range: 15,
            size: 0.5,
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
                    this.direction = new Script.ƒ.Vector3(Math.random() - 0.5, Math.random() - 0.5);
                },
                preUpdate: function (_charPosition, _frameTimeInSeconds) {
                    if (!this.tracking) {
                        this.discusTimer = (this.discusTimer ?? 0) - _frameTimeInSeconds;
                        if (this.discusTimer < 0) {
                            this.functions.getNewTarget.call(this);
                        }
                        return;
                    }
                    let target = this.tracking?.target;
                    if (!target?.getParent()) {
                        this.functions.getNewTarget.call(this);
                    }
                },
                postHit: function (_hitable) {
                    this.functions.getNewTarget.call(this, _hitable);
                },
                //@ts-expect-error
                getNewTarget: function (_hitable) {
                    let newEnemy = Script.provider.get(Script.EnemyManager).getEnemy(Script.ProjectileTargetMode.CLOSEST, _hitable?.node.mtxWorld.translation, [_hitable?.node]);
                    if (newEnemy) {
                        this.tracking = {
                            stopTrackingAfter: Infinity,
                            startTrackingAfter: 0,
                            stopTrackingInRadius: 0,
                            strength: 1,
                            target: newEnemy,
                        };
                    }
                    else {
                        this.tracking = undefined;
                        this.discusTimer = 0.5;
                    }
                },
            }
        },
        "penPlayer": {
            damage: 2,
            speed: 20,
            range: 4,
            size: 0.5,
            sprite: ["projectile", "pen"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "codeCivilPlayer": {
            damage: 3,
            speed: 20,
            range: 20,
            size: 0.5,
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
            range: 12,
            size: 0.6,
            rotateInDirection: true,
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
            range: 6,
            size: 0.5,
            sprite: ["projectile", "chisel"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "needlePlayer": {
            damage: 5,
            speed: 0,
            size: 1,
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
            sprite: ["aoe", "toastexplosion"],
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
            size: 2.5,
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
            size: 3,
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
            size: 3,
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
        isWeapon;
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
            this.isWeapon = _init.isWeapon;
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
            let limitation = "";
            if (!this.levels[this.level].activeEffects || !this.levels[this.level].activeEffects.length)
                return;
            for (let effect of this.levels[this.level].activeEffects) {
                if (isNaN(effect.currentCooldown))
                    effect.currentCooldown = effect.cooldown;
                if (effect.cooldownBasedOnDistance) {
                    effect.currentCooldown -= this.#charm.getMovement().magnitude * this.#cm.modifyValuePlayer(this.#charm.character.speed, Script.PassiveCardEffect.MOVEMENT_SPEED) * _time;
                }
                else {
                    effect.currentCooldown -= _time;
                }
                if (effect.currentCooldown <= 0) {
                    if (Script.provider.get(Script.CharacterManager).isMoving())
                        limitation = "stopped";
                    effect.currentCooldown = this.#cm.modifyValuePlayer(effect.cooldown, Script.PassiveCardEffect.COOLDOWN_REDUCTION, effect.modifiers, limitation);
                    switch (effect.type) {
                        case "projectile":
                            let amount = this.#cm.modifyValuePlayer(effect.amount ?? 1, Script.PassiveCardEffect.PROJECTILE_AMOUNT, effect.modifiers, limitation);
                            for (let i = 0; i < amount; i++) {
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
        maxDeckSize = 10;
        maxSelectedSize = 0;
        deckElement;
        // private selectionElement: HTMLElement;
        collectionElement;
        popupElement;
        popupButtons;
        deckSelectionSizeElement;
        mainMenuDeckAmountElement;
        mainMenuPlayButton;
        selectedCard;
        cardVisuals = new Map();
        constructor(provider) {
            let dm = provider.get(Script.DataManager);
            this.collection = dm.savedCollectionRaw;
            this.deck = dm.savedDeckRaw;
            // this.selection = dm.savedSelectionRaw;
            // unlock cards
            let fpd = provider.get(Script.DataManager).firstPlaythroughDone;
            if (!fpd) {
                for (let cardId in Script.cards) {
                    let card = Script.cards[cardId];
                    if (card.unlock && !this.collection[cardId]) {
                        if (card.unlock.firstRun) {
                            // unlock and setup cards for first playthrough
                            this.collection[cardId] = { amount: 1, lvl: 0 };
                            this.addCardToDeck(cardId, false);
                        }
                        if (card.unlock.afterFirstRun) {
                            this.collection[cardId] = { amount: 1, lvl: 0 };
                        }
                    }
                }
            }
        }
        setup() {
            // this.selectionElement = document.getElementById("selection");
            this.deckElement = document.getElementById("deck");
            this.collectionElement = document.getElementById("collection-wrapper");
            this.popupElement = document.getElementById("card-popup");
            this.deckSelectionSizeElement = document.getElementById("deck-selection-size");
            this.mainMenuDeckAmountElement = document.getElementById("main-menu-deck-amount");
            this.mainMenuPlayButton = document.getElementById("main-menu-game");
            this.popupButtons = {
                deckFrom: document.getElementById("card-popup-deck-from"),
                // deckToFrom: <HTMLButtonElement>document.getElementById("card-popup-deck-to-from"),
                deckTo: document.getElementById("card-popup-deck-to"),
                // selectionFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-from"),
                // selectionToFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-to-from"),
                // selectionTo: <HTMLButtonElement>document.getElementById("card-popup-selection-to"),
            };
            document.getElementById("unlock-all").addEventListener("click", () => {
                for (let cardId in Script.cards) {
                    if (!this.collection[cardId]) {
                        this.collection[cardId] = { amount: 1, lvl: 0 };
                    }
                }
                this.updateVisuals(true);
            });
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
                // this.addCardToCollection(cardID, 1);
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
                //     this.popupButtons.deckToFrom.classList.remove("hidden");
                //     this.popupButtons.selectionFrom.classList.remove("hidden");
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
        addCardToDeck(_name, _updateVisuals = true) {
            this.addToArray(_name, this.deck);
            // this.removeCardFromSelection(_name, false);
            if (_updateVisuals)
                this.updateVisuals();
        }
        removeCardFromDeck(_name, _updateVisuals = true) {
            this.removeFromArray(_name, this.deck);
            if (_updateVisuals)
                this.updateVisuals();
        }
        unlockCards(_amount) {
            let unlockableCards = [];
            for (let cardId in Script.cards) {
                let card = Script.cards[cardId];
                if (card.unlock?.possible && !this.collection[cardId]) {
                    unlockableCards.push(cardId);
                }
            }
            unlockableCards.sort(() => Math.random() - 0.5);
            unlockableCards.length = Math.min(Math.floor(_amount), unlockableCards.length);
            for (let card of unlockableCards) {
                this.addCardToCollection(card, 1);
            }
            return unlockableCards;
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
                if (_fullReset)
                    visual.updateTexts();
                allCardsForCollection.push(visual.htmlElement);
                visual.htmlElement.classList.remove("locked", "selected");
            }
            for (let cardID in Script.cards) {
                if (this.collection[cardID])
                    continue;
                let visual = this.cardVisuals.get(cardID);
                if (!visual)
                    continue;
                if (_fullReset)
                    visual.updateTexts();
                allCardsForCollection.push(visual.htmlElement);
                if (!_fullReset) {
                    visual.htmlElement.classList.add("locked");
                }
            }
            // for debugging we're adding a bunch of empty stuff to fill up to 100.
            // this.fillWithPlaceholders(allCardsForCollection, 100);
            if (_fullReset && this.collectionElement) {
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
            this.mainMenuDeckAmountElement.innerText = `${this.deck.length /* + this.selection.length */}/${this.maxDeckSize + this.maxSelectedSize}`;
            if ((this.deck.length < this.maxDeckSize + this.maxSelectedSize) && Script.provider.get(Script.DataManager).firstPlaythroughDone) {
                this.mainMenuPlayButton.disabled = true;
            }
            else {
                this.mainMenuPlayButton.disabled = false;
            }
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
        #parent;
        #disableCircleType;
        #level;
        #rarity;
        #circleTyper;
        constructor(_card, _parent, _nameFallback = "unknown", _level = 0, _disableCircleType = false) {
            this.#name = _card.name ?? _nameFallback;
            this.#text = _card.description;
            this.#image = _card.image;
            this.#rarity = _card.rarity;
            this.#htmlElement = CardVisual.template.content.cloneNode(true).childNodes[1];
            this.#parent = _parent;
            this.#disableCircleType = _disableCircleType;
            this.#level = _level;
            this.updateTexts();
        }
        updateTexts() {
            let translatedName = i18next.t(`card.${this.#name}.name`).toLocaleUpperCase();
            let translatedText = this.getFirstTranslatableText(this.#text ?? "unknown", this.#text, `card.${this.#name}.description`);
            // figure out how large the title text should be
            let fontSize = 10;
            let heightRaw = getComputedStyle(this.#parent).getPropertyValue("--card-size");
            let tmpDiv = document.createElement("div");
            tmpDiv.style.width = heightRaw;
            document.documentElement.appendChild(tmpDiv);
            let height = tmpDiv.offsetWidth;
            document.documentElement.removeChild(tmpDiv);
            let cardWidth = height * (15 / 21) - 0.15 * height;
            let currentTextWidth = this.getTextWidth(translatedName, `normal  ${height / 100 * fontSize}px 'Luckiest Guy'`);
            let factor = cardWidth / currentTextWidth;
            fontSize *= factor;
            fontSize = Math.min(15, fontSize);
            let nameElement = this.#htmlElement.querySelector(".card-name");
            nameElement.style.fontSize = `calc(var(--card-size) / 100 * ${fontSize})`;
            // fill card with data
            if (this.#circleTyper)
                this.#circleTyper.destroy();
            nameElement.innerText = translatedName;
            nameElement.dataset.langText = `card.${this.#name}.name`;
            if (!this.#disableCircleType) {
                requestAnimationFrame(() => {
                    // turn into circle
                    this.#circleTyper = new CircleType(nameElement).radius(cardWidth * 2);
                });
            }
            this.#htmlElement.querySelector(".card-text").innerText = translatedText;
            this.#htmlElement.querySelector(".card-image img").src = "Assets/Cards/Items/" + this.#image;
            this.#htmlElement.style.setProperty("--delay", `${Math.random() * -10}s`);
            this.#htmlElement.classList.add(this.#rarity);
            this.#htmlElement.classList.add(`level-${this.#level}`);
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
            unlock: { possible: true, afterFirstRun: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "hammerPlayer",
                            amount: 1,
                            cooldown: 2,
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 0.75,
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
            unlock: { possible: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "anvilPlayer",
                            amount: 1,
                            cooldown: 3,
                            currentCooldown: 1.5,
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
                            currentCooldown: 1.5,
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
                            currentCooldown: 1.5,
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
                            currentCooldown: 1.5,
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
                            currentCooldown: 1,
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
            unlock: { possible: true },
            isWeapon: true,
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
            unlock: { possible: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "lightbulbPlayer",
                            cooldown: 4,
                            currentCooldown: 2,
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
                            currentCooldown: 2,
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
                            currentCooldown: 2,
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
                            currentCooldown: 2,
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
                            currentCooldown: 2,
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
            unlock: { possible: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 2,
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 0.75,
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
                            currentCooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 2 //2 Base Damage
                                },
                                multiplier: {
                                    projectileSize: 1.1
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "aoe",
                            aoe: "smokeMaskPlayer",
                            cooldown: 1,
                            currentCooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 3, //2 Base Damage
                                },
                                multiplier: {
                                    projectileSize: 1.3
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
            unlock: { possible: true, firstRun: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "discusPlayer",
                            amount: 1,
                            cooldown: 3,
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 0.5,
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
                            currentCooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                    projectilePiercing: 2
                                },
                                multiplier: {
                                    projectileRange: 1.1,
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
                            currentCooldown: 0.5,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                    projectilePiercing: 3,
                                },
                                multiplier: {
                                    projectileRange: 1.2,
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
            unlock: { possible: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "codeCivilPlayer",
                            amount: 1,
                            cooldown: 3,
                            currentCooldown: 1.5,
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
                            currentCooldown: 1.5,
                            modifiers: {
                                absolute: {
                                    damage: 1, //3 Base Damage (x10 for max distance)
                                    projectileRange: 2,
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
                            currentCooldown: 1.25,
                            modifiers: {
                                absolute: {
                                    damage: 2, //3 Base Damage (x10 for max distance)
                                    projectileRange: 4,
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
                            currentCooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 3, //3 Base Damage (x10 for max distance)
                                    projectileRange: 6,
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
                            currentCooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 5, //3 Base Damage (x10 for max distance)
                                    projectileRange: 10,
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
            unlock: { possible: true, firstRun: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 1,
                            cooldown: 2,
                            currentCooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 0, //5 Base Damage
                                    projectilePiercing: 2
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
                            currentCooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 2, //5 Base Damage
                                    projectilePiercing: 2
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
                            currentCooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 2, //5 Base Damage
                                    projectilePiercing: 2
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
                            currentCooldown: 1,
                            modifiers: {
                                absolute: {
                                    damage: 3, //5 Base Damage
                                    projectilePiercing: 3
                                },
                                multiplier: {
                                    projectileRange: 1.1
                                }
                            }
                        }]
                },
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "dividerPlayer",
                            amount: 2,
                            cooldown: 1.5,
                            currentCooldown: 0.75,
                            modifiers: {
                                absolute: {
                                    damage: 5, //5 Base Damage
                                    projectilePiercing: 5
                                },
                                multiplier: {
                                    projectileRange: 1.2
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
            unlock: { possible: true, afterFirstRun: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "needlePlayer",
                            amount: 1,
                            cooldown: 4, //TODO: Leave a projectile every 5 units moved
                            currentCooldown: 2,
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
                            currentCooldown: 1.75,
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
                            currentCooldown: 1.5,
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
                            currentCooldown: 1,
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
                            currentCooldown: 0.5,
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
            unlock: { possible: true },
            isWeapon: true,
            levels: [
                {
                    activeEffects: [{
                            type: "projectile",
                            projectile: "chiselPlayer",
                            amount: 1,
                            cooldown: 2,
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 1,
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
                            currentCooldown: 0.75,
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
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.9, limitation: Script.HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.8, limitation: Script.HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.7, limitation: Script.HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.6, limitation: Script.HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.4, limitation: Script.HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
            ]
        },
        "Safety Boots": {
            image: "SafetyBoots.png",
            rarity: Script.CardRarity.COMMON,
            name: "Safety Boots",
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.9, limitation: Script.HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.8, limitation: Script.HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.7, limitation: Script.HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.6, limitation: Script.HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.4, limitation: Script.HitType.MELEE } // More resistant against melee
                        }
                    }
                },
            ]
        },
        "Microphone": {
            image: "Microphone.png",
            rarity: Script.CardRarity.COMMON,
            name: "Microphone",
            unlock: { possible: true, firstRun: true },
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
            unlock: { possible: true, afterFirstRun: true },
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
            unlock: { possible: true },
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
            unlock: { possible: true, firstRun: true },
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
            unlock: { possible: true, afterFirstRun: true },
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: -1
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: -2
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: -4
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: -6
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            damageReduction: -10
                        }
                    }
                },
            ]
        },
        "Printer": {
            image: "Printer.png",
            rarity: Script.CardRarity.COMMON,
            name: "Printer",
            unlock: { possible: true, afterFirstRun: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            xp: 1.05 // +5% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            xp: 1.1 // +10% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            xp: 1.25 // +25% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            xp: 1.4 // +40% increased XP
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            xp: 1.6 // +60% increased XP
                        }
                    }
                },
            ]
        },
        "Solar Panel": {
            image: "SolarPanel.png",
            rarity: Script.CardRarity.COMMON,
            name: "Solar Panel",
            unlock: { possible: true, firstRun: true },
            levels: [
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
                            regeneration: 3,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 5,
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regeneration: 8,
                        }
                    }
                },
            ]
        },
        "Drone": {
            image: "Drone.png",
            rarity: Script.CardRarity.COMMON,
            name: "Drone",
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            cameraFOV: 1.05, // +5% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cameraFOV: 1.1, // +10% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cameraFOV: 1.2, // +20% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cameraFOV: 1.35, // +35% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cameraFOV: 1.5, // +50% increased field of view (camera zoom) // currently camera distance, not FOV
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
            unlock: { possible: true },
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
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.01
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.02
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.03
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.05
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.1
                        }
                    }
                },
            ]
        },
        "Sketchbook": {
            image: "Sketchbook.png",
            rarity: Script.CardRarity.UNCOMMON,
            name: "Sketchbook",
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.05 //+5% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.1 //+10% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.2 //+20% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.3 //+30% increased effect radius
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.5 //+50% increased effect radius
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
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        absolute: {
                            dodge: 0.05 // 5% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            dodge: 0.1 // 10% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            dodge: 0.2 // 20% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            dodge: 0.3 // 30% dodge chance
                        }
                    }
                },
                {
                    passiveEffects: {
                        absolute: {
                            dodge: 0.5 // 50% dodge chance
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
                            enemyAmount: 0.95, //-5% enemies
                            // TODO: +5% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.9, //-10% enemies
                            // TODO: +10% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.8, //-20% enemies
                            // TODO: +20% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.7, //-30% enemies
                            // TODO: +30% enemy stats
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.5, //-50% enemies
                            // TODO: +50% enemy stats
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
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.02 // 2% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.05 // 5% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.1 // 10% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.15 // 15% more enemies
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.25 // 25% more enemies
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
            unlock: { possible: true },
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
            unlock: { possible: true },
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
            unlock: { possible: true },
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
            unlock: { possible: true },
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
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.05 // +5% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.1 // +10% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.15 // +15% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.3 // +30% healing effects.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.5 // +50% healing effects.
                        }
                    }
                },
            ]
        },
        "Newspaper": {
            image: "Newspaper.png",
            rarity: Script.CardRarity.RARE,
            name: "Newspaper",
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.0,
                            damage: { value: 0.95, limitation: "stopped" }, // -5% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.1,
                            damage: { value: 0.9, limitation: "stopped" }, // -10% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.15,
                            damage: { value: 0.85, limitation: "stopped" }, // -15% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.25,
                            damage: { value: 0.75, limitation: "stopped" }, // -25% damage while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.5,
                            damage: { value: 0.75, limitation: "stopped" }, // -25% damage while standing still.
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
            unlock: { possible: true },
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
            unlock: { possible: true },
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
            unlock: { possible: true },
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
            unlock: { possible: true },
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: { value: 1 / 1.2, limitation: "stopped" } // +20% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: { value: 1 / 1.3, limitation: "stopped" } // +30% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: { value: 1 / 1.4, limitation: "stopped" } // +40% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: { value: 1 / 1.6, limitation: "stopped" } // +60% attack speed while standing still.
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: { value: 1 / 2, limitation: "stopped" } // +100% attack speed while standing still.
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
            unlock: { possible: true },
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
        defaultMaxHealth = 100;
        health = 100;
        maxHealth = 100;
        rigidbody;
        cardManager;
        speed = 3.5;
        visualChildren = [];
        regenTimer = 0;
        defaultCameraDistance = 15;
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
            this.regenerate(time);
        }
        hit(_hit) {
            if (_hit.type === Script.HitType.AOE)
                _hit.type = Script.HitType.PROJECTILE;
            let damage = Math.max(0, this.cardManager.modifyValuePlayer(_hit.damage, Script.PassiveCardEffect.DAMAGE_REDUCTION, undefined, _hit.type));
            let dodgeChance = this.cardManager.modifyValuePlayer(0, Script.PassiveCardEffect.DODGE, undefined, _hit.type);
            if (Math.random() < dodgeChance) {
                //dodged
                Script.provider.get(Script.EnemyManager).displayText("dodged", this.node.mtxWorld.translation, "player", "healing");
                return 0;
            }
            this.health -= damage;
            // display damage numbers
            Script.provider.get(Script.EnemyManager).displayDamage(damage, this.node.mtxWorld.translation, true);
            //update display
            this.updateHealthVisually();
            if (this.health > 0)
                return _hit.damage;
            // Game Over
            Script.provider.get(Script.MenuManager).endGameMenu(false);
            Script.gameState = Script.GAMESTATE.PAUSED;
            ƒ.Time.game.setScale(0);
            return 0;
        }
        updateMaxHealth() {
            let newMax = this.cardManager.modifyValuePlayer(this.defaultMaxHealth, Script.PassiveCardEffect.HEALTH);
            let diff = newMax - this.maxHealth;
            this.maxHealth = newMax;
            this.health += Math.max(0, diff);
            this.updateHealthVisually();
        }
        updateCameraFOV() {
            let newDistance = this.cardManager.modifyValuePlayer(this.defaultCameraDistance, Script.PassiveCardEffect.CAMERA_FOV);
            this.node.getChildrenByName("camera")[0].getComponent(ƒ.ComponentCamera).mtxPivot.translation = ƒ.Vector3.Z(newDistance);
        }
        updatePassiveEffects() {
            this.updateMaxHealth();
            this.updateCameraFOV();
        }
        heal(_amt, _percentage = false) {
            if (_percentage)
                _amt *= this.maxHealth;
            _amt = this.cardManager.modifyValuePlayer(_amt, Script.PassiveCardEffect.REGENERATION);
            _amt = Math.min(_amt, this.maxHealth - this.health);
            this.health += _amt;
            Script.provider.get(Script.EnemyManager).displayDamage(-_amt, this.node.mtxWorld.translation, true);
            this.updateHealthVisually();
        }
        reset() {
            this.maxHealth = this.defaultMaxHealth;
            this.health = this.maxHealth;
            this.updateHealthVisually();
            this.rigidbody.activate(false);
            this.node.mtxLocal.translation = new ƒ.Vector3();
            this.rigidbody.activate(true);
        }
        regenerate(_time) {
            // regenerate health while playing
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            this.regenTimer -= _time;
            if (this.regenTimer > 0)
                return;
            this.regenTimer = 1;
            let regeneration = this.cardManager.modifyValuePlayer(0, Script.PassiveCardEffect.REGENERATION);
            if (regeneration > 0) {
                this.heal(regeneration);
            }
            let regenerationRelative = this.cardManager.modifyValuePlayer(0, Script.PassiveCardEffect.REGENERATION_RELATIVE);
            if (regenerationRelative > 0) {
                this.heal(regenerationRelative, true);
            }
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
            size: 0.9,
            damage: 10,
            desiredDistance: [0, 0],
            health: 15,
            speed: 0.8,
            knockbackMultiplier: 1,
            dropXP: 2,
            hitboxSize: 0.5,
            shadow: {
                size: 1.1,
                position: new Script.ƒ.Vector2(0, -0.05)
            },
        },
        chair: {
            moveSprite: ["chair", "move"],
            damage: 8,
            desiredDistance: [0, 0],
            health: 10,
            speed: 1.2,
            knockbackMultiplier: 1.2,
            dropXP: 2,
            hitboxSize: 0.5,
            shadow: {
                size: 0.75,
                position: new Script.ƒ.Vector2(0, -0.35)
            },
        },
        toaster: {
            moveSprite: ["toaster", "move"],
            desiredDistance: [3, 4],
            health: 10,
            speed: 0.5,
            knockbackMultiplier: 1.2,
            dropXP: 3,
            shadow: {
                size: 0.8,
                position: new Script.ƒ.Vector2(0, -0.3)
            },
            attacks: [
                {
                    cooldown: 2,
                    requiredDistance: [2, 5],
                    attackSprite: ["toaster", "attack"],
                    cooldownSprite: ["toaster", "idle"],
                    windUp: 1,
                    movement: () => { },
                    events: {
                        fire: function () {
                            Script.provider.get(Script.ProjectileManager).createProjectile(Script.projectiles["toastEnemy"], Script.ƒ.Vector3.SUM(this.node.mtxWorld.translation, Script.ƒ.Vector3.Y(0.3)), this.modifier);
                        }
                    }
                }
            ]
        },
        closet: {
            moveSprite: ["closet", "move"],
            size: 1.5,
            damage: 50,
            desiredDistance: [0, 0],
            health: 50,
            speed: 0.2,
            knockbackMultiplier: 0.2,
            dropXP: 3,
            hitboxSize: 0.6,
            shadow: {
                size: 0.7,
                position: new Script.ƒ.Vector2(0, -0.3)
            },
            events: {
                // running away causes attacks
                step: function () {
                    let projectileAmount = 4;
                    let radiusBetweenProjectiles = (2 * Math.PI) / projectileAmount;
                    let startRadius = 0;
                    let modification = {
                        damage: 5,
                        speed: 6,
                        range: 4,
                    };
                    let pm = Script.provider.get(Script.ProjectileManager);
                    this.stepAmount = isNaN(this.stepAmount) ? 0 : this.stepAmount + 1;
                    for (let i = 0; i < projectileAmount; i++) {
                        let angle = i * radiusBetweenProjectiles + startRadius + (this.stepAmount % 2) * 0.5 * radiusBetweenProjectiles;
                        let direction = new Script.ƒ.Vector3(Math.cos(angle), Math.sin(angle));
                        pm.createProjectile({ ...Script.projectiles["genericBullet"], ...modification, ...{ direction } }, this.node.mtxWorld.translation, this.modifier);
                    }
                }
            },
        },
        motor: {
            moveSprite: ["motor", "move"],
            size: 1.1,
            damage: 15,
            desiredDistance: [0, 1],
            health: 25,
            speed: 2,
            dropXP: 5,
            hitboxSize: 0.6,
            shadow: {
                size: 0.82,
                position: new Script.ƒ.Vector2(0, -0.33)
            },
            attacks: [
                {
                    cooldown: 0.61, // how long it dashes, including delay
                    requiredDistance: [1.5, 2.5],
                    attackSprite: ["motor", "attack"],
                    windUp: 2, // how long it plans its attack
                    movement: function (_diff, _mgtSqrd, _charPosition, _frameTimeInSeconds) {
                        let dashDuration = 0.6; // how long it should be dashing.
                        if (this.currentlyActiveAttack.windUp > 0)
                            return;
                        if (this.currentlyActiveAttack.cooldown > dashDuration)
                            return;
                        this.move(_diff, _mgtSqrd, _frameTimeInSeconds);
                    },
                    attack: function () {
                        let charPosition = Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation;
                        let direction = Script.ƒ.Vector3.DIFFERENCE(charPosition, this.node.mtxWorld.translation);
                        this.directionOverride = direction;
                        this.speed *= 4; // how much faster than "normal" speed should it be? ALSO CHANGE BELOW
                        this.meleeCooldown = 0;
                    },
                    attackEnd: function () {
                        this.directionOverride = undefined;
                        this.speed /= 4; // change here
                    }
                }
            ]
        },
        ventilator: {
            moveSprite: ["ventilator", "move"],
            size: 0.5,
            damage: 5,
            speed: 2,
            health: 4,
            dropXP: 0.5,
            shadow: {
                size: 0.55,
                position: new Script.ƒ.Vector2(0, -0.68)
            },
        },
        mixer: {
            moveSprite: ["mixer", "move"],
            damage: 15,
            desiredDistance: [0, Infinity],
            health: 10,
            speed: 1.5,
            dropXP: 4,
            hitboxSize: 0.5,
            shadow: {
                size: 0.6,
                position: new Script.ƒ.Vector2(0, -0.3)
            },
            afterSetup: function () {
                this.rigidbody.mtxPivot.scaling = Script.ƒ.Vector3.ZERO;
                this.invulnerable = true;
                this.meleeCooldown = Infinity;
                this.node.untargetable = true;
            },
            attacks: [
                {
                    cooldown: Infinity, // controlled by animations
                    requiredDistance: [0.8, 1.2],
                    cooldownSprite: ["mixer", "digup"],
                    windUp: 2,
                    movement: function (_diff, _mgtSqrd, _charPosition, _frameTimeInSeconds) {
                        if (this.currentlyActiveAttack.windUp < 0)
                            return;
                        this.move(_diff, _mgtSqrd, _frameTimeInSeconds);
                    },
                    attackStart: function () {
                        // hide
                        this.node.getComponent(Script.ƒ.ComponentMesh).activate(false);
                        this.updateDesiredDistance([0, 0]);
                        // hide shadow
                        // this.node.getChild(0).activate(false);
                        this.node.getChild(0).mtxLocal.scaling = Script.ƒ.Vector3.ONE(0.5 * this.shadow.size);
                    },
                    attack: function () {
                        this.node.getComponent(Script.ƒ.ComponentMesh).activate(true);
                        // this.node.getChild(0).activate(true);
                        this.node.getChild(0).mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.shadow.size);
                        this.node.untargetable = false;
                        this.invulnerable = false;
                        this.meleeCooldown = 0;
                        this.rigidbody.setVelocity(Script.ƒ.Vector3.ZERO);
                    },
                    events: {
                        "digup-complete": function (_event) {
                            this.meleeCooldown = Infinity;
                            this.setCentralAnimator(this.getSprite(["mixer", "idle"]), true);
                        },
                        "idle-complete": function (_event) {
                            this.setCentralAnimator(this.getSprite(["mixer", "digdown"]), true);
                        },
                        "digdown-complete": function (_event) {
                            this.invulnerable = true;
                            this.node.untargetable = true;
                            this.currentlyActiveAttack.cooldown = -1;
                        },
                    }
                },
            ]
        },
        toasterBoss: {
            moveSprite: ["toaster", "move"],
            damage: 30,
            desiredDistance: [5, Infinity],
            dropXP: 100,
            health: 1000,
            knockbackMultiplier: 0.1,
            size: 3,
            speed: 1,
            boss: true,
            shadow: {
                size: 0.8,
                position: new Script.ƒ.Vector2(0, -0.3)
            },
            events: {
                // running away causes attacks
                step: function () {
                    let projectileAmount = 4;
                    let radiusBetweenProjectiles = (2 * Math.PI) / projectileAmount;
                    let startRadius = 0;
                    let modification = {
                        damage: 10,
                        speed: 5,
                        size: 1,
                    };
                    let pm = Script.provider.get(Script.ProjectileManager);
                    this.stepAmount = isNaN(this.stepAmount) ? 0 : this.stepAmount + 1;
                    for (let i = 0; i < projectileAmount; i++) {
                        let angle = i * radiusBetweenProjectiles + startRadius + (this.stepAmount % 2) * 0.5 * radiusBetweenProjectiles;
                        let direction = new Script.ƒ.Vector3(Math.cos(angle), Math.sin(angle));
                        pm.createProjectile({
                            ...Script.projectiles["flatToast"], ...modification, ...{ direction }
                        }, this.node.mtxWorld.translation, this.modifier);
                    }
                }
            },
            attacks: [
                // 3 waves of toasts
                {
                    weight: 2,
                    requiredDistance: [0, Infinity],
                    cooldown: 2,
                    windUp: 181 / 24,
                    attackSprite: ["bosstoaster", "attack01"],
                    cooldownSprite: ["toaster", "idle"],
                    movement: function () { },
                    events: {
                        fire: function () {
                            let modification = {
                                size: 1,
                                methods: {
                                    afterSetup: function () {
                                        let delta = new Script.ƒ.Vector3(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
                                        this.hazardZone.mtxLocal.translate(delta);
                                        this.targetPosition.add(delta);
                                    },
                                }
                            };
                            for (let i = 0; i < 5; i++) {
                                Script.provider.get(Script.ProjectileManager).createProjectile({ ...Script.projectiles["toastEnemy"], ...modification }, Script.ƒ.Vector3.SUM(this.node.mtxWorld.translation, Script.ƒ.Vector3.Y(0.3)), { ...this.modifier, ...{ multiplier: { projectileSize: 2 } } });
                            }
                        }
                    }
                },
                // run
                {
                    weight: 3,
                    requiredDistance: [3, 6],
                    cooldown: 1,
                    windUp: 0,
                },
                // jump
                {
                    attackSprite: ["bosstoaster", "attack03"],
                    cooldownSprite: ["toaster", "idle"],
                    weight: 1,
                    requiredDistance: [4, 6],
                    cooldown: 5,
                    windUp: 44 / 24,
                    movement: function () { },
                    attack: function () {
                        let modification = {
                            methods: {
                                afterSetup: function () {
                                    let position = this.node.mtxLocal.translation.clone;
                                    this.hazardZone.mtxLocal.translation = position.clone;
                                    this.targetPosition = position;
                                    this.direction = Script.ƒ.Vector3.Y(-1);
                                    this.node.mtxLocal.translateY(20);
                                },
                            }
                        };
                        // move to furthest away point
                        let charPosition = Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation;
                        this.rigidbody.activate(false);
                        this.node.mtxLocal.translation = new Script.ƒ.Vector3(charPosition.x < 0 ? 11 : -11, charPosition.y < 0 ? 6.5 : -6.5);
                        this.rigidbody.activate(true);
                        let timeBetweenWavesInMS = 1500;
                        let waves = 3;
                        let projectilesPerWave = 100;
                        for (let i = 0; i < waves; i++) {
                            setTimeout(() => {
                                for (let p = 0; p < projectilesPerWave; p++) {
                                    Script.provider.get(Script.ProjectileManager).createProjectile({ ...Script.projectiles["toastEnemy"], ...modification }, new Script.ƒ.Vector3(Math.random() * 25 - 12.5, Math.random() * 15 - 7.5), this.modifier);
                                }
                            }, timeBetweenWavesInMS * i * Script.ƒ.Time.game.getScale());
                        }
                    },
                },
            ]
        }
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
        size = 1;
        events;
        hitboxSize;
        shadow;
        boss;
        enemyManager;
        prevDirection;
        currentlyActiveAttack;
        rigidbody;
        touchingPlayer;
        meleeCooldown;
        modifier = {};
        invulnerable = false;
        isSpawning = false;
        stunned = 0;
        static defaults = {
            attacks: [],
            damage: 1,
            speed: 1,
            desiredDistance: [0, 0],
            dropXP: 1,
            size: 1,
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
            events: undefined,
            hitboxSize: 0.4,
            boss: false,
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
        setup(_options, _modifier) {
            _options = { ...Enemy.defaults, ..._options };
            let cm = Script.provider.get(Script.CardManager);
            this.speed = cm.modifyValue(_options.speed, Script.PassiveCardEffect.MOVEMENT_SPEED, _modifier);
            this.damage = cm.modifyValue(_options.damage, Script.PassiveCardEffect.DAMAGE, _modifier);
            this.knockbackMultiplier = cm.modifyValue(_options.knockbackMultiplier, Script.PassiveCardEffect.KNOCKBACK, _modifier);
            this.health = cm.modifyValue(_options.health, Script.PassiveCardEffect.HEALTH, _modifier);
            this.attacks = _options.attacks;
            this.desiredDistance = _options.desiredDistance;
            this.dropXP = cm.modifyValue(_options.dropXP, Script.PassiveCardEffect.XP, _modifier);
            this.directionOverride = _options.directionOverride;
            this.updateDesiredDistance(this.desiredDistance);
            this.moveSprite = this.getSprite(_options.moveSprite);
            this.setCentralAnimator(this.moveSprite);
            this.stunned = 0;
            this.boss = _options.boss;
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.ENEMY_SIZE, _modifier);
            this.events = _options.events;
            this.node.mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.size);
            this.modifier = _modifier ?? {};
            this.meleeCooldown = Math.random();
            this.rigidbody.mtxPivot.scaling = Script.ƒ.Vector3.ONE(_options.hitboxSize);
            this.invulnerable = false;
            this.currentlyActiveAttack = undefined;
            this.shadow = {
                ...{
                    size: 1,
                    position: new Script.ƒ.Vector2(0, -0.25),
                }, ..._options.shadow
            };
            let shadow = this.node.getChild(0);
            if (this.shadow.size)
                shadow.mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.shadow.size);
            if (this.shadow.position)
                shadow.mtxLocal.translation = new Script.ƒ.Vector3(this.shadow.position.x, this.shadow.position.y, this.node.mtxLocal.translation.z);
            //hide for spawning
            this.node.untargetable = false;
            this.node.isSpawning = true;
            this.isSpawning = true;
            this.node.getComponent(Script.ƒ.ComponentMesh).activate(false);
            this.node.getChild(0).activate(false);
            this.node.getChild(1).activate(true);
            this.rigidbody.activate(false);
            setTimeout(() => {
                this.rigidbody.activate(true);
                this.node.getChild(0).activate(true);
                this.node.getChild(1).activate(false);
                this.node.getComponent(Script.ƒ.ComponentMesh).activate(true);
                this.isSpawning = false;
                this.node.isSpawning = false;
                this.invulnerable = false;
            }, 1000);
            _options.afterSetup?.call(this);
        }
        updateDesiredDistance(_distance) {
            this.currentlyDesiredDistance = _distance;
            this.currentlyDesiredDistanceSquared = [this.currentlyDesiredDistance[0] * this.currentlyDesiredDistance[0], this.currentlyDesiredDistance[1] * this.currentlyDesiredDistance[1]];
        }
        update(_charPosition, _frameTimeInSeconds) {
            if (this.isSpawning)
                return;
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
            this.meleeAttack(_frameTimeInSeconds);
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
        }
        meleeAttack(_frameTimeInSeconds) {
            // are we touching the player?
            if (this.touchingPlayer) {
                this.meleeCooldown -= _frameTimeInSeconds;
                if (this.meleeCooldown < 0) {
                    this.meleeCooldown = 1;
                    let character = Script.provider.get(Script.CharacterManager).character;
                    // let mag = ƒ.Vector3.DIFFERENCE(character.node.mtxWorld.translation, this.node.mtxWorld.translation).magnitudeSquared;
                    // if (mag < 0.64 /* 0.8² (player hitbox size) TODO: update this if player or enemy size changes */)
                    character.hit({ damage: this.damage, type: Script.HitType.MELEE });
                    // console.log(this.rigidbody.collisions);
                }
            }
        }
        chooseAttack() {
            if (this.currentlyActiveAttack || this.attacks.length === 0)
                return;
            let totalWeight = 0;
            for (let attack of this.attacks) {
                totalWeight += attack.weight ?? 1;
            }
            let selectedWeight = Math.random() * totalWeight;
            for (let attack of this.attacks) {
                selectedWeight -= attack.weight ?? 1;
                if (selectedWeight <= 0) {
                    this.currentlyActiveAttack = { ...attack }; // spread to have new object
                    break;
                }
            }
            this.currentlyActiveAttack.started = false;
            this.currentlyActiveAttack.done = false;
            this.updateDesiredDistance(this.currentlyActiveAttack.requiredDistance);
            this.currentlyActiveAttack.abortTimer = 5;
        }
        executeAttack(_mgtSqrd, _frameTimeInSeconds) {
            if (!this.currentlyActiveAttack)
                return;
            if (!this.currentlyActiveAttack.started) {
                // attack hasn't started yet. should we start it?
                if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // start the attack
                    this.currentlyActiveAttack.attackStart?.call(this);
                    this.currentlyActiveAttack.started = true;
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.attackSprite), true);
                }
                // have we been attempting to start for too long?
                this.currentlyActiveAttack.abortTimer -= _frameTimeInSeconds;
                if (this.currentlyActiveAttack.abortTimer < 0) {
                    this.currentlyActiveAttack = undefined;
                    return;
                }
            }
            if (this.currentlyActiveAttack.started) {
                // attack is ongoing
                if (this.currentlyActiveAttack.windUp > 0) {
                    // still preparing
                    this.currentlyActiveAttack.windUp -= _frameTimeInSeconds;
                }
                else if (!this.currentlyActiveAttack.done) {
                    // time to execute attack
                    this.currentlyActiveAttack.done = true;
                    this.currentlyActiveAttack.attack?.call(this);
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.cooldownSprite), true);
                }
                else {
                    //we're on cooldown now
                    this.currentlyActiveAttack.cooldown -= _frameTimeInSeconds;
                    if (this.currentlyActiveAttack.cooldown < 0) {
                        // cooldown is up, we're ready to do something else
                        this.updateDesiredDistance(this.desiredDistance);
                        this.setCentralAnimator(this.moveSprite);
                        this.currentlyActiveAttack.attackEnd?.call(this);
                        this.currentlyActiveAttack = undefined;
                    }
                }
            }
        }
        setCentralAnimator(_as, _unique = false) {
            super.setCentralAnimator(_as, _unique, this.eventListener);
        }
        eventListener = (_event) => {
            if (this.isSpawning)
                return;
            // walk event
            if (!(this.currentlyActiveAttack && this.currentlyActiveAttack.events && this.currentlyActiveAttack.events[_event.type])) {
                if (!this.events)
                    return;
                if (!this.events[_event.type])
                    return;
                this.events[_event.type].call(this, _event);
                return;
            }
            // attack event
            if (!this.currentlyActiveAttack)
                return;
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
            if (this.invulnerable && isFinite(_hit.damage))
                return _hit.damage;
            this.health -= _hit.damage;
            //display damage numbers
            this.enemyManager.displayDamage(_hit.damage, this.node.mtxWorld.translation);
            this.enemyManager.enemyTookDamage();
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
    Script.eliteModifier = {
        multiplier: {
            enemySize: 2,
            damage: 2,
            health: 10,
            movementSpeed: 0.8,
            knockback: 0.1,
            xp: 6,
        }
    };
    Script.pools = {
        "electronics": [
            ["motor", "motor"], // --0
            ["toaster", "closet"], // --1
            ["mixer"], // --2
            ["ventilator"], // --3
            ["motor"], // --4
            ["toaster"], // --5
            ["closet"] // --6
        ]
    };
    Script.rooms = {
        "electronics": [
            // room 1
            {
                duration: 20,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 3,
                    duration: 6,
                    minEnemiesOverride: 1,
                },
                waveAmount: 4,
                bonus: {
                    multiplier: {
                        health: 0.3,
                        damage: 1,
                        xp: 5,
                    }
                }
            },
            // room 2
            {
                duration: 25,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 4,
                    duration: 5,
                    minEnemiesOverride: 2,
                },
                waveAmount: 5,
                bonus: {
                    multiplier: {
                        health: 0.3,
                        damage: 1,
                        xp: 4,
                    }
                }
            },
            // room 3
            {
                duration: 30,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 9 },
                        { pool: 1, weight: 1 },
                    ],
                    amount: 5,
                    duration: 6,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 1 }
                        ],
                        amount: 2,
                        duration: 10,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 9 },
                            { pool: 1, weight: 1 },
                        ],
                        amount: 5,
                        duration: 6,
                        minEnemiesOverride: 0,
                    }
                ],
                bonus: {
                    multiplier: {
                        health: 0.4,
                        damage: 1,
                        xp: 2,
                    }
                }
            },
            // room 4
            {
                duration: 35,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 8 },
                        { pool: 1, weight: 2 },
                    ],
                    amount: 5,
                    duration: 6,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                bonus: {
                    multiplier: {
                        health: 0.6,
                        damage: 1,
                        xp: 2,
                    }
                }
            },
            // room 5 - ELITE
            {
                duration: 40,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 5,
                    duration: 6,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 0, elite: true },
                        ],
                        amount: 1,
                        duration: 10,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 1, weight: 4 },
                        ],
                        amount: 5,
                        duration: 6,
                        minEnemiesOverride: 0,
                    }
                ],
                bonus: {
                    multiplier: {
                        health: 0.8,
                        damage: 1,
                        xp: 1.5,
                    }
                }
            },
            // room 6
            {
                duration: 45,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 5 },
                        { pool: 1, weight: 5 },
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                bonus: {
                    multiplier: {
                        health: 1,
                        damage: 1.2,
                        xp: 1.2,
                    }
                }
            },
            // room 7
            {
                duration: 50,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 5 },
                        { pool: 1, weight: 3 },
                        { pool: 2, weight: 2 },
                    ],
                    amount: 8,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 2 },
                        ],
                        amount: 2,
                        duration: 10,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 5 },
                            { pool: 1, weight: 3 },
                            { pool: 2, weight: 2 },
                        ],
                        amount: 8,
                        duration: 10,
                        minEnemiesOverride: 0,
                    }
                ],
                bonus: {
                    multiplier: {
                        health: 1.2,
                        damage: 1.2,
                        xp: 1,
                    }
                }
            },
            // room 8 - SCHWARM
            {
                duration: 50,
                defaultWave: {
                    enemies: [
                        { pool: 0 },
                    ],
                    amount: 3,
                    duration: 0.75,
                    minEnemiesOverride: 2,
                },
                waveAmount: 75,
                bonus: {
                    multiplier: {
                        health: 0.2,
                        movementSpeed: 1.5,
                        damage: 0.8,
                        xp: 0.3,
                        enemySize: 0.6,
                    }
                }
            },
            // room 9
            {
                duration: 55,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 3 },
                        { pool: 1, weight: 4 },
                        { pool: 2, weight: 3 },
                    ],
                    amount: 8,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                bonus: {
                    multiplier: {
                        health: 1.3,
                        damage: 1.3,
                        xp: 1,
                    }
                }
            },
            // room 10 - BOSS ----------------------------------------------------------------------------------------
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 1,
                    duration: 60,
                    enemies: ["toasterBoss"],
                },
                waveAmount: 1
            },
            // room 11
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                waves: [{
                        enemies: [
                            { pool: 5 },
                            { pool: 6 }
                        ],
                        amount: 2,
                        duration: 5,
                        minEnemiesOverride: 0,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 5, weight: 2 },
                            { pool: 6, weight: 2 }
                        ],
                        amount: 6,
                        duration: 8,
                        minEnemiesOverride: 0,
                    }],
                bonus: {
                    multiplier: {
                        health: 3,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 2,
                        xp: 1.5,
                    }
                }
            },
            // room 12 - ELITE
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 8,
                waves: [{
                        enemies: [{ pool: 4, elite: true }],
                        amount: 1,
                        duration: 10,
                        minEnemiesOverride: 0,
                        bonus: {
                            multiplier: {
                                health: 0.8,
                                enemySize: 0.9,
                            }
                        }
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 5, weight: 2 },
                            { pool: 6, weight: 2 }
                        ],
                        amount: 5,
                        duration: 8,
                        minEnemiesOverride: 0,
                    }],
                bonus: {
                    multiplier: {
                        health: 3.5,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 2,
                        xp: 1.5,
                    }
                }
            },
            // room 13 - VENTILATOR -- ADD VENTILATOR SWARM ABILITY
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 2, weight: 3 },
                        { pool: 4, weight: 2 },
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 8,
                /*
                waves: [{
                    enemies: [{ pool: 3 }],
                    amount: 1,
                    duration: 4,
                    minEnemiesOverride: 0,
                },
                {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 2, weight: 3 },
                        { pool: 4, weight: 2 },
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 0,
                }],
                */
                bonus: {
                    multiplier: {
                        health: 5,
                        enemySize: 1.1,
                        movementSpeed: 1.5,
                        damage: 2.5,
                        xp: 1.5,
                    }
                }
            },
            // room 14 - SCHWARM
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 1 },
                        { pool: 6, weight: 1 },
                    ],
                    amount: 5,
                    duration: 1,
                    minEnemiesOverride: 2,
                },
                waveAmount: 60,
                bonus: {
                    multiplier: {
                        health: 0.2,
                        movementSpeed: 1.8,
                        damage: 0.5,
                        xp: 0.25,
                        enemySize: 0.6,
                    }
                }
            },
            // room 15 - ELITE -- ADD VENTILATOR SWARM ENEMY
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 40 },
                        { pool: 2, weight: 20 },
                        { pool: 4, weight: 10 },
                        { pool: 5, weight: 15 },
                        { pool: 6, weight: 15 },
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 8,
                waves: [{
                        enemies: [{ pool: 2, elite: true }],
                        amount: 1,
                        duration: 10,
                        minEnemiesOverride: 0,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 40 },
                            { pool: 2, weight: 20 },
                            { pool: 4, weight: 10 },
                            { pool: 5, weight: 15 },
                            { pool: 6, weight: 15 },
                        ],
                        amount: 6,
                        duration: 8,
                        minEnemiesOverride: 0,
                    }],
                bonus: {
                    multiplier: {
                        health: 4,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 3,
                        xp: 1.5,
                    }
                }
            },
            // room 16
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 2, weight: 3 },
                        { pool: 4, weight: 1 },
                    ],
                    amount: 4,
                    duration: 3,
                    minEnemiesOverride: 2,
                },
                waveAmount: 20,
                bonus: {
                    multiplier: {
                        health: 3,
                        enemySize: 1.1,
                        movementSpeed: 1.7,
                        damage: 3,
                        xp: 1,
                    }
                }
            },
            // room 17 - ADD VENTILATOR SWARM ENEMY
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 4 },
                        { pool: 2, weight: 2 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 },
                    ],
                    amount: 10,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                bonus: {
                    multiplier: {
                        health: 4,
                        enemySize: 1.2,
                        movementSpeed: 1.8,
                        damage: 3,
                        xp: 1.2,
                    }
                }
            },
            // room 18 - ELITES
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 5,
                waves: [{
                        enemies: [
                            { pool: 0, elite: true },
                            { pool: 0 }
                        ],
                        amount: 8,
                        duration: 12,
                        minEnemiesOverride: 1,
                        bonus: {
                            multiplier: {
                                health: 0.9,
                                enemySize: 0.9,
                            }
                        }
                    },
                    {
                        enemies: [
                            { pool: 5, elite: true },
                            { pool: 5 }
                        ],
                        amount: 6,
                        duration: 12,
                        minEnemiesOverride: 1,
                        bonus: {
                            multiplier: {
                                health: 0.9,
                                enemySize: 0.9,
                            }
                        }
                    },
                    {
                        enemies: [
                            { pool: 6, elite: true },
                            { pool: 6 }
                        ],
                        amount: 6,
                        duration: 12,
                        minEnemiesOverride: 1,
                        bonus: {
                            multiplier: {
                                health: 0.9,
                                enemySize: 0.9,
                            }
                        }
                    },
                    {
                        enemies: [
                            { pool: 2, elite: true },
                            { pool: 2 }
                        ],
                        amount: 5,
                        duration: 12,
                        minEnemiesOverride: 1,
                        bonus: {
                            multiplier: {
                                health: 0.9,
                                enemySize: 0.9,
                            }
                        }
                    },
                    {
                        enemies: [
                            { pool: 4, elite: true },
                            { pool: 4 }
                        ],
                        amount: 4,
                        duration: 12,
                        minEnemiesOverride: 1,
                        bonus: {
                            multiplier: {
                                health: 0.9,
                                enemySize: 0.9,
                            }
                        }
                    },
                ],
                bonus: {
                    multiplier: {
                        health: 3.5,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 3.5,
                        xp: 0.8,
                    }
                }
            },
            // room 19
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 3 },
                        { pool: 1, weight: 3 },
                        { pool: 2, weight: 2 },
                        { pool: 4, weight: 2 },
                    ],
                    amount: 8,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                bonus: {
                    multiplier: {
                        health: 1.3,
                        enemySize: 1.3,
                        movementSpeed: 0.8,
                        damage: 4,
                        xp: 1.5,
                    }
                }
            },
            // room 20 - FINAL BOSS
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 6,
                    duration: 0,
                    enemies: [
                        { pool: 5, weight: 5 }
                    ],
                },
                waves: [
                    {
                        enemies: ["toasterBoss"],
                        amount: 2,
                        duration: 0,
                        bonus: {
                            multiplier: {
                                health: 0.8,
                                damage: 0.8,
                                enemySize: 0.9,
                                movementSpeed: 0.8,
                                xp: 1,
                            }
                        }
                    }
                ],
                waveAmount: 3,
                bonus: {
                    multiplier: {
                        health: 2,
                        damage: 3,
                        enemySize: 1.1,
                        movementSpeed: 2,
                        xp: 1,
                    }
                }
            },
        ]
    };
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
        defaultMaxActiveCardAmount = 5;
        currentMaxActiveCardAmount = 5;
        constructor() {
            this.updateEffects();
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        get activeCards() {
            return this.currentlyActiveCards;
        }
        get maxActiveCardAmount() {
            return this.currentMaxActiveCardAmount;
        }
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let card of this.currentlyActiveCards) {
                card.update(time, this.cumulativeEffects);
            }
        };
        getEffectAbsolute(_effect, _modifier = this.cumulativeEffects, _limitation) {
            let element = _modifier.absolute?.[_effect];
            if (!element)
                return 0;
            if (Array.isArray(element)) {
                let total = 0;
                for (let el of element) {
                    total += this.getValue(el, 0, _limitation);
                }
                return total;
            }
            return this.getValue(element, 0, _limitation);
        }
        getEffectMultiplier(_effect, _modifier = this.cumulativeEffects, _limitation) {
            let element = _modifier.multiplier?.[_effect];
            if (!element)
                return 1;
            if (Array.isArray(element)) {
                let total = 1;
                for (let el of element) {
                    total *= this.getValue(el, 1, _limitation);
                }
                return total;
            }
            return this.getValue(element, 1, _limitation);
        }
        getValue(_val, _default = 0, _limitation) {
            if (typeof _val === "number") {
                return _val;
            }
            if (!_val.limitation || _val.limitation == _limitation) {
                return _val.value;
            }
            return _default;
        }
        modifyValuePlayer(_value, _effect, _localModifiers, _limitation) {
            if (_localModifiers) {
                _value = (_value + this.getEffectAbsolute(_effect, _localModifiers, _limitation)) * this.getEffectMultiplier(_effect, _localModifiers, _limitation);
            }
            return (_value + this.getEffectAbsolute(_effect, this.cumulativeEffects, _limitation)) * this.getEffectMultiplier(_effect, this.cumulativeEffects, _limitation);
        }
        modifyValue(_value, _effect, _modifier, _limitation) {
            if (!_modifier)
                return _value;
            return (_value + this.getEffectAbsolute(_effect, _modifier, _limitation)) * this.getEffectMultiplier(_effect, _modifier, _limitation);
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
            Script.provider.get(Script.CharacterManager).character?.updatePassiveEffects();
        }
        combineEffects(..._effects) {
            let combined = { absolute: {}, multiplier: {} };
            for (let effectObj of _effects) {
                if (!effectObj)
                    continue;
                let effect;
                for (effect in effectObj.absolute) {
                    let effectValue = effectObj.absolute[effect];
                    if (!combined.absolute[effect])
                        combined.absolute[effect] = [];
                    if (Array.isArray(effectValue))
                        combined.absolute[effect].push(...effectValue);
                    else
                        combined.absolute[effect].push(effectValue);
                }
                for (effect in effectObj.multiplier) {
                    let effectValue = effectObj.multiplier[effect];
                    if (!combined.multiplier[effect])
                        combined.multiplier[effect] = [];
                    if (Array.isArray(effectValue))
                        combined.multiplier[effect].push(...effectValue);
                    else
                        combined.multiplier[effect].push(effectValue);
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
        getCardsToChooseFrom(_maxAmt, _newCards = false, _weaponsOnly = false) {
            let possibleCards = [...this.currentlyActiveCards];
            if (this.currentlyActiveCards.length < this.currentMaxActiveCardAmount) {
                possibleCards.push(...this.deckCards);
            }
            for (let i = 0; i < possibleCards.length; i++) {
                let card = possibleCards[i];
                if ((_newCards && this.prevChosenCards.includes(card)) ||
                    (card.level >= card.levels.length - 1 && this.activeCards.includes(card)) ||
                    (_weaponsOnly && !card.isWeapon)) {
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
            if (possibleCards.length === 0 && _weaponsOnly) {
                return this.getCardsToChooseFrom(_maxAmt, _newCards);
            }
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
        _firstPlaythroughDone = false;
        selectedLanguage = "en";
        async load() {
            this.savedCollectionRaw = this.catchObjChange(JSON.parse(localStorage.getItem("collection") ?? "{}"), () => { localStorage.setItem("collection", JSON.stringify(this.savedCollectionRaw)); });
            this.savedDeckRaw = this.catchArrayChange(JSON.parse(localStorage.getItem("deck") ?? "[]"), () => { localStorage.setItem("deck", JSON.stringify(this.savedDeckRaw)); });
            this.savedSelectionRaw = this.catchArrayChange(JSON.parse(localStorage.getItem("selection") ?? "[]"), () => { localStorage.setItem("selection", JSON.stringify(this.savedSelectionRaw)); });
            this._firstPlaythroughDone = !!localStorage.getItem("firstPlaythroughDone");
            this.lang = localStorage.getItem("lang") ?? "en";
        }
        get lang() {
            return this.selectedLanguage;
        }
        set lang(_language) {
            if (_language !== "en" && _language !== "de")
                return;
            this.selectedLanguage = _language;
            localStorage.setItem("lang", _language);
            i18next.changeLanguage(this.selectedLanguage);
            Script.updateI18nInDOM();
            Script.provider.get(Script.MenuManager).updateLangIcons();
        }
        get firstPlaythroughDone() { return this._firstPlaythroughDone; }
        ;
        set firstPlaythroughDone(_value) {
            if (_value)
                localStorage.setItem("firstPlaythroughDone", "true");
            if (!_value)
                localStorage.removeItem("firstPlaythroughDone");
            this._firstPlaythroughDone = _value;
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
        lvlupMarker;
        damageWasDealt = false;
        timeElement = document.getElementById("timer");
        roomProgressElement = document.getElementById("room-progress").querySelector("span:nth-child(2)");
        unlockedCards = 0;
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
            this.xpElement = document.getElementById("xpbar");
            this.lvlupMarker = document.getElementById("lvlup-marker");
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
            // update timer
            // this.timeElement.innerText = `room ${this.currentRoom} ends in: ${Math.floor(this.currentRoomEnd - currentTime)}ms - wave ${this.currentWave} ends in: ${Math.floor(this.currentWaveEnd - currentTime)}ms`;
            this.timeElement.innerText = `${Math.ceil((this.currentRoomEnd - currentTime) / 1000)}`;
            // no more enenmies left, everything was killed
            // @ts-expect-error
            if (this.enemies.length === 0 && Script.gameState !== Script.GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }
            // is the rooms timer up?
            // @ts-expect-error
            if (this.currentRoomEnd < currentTime && Script.gameState !== Script.GAMESTATE.ROOM_CLEAR) {
                // don't end room if boss rooms and damage was dealt - you need to kill the boss.
                if (this.damageWasDealt && Script.rooms[this.currentArea][this.currentRoom].boss) {
                }
                else {
                    this.endRoom();
                }
            }
            if (this.damageWasDealt && Script.rooms[this.currentArea][this.currentRoom].boss) {
                this.timeElement.innerText = "Kill the boss!";
            }
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
                    this.addXP(-100);
                    await this.characterManager.upgradeCards();
                }
                this.addXP(0);
                Script.provider.get(Script.MenuManager).openMenu(Script.MenuType.BETWEEN_ROOMS);
                let timeElement = document.getElementById("between-rooms-timer");
                timeElement.innerText = `3`;
                await this.waitMs(1000);
                timeElement.innerText = `2`;
                await this.waitMs(1000);
                timeElement.innerText = `1`;
                await this.waitMs(1000);
                Script.provider.get(Script.MenuManager).openMenu(Script.MenuType.NONE);
                this.nextRoom();
            }
        }
        nextRoom() {
            Script.ƒ.Time.game.setScale(1);
            this.currentRoom++;
            this.currentWave = -1;
            this.currentWaveEnd = 0;
            this.damageWasDealt = false;
            if (Script.rooms[this.currentArea].length <= this.currentRoom) {
                console.log("LAST ROOM CLEARED");
                Script.gameState = Script.GAMESTATE.IDLE;
                Script.provider.get(Script.MenuManager).endGameMenu(true, this.unlockedCards);
                return;
            }
            let room = Script.rooms[this.currentArea][this.currentRoom];
            this.currentRoomEnd = Script.ƒ.Time.game.get() + room.duration * 1000;
            Script.gameState = Script.GAMESTATE.PLAYING;
            if (room.reward) {
                //TODO spawn reward stuff
            }
            this.roomProgressElement.innerText = `${this.currentRoom + 1}/${Script.rooms[this.currentArea].length}`;
            this.characterManager.character.heal(0.1, true);
        }
        async waitMs(_ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, _ms);
            });
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
                this.spawnEnemy(elite, true);
            }
            let amount = Math.max(1, Script.provider.get(Script.CardManager).modifyValuePlayer(wave.amount, Script.PassiveCardEffect.ENEMY_AMOUNT));
            let afterComma = amount - Math.floor(amount);
            if (Math.random() < afterComma) {
                amount++;
            }
            amount = Math.floor(amount);
            for (let i = 0; i < amount; i++) {
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
            if (!Script.rooms[_area])
                return undefined;
            if (!Script.rooms[_area][_room])
                return undefined;
            if (Script.rooms[_area][_room].waveAmount !== undefined && Script.rooms[_area][_room].waveAmount <= _wave)
                return undefined;
            return Script.rooms[_area][_room].waves?.[_wave] ?? Script.rooms[_area][_room].defaultWave;
        }
        getWaveModifier(_area, _room, _wave) {
            if (!Script.rooms[_area])
                return undefined;
            if (!Script.rooms[_area][_room])
                return undefined;
            let wave = this.getWave(_area, _room, _wave);
            return Script.provider.get(Script.CardManager).combineEffects(wave.bonus, Script.rooms[_area][_room].bonus);
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
                        this.poolSelections[enemy.pool] = Script.pools[this.currentArea][enemy.pool][Math.floor(Math.random() * Script.pools[this.currentArea][enemy.pool].length)];
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
        async spawnEnemy(_enemy, _elite = false) {
            let newEnemyGraphInstance = Script.ƒ.Recycler.get(Script.EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            let spawnPosition = new Script.ƒ.Vector3(Infinity);
            let bounds = new Script.ƒ.Vector2(11.5, 6.5);
            let minDistance = 4;
            let maxDistance = 10;
            let deltaDistance = maxDistance - minDistance;
            let charPosition = this.characterManager.character.node.mtxWorld.translation;
            while (spawnPosition.x > bounds.x || spawnPosition.x < -bounds.x || spawnPosition.y > bounds.y || spawnPosition.y < -bounds.y) {
                spawnPosition = Script.ƒ.Vector3.NORMALIZATION(new Script.ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), Math.random() * deltaDistance + minDistance);
                spawnPosition.add(charPosition);
            }
            newEnemyGraphInstance.mtxLocal.translation = spawnPosition;
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Script.Enemy);
            let modifier = this.getWaveModifier(this.currentArea, this.currentRoom, this.currentWave);
            if (_elite)
                modifier = Script.provider.get(Script.CardManager).combineEffects(Script.eliteModifier, modifier);
            enemyScript.setup(Script.enemies[_enemy], modifier);
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
            if (_enemy.boss)
                this.unlockedCards += 2;
        }
        getEnemy(_mode, _pos = Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation, _exclude = [], _maxDistance = 20) {
            if (!this.enemies || this.enemies.length === 0)
                return undefined;
            _maxDistance *= _maxDistance;
            let enemies = [...this.enemies].filter((enemy) => {
                if (enemy.isSpawning)
                    return false;
                if (_exclude.includes(enemy))
                    return false;
                if (enemy.untargetable)
                    return false;
                return true;
            });
            if (_mode === Script.ProjectileTargetMode.RANDOM) {
                //TODO: make sure chosen enemy is visible on screen
                while (enemies.length > 0) {
                    let index = Math.floor(Math.random() * this.enemies.length);
                    let enemy = this.enemies.splice(index, 1)[0];
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
                    return (enemies[i]);
                }
            }
            return undefined;
        }
        dmgDisplayElements = [];
        displayDamage(_amt, _pos, _onPlayer = false) {
            if (!isFinite(_amt))
                return;
            if (_amt === 0)
                return;
            let dmgText = (Math.round(Math.abs(_amt) * 100) / 100).toString();
            let classes = [];
            if (_onPlayer)
                classes.push("player");
            if (_amt < 0)
                classes.push("healing");
            this.displayText(dmgText, _pos, ...classes);
        }
        displayText(_text, _pos, ...cssClasses) {
            let textElement = document.createElement("span");
            textElement.innerText = _text;
            textElement.classList.add("dmg-number", ...cssClasses);
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
            this.unlockedCards = 0;
        }
        enemyTookDamage() {
            this.damageWasDealt = true;
        }
        addXP(_xp) {
            this.currentXP += Script.provider.get(Script.CardManager).modifyValuePlayer(_xp, Script.PassiveCardEffect.XP);
            this.xpElement.value = Math.floor(this.currentXP) % 100;
            let levelups = Math.floor(this.currentXP / 100);
            this.lvlupMarker.innerHTML = "";
            for (let i = 0; i < levelups; i++) {
                this.lvlupMarker.innerHTML += `<img src="Assets/UI/Gameplay/LevelUp.png" alt="Levelup">`;
            }
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
        MenuType[MenuType["GAME_OVER"] = 7] = "GAME_OVER";
        MenuType[MenuType["WINNER"] = 8] = "WINNER";
        MenuType[MenuType["BETWEEN_ROOMS"] = 9] = "BETWEEN_ROOMS";
    })(MenuType = Script.MenuType || (Script.MenuType = {}));
    class MenuManager {
        menus = new Map();
        prevGameState = Script.GAMESTATE.PLAYING;
        gameIsReady = false;
        constructor() {
            document.addEventListener("interactiveViewportStarted", this.ready);
        }
        updateLangIcons() {
            let dm = Script.provider.get(Script.DataManager);
            document.querySelectorAll("#main-menu-language img").forEach((element) => {
                let img = element;
                let lang = img.dataset.lang;
                if (dm.lang === lang) {
                    img.src = `Assets/UI/MainMenu/${lang}_active.png`;
                }
                else {
                    img.src = `Assets/UI/MainMenu/${lang}.png`;
                }
            });
        }
        setup() {
            let main = document.getElementById("main-menu-overlay");
            this.menus.set(MenuType.MAIN, main);
            this.menus.set(MenuType.COLLECTION, document.getElementById("collection-overlay"));
            this.menus.set(MenuType.SETTINGS, document.getElementById("settings-overlay"));
            this.menus.set(MenuType.PAUSE, document.getElementById("pause-overlay"));
            this.menus.set(MenuType.CARD_UPGRADE, document.getElementById("card-upgrade-popup"));
            this.menus.set(MenuType.END_CONFIRM, document.getElementById("end-confirm"));
            this.menus.set(MenuType.GAME_OVER, document.getElementById("game-over-overlay"));
            this.menus.set(MenuType.WINNER, document.getElementById("winner-overlay"));
            this.menus.set(MenuType.BETWEEN_ROOMS, document.getElementById("between-rooms-overlay"));
            main.querySelector("#main-menu-deck").addEventListener("click", () => { this.openMenu(MenuType.COLLECTION); });
            main.querySelector("#main-menu-game").addEventListener("click", () => {
                this.startGame();
            });
            let dm = Script.provider.get(Script.DataManager);
            main.querySelectorAll("#main-menu-language img").forEach((element) => {
                let lang = element.dataset?.lang;
                element.addEventListener("click", () => {
                    dm.lang = lang;
                });
            });
            this.updateLangIcons();
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
            document.getElementById("game-over-button").addEventListener("click", () => {
                this.openMenu(MenuType.MAIN);
                Script.provider.get(Script.EnemyManager).reset();
            });
            document.getElementById("end-quit").addEventListener("click", () => {
                this.openMenu(MenuType.MAIN);
                //TODO handle game abort.
                Script.provider.get(Script.EnemyManager).reset();
            });
            if (!Script.provider.get(Script.DataManager).firstPlaythroughDone) {
                main.querySelector("#main-menu-deck").classList.add("hidden");
                main.querySelector("#main-menu-deck-amount").classList.add("hidden");
            }
        }
        openMenu(_menu) {
            let openedMenu = undefined;
            for (let menu of this.menus.entries()) {
                if (menu[0] === _menu) {
                    menu[1].classList.remove("hidden");
                    openedMenu = menu[1];
                }
                else {
                    menu[1].classList.add("hidden");
                }
            }
            return openedMenu;
        }
        endGameMenu(_won, _cardAmt = Script.provider.get(Script.EnemyManager).unlockedCards) {
            let main = this.menus.get(MenuType.MAIN);
            main.querySelector("#main-menu-deck").classList.remove("hidden");
            main.querySelector("#main-menu-deck-amount").classList.remove("hidden");
            if (!Script.provider.get(Script.DataManager).firstPlaythroughDone) {
                main.querySelector("#main-menu-game").disabled = true;
            }
            Script.provider.get(Script.DataManager).firstPlaythroughDone = true;
            let menu = this.openMenu(_won ? MenuType.WINNER : MenuType.GAME_OVER);
            let cardsToDisplay = Script.provider.get(Script.CardCollection).unlockCards(_cardAmt);
            let cardWrapper = menu.querySelector(".game-over-cards");
            let cardElements = [];
            for (let card of cardsToDisplay) {
                cardElements.push(new Script.CardVisual(Script.cards[card], cardWrapper, "undefined", 0, true).htmlElement);
            }
            cardWrapper.replaceChildren(...cardElements);
            let textElement = menu.querySelector("span");
            if (cardsToDisplay.length > 0) {
                textElement.innerText = i18next.t("game.text.cards_unlocked");
            }
            else {
                textElement.innerText = i18next.t("game.text.no_cards_unlocked");
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
            await Script.provider.get(Script.CharacterManager).upgradeCards(5, true, 1, !dataManager.firstPlaythroughDone);
            await this.waitForReady();
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
            Script.provider.get(Script.CardCollection).fillWithPlaceholders(cardsForPauseMenu, cm.maxActiveCardAmount);
            element.replaceChildren(...cardsForPauseMenu);
        }
        openPauseCardPopup = (_event) => {
        };
        ready = () => {
            this.gameIsReady = true;
        };
        async waitForReady() {
            if (this.gameIsReady)
                return;
            let em = Script.provider.get(Script.EnemyManager);
            while (!this.gameIsReady) {
                await em.waitMs(100);
            }
        }
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