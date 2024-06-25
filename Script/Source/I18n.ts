
namespace Script {
    export async function initI18n(..._languages: string[]) {
        let resources: ({ [key: string]: any }) = {}
        for (let lang of _languages) {
            try {
                let resource = await (await fetch(`Assets/Text/${lang}.json`)).json();
                resources[lang] = { translation: resource };
            } catch (error) {
                console.error(`failed to load language ${lang} due to error:`, error);
            }
        }

        i18next.init({
            lng: "de",
            fallbackLng: "en",
            resources,
            debug: true,
        })
    }

    const elementsWithLangData: HTMLElement[] = [];
    export function updateI18nInDOM() {
        if (elementsWithLangData.length > 0) {
            for (let element of elementsWithLangData) {
                element.innerText = i18next.t(element.dataset.langText);
            }
            updateCardsInDeck();
            return;
        }

        let elementsToCheck: Element[] = [document.documentElement];
        while (elementsToCheck.length > 0) {
            let element = <HTMLElement>elementsToCheck.pop();
            elementsToCheck.push(...Array.from(element.children));
            if (element.dataset?.langText) {
                elementsWithLangData.push(element);
                element.innerText = i18next.t(element.dataset.langText);
            }
        }
    }

    function updateCardsInDeck(){
        let overlay = document.getElementById("collection-overlay");
        overlay.classList.remove("hidden");
        provider.get(CardCollection).updateVisuals(true);
    }
}