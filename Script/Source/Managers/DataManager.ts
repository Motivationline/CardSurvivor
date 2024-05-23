namespace Script {
    import ƒ = FudgeCore;
    export class DataManager {
        savedCollectionRaw: iCardCollection = {};
        savedDeckRaw: string[] = [];
        savedSelectionRaw: string[] = [];

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