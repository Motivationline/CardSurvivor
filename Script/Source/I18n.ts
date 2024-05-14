
namespace Script {
    export async function initI18n(..._languages: string[]) {
        let resources: ({ [key: string]: any }) = {}
        for (let lang of _languages) {
            try {
                let resource = await (await fetch(`Text/${lang}.json`)).json();
                resources[lang] = {translation: resource};
            } catch (error) {
                console.error(`failed to load language ${lang} due to error:`, error);
            }
        }

        i18next.init({
            lng: "en",
            fallbackLng: "de",
            resources,
            debug: true,
        })
    }

}