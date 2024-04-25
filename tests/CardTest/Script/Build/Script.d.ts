declare namespace Script {
    class Card {
        #private;
        static template: HTMLTemplateElement;
        private static canvas;
        constructor(_name: string, _text: string, _image: string, _parent: HTMLElement);
        get htmlElement(): HTMLElement;
        private getTextWidth;
        private getCanvasFont;
        private getCssStyle;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    function initI18n(..._languages: string[]): Promise<void>;
}
declare namespace Script {
}
