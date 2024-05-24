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

        private maxDeckSize: number = 15;
        private maxSelectedSize: number = 5;

        private deckElement: HTMLElement;
        private selectionElement: HTMLElement;
        private collectionElement: HTMLElement;
        private popupElement: HTMLElement;
        private popupButtons: {
            selectionTo: HTMLButtonElement;
            selectionFrom: HTMLButtonElement;
            deckTo: HTMLButtonElement;
            deckFrom: HTMLButtonElement;
        }
        private deckSelectionSizeElement: HTMLElement;

        private selectedCard: string;

        private cardVisuals: Map<string, CardVisual> = new Map();

        constructor(provider: Provider) {
            let dm = provider.get(DataManager);
            this.collection = dm.savedCollectionRaw;
            this.deck = dm.savedDeckRaw;
            this.selection = dm.savedSelectionRaw;

            //TODO remove this
            for (let cardID in cards) {
                if (!this.collection[cardID])
                    this.addCardToCollection(cardID, 1);
            }
        }

        setup() {
            this.selectionElement = document.getElementById("selection");
            this.deckElement = document.getElementById("deck");
            this.collectionElement = document.getElementById("collection-wrapper");
            this.popupElement = document.getElementById("card-popup");
            this.deckSelectionSizeElement = document.getElementById("deck-selection-size");
            this.popupButtons = {
                deckFrom: <HTMLButtonElement>document.getElementById("card-popup-deck-from"),
                deckTo: <HTMLButtonElement>document.getElementById("card-popup-deck-to"),
                selectionFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-from"),
                selectionTo: <HTMLButtonElement>document.getElementById("card-popup-selection-to"),
            }

            this.installListeners();

            for (let cardID in cards) {
                let card = cards[cardID];
                let visual = new CardVisual(card, this.collectionElement);
                this.cardVisuals.set(cardID, visual);

                const openPopup = (_event: PointerEvent) => {
                    this.popupElement.classList.remove("hidden");
                    let cardElement = <HTMLElement>visual.htmlElement.cloneNode(true);
                    cardElement.classList.remove("locked")
                    this.popupElement.querySelector("#card-popup-card").replaceChildren(cardElement);
                    this.selectedCard = cardID;

                    // hide/show correct buttons
                    for (let button in this.popupButtons) {
                        //@ts-ignore
                        this.popupButtons[button].classList.add("hidden");
                        //@ts-ignore
                        this.popupButtons[button].disabled = false;
                    }
                    if (this.collection[cardID]) {
                        // card is in selection, so it's selectable
                        if (this.selection.includes(cardID)) {
                            this.popupButtons.deckTo.classList.remove("hidden");
                            this.popupButtons.selectionFrom.classList.remove("hidden");
                        }
                        else if (this.deck.includes(cardID)) {
                            this.popupButtons.deckFrom.classList.remove("hidden");
                            this.popupButtons.selectionTo.classList.remove("hidden");
                        } else {
                            this.popupButtons.deckTo.classList.remove("hidden");
                            this.popupButtons.selectionTo.classList.remove("hidden");
                        }
                        if (this.deck.length >= this.maxDeckSize) {
                            this.popupButtons.deckTo.disabled = true;
                        }
                        if (this.selection.length >= this.maxSelectedSize) {
                            this.popupButtons.selectionTo.disabled = true;
                        }
                    }
                }

                visual.htmlElement.addEventListener("pointerdown", openPopup);
            }
            this.updateVisuals();

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

        private hidePopup() {
            this.popupElement.classList.add("hidden");
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

        private installListeners() {
            document.getElementById("card-popup-close").querySelector("button").addEventListener("click", () => { this.hidePopup(); })
            document.getElementById("deck-back-button").querySelector("button").addEventListener("click", () => {
                this.hidePopup();
                document.getElementById("main-menu-overlay").classList.remove("hidden");
                document.getElementById("collection-overlay").classList.add("hidden");
            })

            this.popupButtons.selectionTo.addEventListener("click", () => { this.addCardToSelection(this.selectedCard); this.hidePopup(); })
            this.popupButtons.selectionFrom.addEventListener("click", () => { this.removeCardFromSelection(this.selectedCard); this.hidePopup(); })
            this.popupButtons.deckTo.addEventListener("click", () => { this.addCardToDeck(this.selectedCard); this.hidePopup(); })
            this.popupButtons.deckFrom.addEventListener("click", () => { this.removeCardFromDeck(this.selectedCard); this.hidePopup(); })
        }

        private updateVisuals() {
            // collection
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
            for (let card of this.selection) {
                let visual = this.cardVisuals.get(card);
                if (!visual) continue;
                cardsInSelection.push(visual.htmlElement);
            }
            this.fillWithPlaceholders(cardsInSelection, this.maxSelectedSize);
            this.selectionElement.replaceChildren(...cardsInSelection);

            // deck
            let cardsInDeck: HTMLElement[] = [];
            for (let card of this.deck) {
                let visual = this.cardVisuals.get(card);
                if (!visual) continue;
                cardsInDeck.push(visual.htmlElement);
            }
            this.fillWithPlaceholders(cardsInDeck, this.maxDeckSize);
            this.deckElement.replaceChildren(...cardsInDeck);

            // number
            this.deckSelectionSizeElement.innerText = `${this.deck.length + this.selection.length}/${this.maxDeckSize + this.maxSelectedSize}`;
        }

        private fillWithPlaceholders(_array: HTMLElement[], _maxAmount: number) {
            for (let i = _array.length; i < _maxAmount; i++) {
                _array.push(this.getCardPlaceholder());
            }
        }

        private getCardPlaceholder(): HTMLElement {
            let elem = document.createElement("div");
            elem.classList.add("card", "placeholder");
            return elem;
        }
    }
}