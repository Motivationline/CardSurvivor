namespace Script {
    import ƒ = FudgeCore;
    export class DataManager {
        savedCollectionRaw: iCardCollection = {};
        savedDeckRaw: string[] = [];
        savedSelectionRaw: string[] = [];
        private _firstPlaythroughDone: boolean = false;
        private selectedLanguage: string = "en";

        async load() {
            this.savedCollectionRaw = this.catchObjChange(
                <iCardCollection>JSON.parse(localStorage.getItem("collection") ?? "{}"),
                () => { localStorage.setItem("collection", JSON.stringify(this.savedCollectionRaw)) }
            );
            this.savedDeckRaw = this.catchArrayChange(
                <string[]>JSON.parse(localStorage.getItem("deck") ?? "[]"),
                () => { localStorage.setItem("deck", JSON.stringify(this.savedDeckRaw)) }
            );
            this.savedSelectionRaw = this.catchArrayChange(
                <string[]>JSON.parse(localStorage.getItem("selection") ?? "[]"),
                () => { localStorage.setItem("selection", JSON.stringify(this.savedSelectionRaw)) }
            );

            this._firstPlaythroughDone = !!localStorage.getItem("firstPlaythroughDone");
            this.lang = localStorage.getItem("lang") ?? "en";
        }
        
        get lang(){
            return this.selectedLanguage;
        }
        set lang(_language: string){
            if(_language !== "en" &&  _language !== "de") return;
            this.selectedLanguage = _language;
            localStorage.setItem("lang", _language);
            i18next.changeLanguage(this.selectedLanguage);
            updateI18nInDOM();
            provider.get(MenuManager).updateLangIcons();
        }

        get firstPlaythroughDone() { return this._firstPlaythroughDone};
        set firstPlaythroughDone(_value: boolean) {
            if(_value) localStorage.setItem("firstPlaythroughDone", "true");
            if(!_value) localStorage.removeItem("firstPlaythroughDone");
            this._firstPlaythroughDone = _value;
        }

        private catchObjChange<T extends Object>(object: T, onChange: Function): T {
            const handler: ProxyHandler<T> = {
                get(target: any, property, receiver): any {
                    try {
                        return new Proxy(target[property], handler);
                    } catch (err) {
                        return Reflect.get(target, property, receiver);
                    }
                },
                set(target, prop, value, receiver): boolean {
                    let result = Reflect.set(target, prop, value, receiver);
                    if (result) onChange();
                    return result;
                }
            };
            const handlerForArray: ProxyHandler<T> = {}
            return new Proxy(object, handler);
        }
        
        private catchArrayChange<T extends Object>(object: T[], onChange: Function): T[] {
            const handler: ProxyHandler<T[]> = {
                set(target, prop, value, receiver): boolean {
                    let result = Reflect.set(target, prop, value, receiver);
                    if (result) onChange();
                    return result;
                }
            };

            return new Proxy(object, handler);
        }
    }
}