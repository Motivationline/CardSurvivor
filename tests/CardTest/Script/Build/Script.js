"use strict";
var Script;
(function (Script) {
    class Card {
        static template;
        static canvas;
        #name;
        #image;
        #text;
        #htmlElement;
        constructor(_name, _text, _image, _parent) {
            this.#name = _name;
            this.#text = _text;
            this.#image = _image;
            this.#htmlElement = Card.template.content.cloneNode(true);
            // figure out how large the title text should be
            let fontSize = 10;
            let heightRaw = getComputedStyle(_parent).getPropertyValue("--card-size");
            let tmpDiv = document.createElement("div");
            tmpDiv.style.width = heightRaw;
            document.documentElement.appendChild(tmpDiv);
            let height = tmpDiv.offsetWidth;
            document.documentElement.removeChild(tmpDiv);
            let cardWidth = height * (15 / 21) - 0.05 * height;
            let currentTextWidth = this.getTextWidth(this.#name, `normal  ${height / 100 * fontSize}px 'Luckiest Guy'`);
            let factor = cardWidth / currentTextWidth;
            fontSize *= factor;
            let nameElement = this.#htmlElement.querySelector(".card-name");
            nameElement.style.fontSize = `calc(var(--card-size) / 100 * ${fontSize})`;
            // fill card with data
            nameElement.innerHTML = this.#name.toLocaleUpperCase();
            requestAnimationFrame(() => {
                // turn into circle
                new CircleType(nameElement).radius(cardWidth * 2);
            });
            this.#htmlElement.querySelector(".card-text").innerText = this.#text;
            this.#htmlElement.querySelector(".card-image img").src = "Assets/Cards/" + this.#image;
        }
        get htmlElement() {
            return this.#htmlElement;
        }
        getTextWidth(_text, _font) {
            const canvas = Card.canvas || (Card.canvas = document.createElement("canvas"));
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
        getCssStyle(element, prop) {
            return window.getComputedStyle(element, null).getPropertyValue(prop);
        }
    }
    Script.Card = Card;
    document.addEventListener("DOMContentLoaded", initCardTemplate);
    function initCardTemplate() {
        Card.template = document.getElementById("card");
    }
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
                let resource = await (await fetch(`Text/${lang}.json`)).json();
                resources[lang] = { translation: resource };
            }
            catch (error) {
                console.error(`failed to load language ${lang} due to error:`, error);
            }
        }
        i18next.init({
            lng: "en",
            fallbackLng: "de",
            resources,
            debug: true,
        });
    }
    Script.initI18n = initI18n;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        console.log("start");
        viewport = _event.detail;
        await Script.initI18n("en", "de");
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        let card = new Script.Card(i18next.t("card.example.name"), i18next.t("card.example.text"), "example.gif", document.getElementById("card-wrapper"));
        document.getElementById("card-wrapper").appendChild(card.htmlElement);
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map