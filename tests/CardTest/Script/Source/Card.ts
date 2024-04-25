namespace Script {
    export class Card {
        public static template: HTMLTemplateElement;
        private static canvas: HTMLCanvasElement;
        #name: string;
        #image: string;
        #text: string;
        #htmlElement: HTMLElement;
        constructor(_name: string, _text: string, _image: string, _parent: HTMLElement) {
            this.#name = _name;
            this.#text = _text;
            this.#image = _image;

            this.#htmlElement = <HTMLElement>Card.template.content.cloneNode(true);

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

            let nameElement = <HTMLElement>this.#htmlElement.querySelector(".card-name");
            nameElement.style.fontSize = `calc(var(--card-size) / 100 * ${fontSize})`;

            // fill card with data
            nameElement.innerHTML = this.#name.toLocaleUpperCase();
            requestAnimationFrame(() => {
                // turn into circle
                new CircleType(nameElement).radius(cardWidth * 2);
            });
            (<HTMLElement>this.#htmlElement.querySelector(".card-text")).innerText = this.#text;
            (<HTMLImageElement>this.#htmlElement.querySelector(".card-image img")).src = "Assets/Cards/" + this.#image;
        }

        get htmlElement(): HTMLElement {
            return this.#htmlElement;
        }

        private getTextWidth(_text: string, _font: string) {
            const canvas = Card.canvas || (Card.canvas = document.createElement("canvas"));
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
        Card.template = <HTMLTemplateElement>document.getElementById("card");
    }
}