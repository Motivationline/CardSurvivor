namespace Script {
    export class CardVisual {
        public static template: HTMLTemplateElement;
        private static canvas: HTMLCanvasElement;
        #name: string;
        #image: string;
        #text: string;
        #htmlElement: HTMLElement;

        constructor(_card: iCard, _parent: HTMLElement, _nameFallback: string = "unknown", _level: number = 0, _disableCircleType: boolean = false) {
            this.#name = _card.name ?? _nameFallback;
            this.#text = this.getFirstTranslatableText(_card.description ?? "unknown", _card.description, `card.${this.#name}.description`);
            this.#image = _card.image;

            this.#name = i18next.t(`card.${this.#name}.name`).toLocaleUpperCase();

            this.#htmlElement = <HTMLElement>CardVisual.template.content.cloneNode(true).childNodes[1];

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
            let nameElement = <HTMLElement>this.#htmlElement.querySelector(".card-name");
            nameElement.style.fontSize = `calc(var(--card-size) / 100 * ${fontSize})`;

            // fill card with data
            nameElement.innerHTML = this.#name;
            requestAnimationFrame(() => {
                // turn into circle
                if(!_disableCircleType)
                    new CircleType(nameElement).radius(cardWidth * 2);
            });
            (<HTMLElement>this.#htmlElement.querySelector(".card-text")).innerText = this.#text;
            (<HTMLImageElement>this.#htmlElement.querySelector(".card-image img")).src = "Assets/Cards/Items/" + this.#image;
            this.#htmlElement.style.setProperty("--delay", `${Math.random() * -10}s`);
            this.#htmlElement.classList.add(_card.rarity);
            this.#htmlElement.classList.add(`level-${_level}`);
        }

        get htmlElement(): HTMLElement {
            return this.#htmlElement;
        }

        private getTextWidth(_text: string, _font: string) {
            const canvas = CardVisual.canvas || (CardVisual.canvas = document.createElement("canvas"));
            const context = canvas.getContext("2d");
            context.font = _font;
            const metrics = context.measureText(_text);
            return metrics.width;
        }

        private getCanvasFont(el = document.body) {
            const fontWeight = this.getCssStyle(el, 'font-weight') || 'normal';
            const fontSize = this.getCssStyle(el, 'font-size') || '10vh';
            const fontFamily = this.getCssStyle(el, 'font-family') || 'Luckiest Guy';

            return `${fontWeight} ${fontSize} ${fontFamily}`;
        }

        private getFirstTranslatableText(_fallback: string, ..._texts: string[]): string {
            for (let text of _texts) {
                if (!text) continue;
                let translatedText = i18next.t(text);
                if (translatedText !== text) {
                    return translatedText;
                }
            }
            return "";
        }


        private getCssStyle(element: HTMLElement, prop: string) {
            return window.getComputedStyle(element, null).getPropertyValue(prop);
        }
    }

    document.addEventListener("DOMContentLoaded", initCardTemplate);
    function initCardTemplate() {
        CardVisual.template = <HTMLTemplateElement>document.getElementById("card");
    }
}