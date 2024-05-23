namespace Script {
    export interface iCardCollection {
        [id: string]: {
            lvl: number,
            amount: number,
        }
    }
    export class CardCollection {
        private collection: iCardCollection;
        private deck: string[];
        private selection: string[];

        private deckElement: HTMLElement;
        private selectionElement: HTMLElement;
        private collectionElement: HTMLElement;

        private cardVisuals: Map<string, CardVisual> = new Map();

        constructor(provider: Provider) {
            let dm = provider.get(DataManager);
            this.collection = dm.savedCollectionRaw;
            this.deck = dm.savedDeckRaw;
            this.selection = dm.savedSelectionRaw;
        }

        setup() {
            this.selectionElement = document.getElementById("selection");
            this.deckElement = document.getElementById("deck");
            this.collectionElement = document.getElementById("collection-wrapper");

            for(let cardID in cards){
                let card = cards[cardID];
                let visual = new CardVisual(card, this.collectionElement);
                this.cardVisuals.set(cardID, visual);
            }
            this.updateVisuals(true);
        }

        addCardToCollection(_name: string, _amount: number) {
            if (!this.collection[_name]) {
                this.collection[_name] = { amount: 0, lvl: 0 };
            }
            this.collection[_name].amount += _amount;
        }

        getCardLevel(_name: string) {
            return this.collection[_name]?.lvl ?? 0;
        }

        addCardToDeck(_name: string) {
            this.addToArray(_name, this.deck);
            this.removeCardFromSelection(_name, false);
            this.updateVisuals();
        }

        removeCardFromDeck(_name: string, _updateVisuals: boolean = true) {
            this.removeFromArray(_name, this.deck);
            if (_updateVisuals) this.updateVisuals();
        }

        addCardToSelection(_name: string) {
            this.addToArray(_name, this.selection);
            this.removeCardFromDeck(_name, false);
            this.updateVisuals();
        }

        removeCardFromSelection(_name: string, _updateVisuals: boolean = true) {
            this.removeFromArray(_name, this.selection);
            if (_updateVisuals) this.updateVisuals();
        }

        private removeFromArray<T>(_element: T, _array: T[]) {
            let index = _array.indexOf(_element);
            if (index >= 0) {
                _array.splice(index, 1);
            }
        }

        private addToArray<T>(_element: T, _array: T[]) {
            if (_array.includes(_element)) return;
            _array.push(_element);
        }

        private updateVisuals(_updateCollection: boolean = false) {
            // collection
            if(!_updateCollection) return; 
            let allCardsForCollection: HTMLElement[] = [];
            for (let cardID in this.collection) {
                let visual = this.cardVisuals.get(cardID);
                if (!visual) continue;
                allCardsForCollection.push(visual.htmlElement);
            }
            for (let cardID in cards) {
                if (this.collection[cardID]) continue;
                let visual = this.cardVisuals.get(cardID);
                if (!visual) continue;
                allCardsForCollection.push(visual.htmlElement);
                visual.htmlElement.classList.add("locked");
            }
            // for debugging we're adding a bunch of empty stuff to fill up to 100.
            this.fillWithPlaceholders(allCardsForCollection, 100);

            this.collectionElement.replaceChildren(...allCardsForCollection);
            
            // selection
            let cardsInSelection: HTMLElement[] = [];
            for(let card of this.selection){
                let visual = this.cardVisuals.get(card);
                if(!visual) continue;
                cardsInSelection.push(visual.htmlElement);
            }
            this.fillWithPlaceholders(cardsInSelection, 5);
            this.selectionElement.replaceChildren(...cardsInSelection);
            
            // deck
            let cardsInDeck: HTMLElement[] = [];
            for(let card of this.deck){
                let visual = this.cardVisuals.get(card);
                if(!visual) continue;
                cardsInDeck.push(visual.htmlElement);
            }
            this.fillWithPlaceholders(cardsInDeck, 15);
            this.deckElement.replaceChildren(...cardsInDeck);

        }

        private fillWithPlaceholders(_array: HTMLElement[], _maxAmount: number) {
            for(let i = _array.length; i < _maxAmount; i++){
                _array.push(this.getCardPlaceholder());
            }
        }

        private getCardPlaceholder(): HTMLElement{
            let elem = document.createElement("div");
            elem.classList.add("card", "placeholder");
            return elem;
        }
    }
}