namespace Script {
    export class CardVisual {
        public static template: HTMLTemplateElement;
        private static canvas: HTMLCanvasElement;
        #name: string;
        #image: string;
        #text: string;
        #htmlElement: HTMLElement;

        constructor(_card: iCard, _parent: HTMLElement, _nameFallback: string = "unknown") {
            this.#name = _card.name ?? _nameFallback;
            this.#text = _card.description ?? i18next.t(`card.${this.#name}.description`);
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
                new CircleType(nameElement).radius(cardWidth * 2);
            });
            (<HTMLElement>this.#htmlElement.querySelector(".card-text")).innerText = this.#text;
            (<HTMLImageElement>this.#htmlElement.querySelector(".card-image img")).src = "Assets/Cards/Items/" + this.#image;
            this.#htmlElement.style.setProperty("--delay", `${Math.random() * -10}s`);
            this.#htmlElement.classList.add(_card.rarity);
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


        private getCssStyle(element: HTMLElement, prop: string) {
            return window.getComputedStyle(element, null).getPropertyValue(prop);
        }
    }

    document.addEventListener("DOMContentLoaded", initCardTemplate);
    function initCardTemplate() {
        CardVisual.template = <HTMLTemplateElement>document.getElementById("card");
    }
}