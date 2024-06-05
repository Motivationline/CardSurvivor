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
            selectionToFrom: HTMLButtonElement;
            deckTo: HTMLButtonElement;
            deckFrom: HTMLButtonElement;
            deckToFrom: HTMLButtonElement;
        }
        private deckSelectionSizeElement: HTMLElement;

        private selectedCard: string;

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
            this.popupElement = document.getElementById("card-popup");
            this.deckSelectionSizeElement = document.getElementById("deck-selection-size");
            this.popupButtons = {
                deckFrom: <HTMLButtonElement>document.getElementById("card-popup-deck-from"),
                deckToFrom: <HTMLButtonElement>document.getElementById("card-popup-deck-to-from"),
                deckTo: <HTMLButtonElement>document.getElementById("card-popup-deck-to"),
                selectionFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-from"),
                selectionToFrom: <HTMLButtonElement>document.getElementById("card-popup-selection-to-from"),
                selectionTo: <HTMLButtonElement>document.getElementById("card-popup-selection-to"),
            }

            this.installListeners();

            for (let cardID in cards) {
                let card = cards[cardID];
                let visual = new CardVisual(card, this.collectionElement, cardID);
                this.cardVisuals.set(cardID, visual);

                visual.htmlElement.addEventListener("click", this.openPopup);

                visual.htmlElement.dataset.card = cardID;
            }
            this.updateVisuals(true);

        }

        private openPopup = (_event: MouseEvent) => {
            let cardID = (<HTMLElement>_event.currentTarget).dataset.card;
            if (!cardID) return;
            // TODO change this to not create a popup
            // if (!this.collection[cardID]) return;
            if (!this.collection[cardID]) {
                this.addCardToCollection(cardID, 1);
                return;
            }
            let visual = this.cardVisuals.get(cardID);
            if (!visual) return;

            this.popupElement.classList.remove("hidden");
            let cardElement = <HTMLElement>visual.htmlElement.cloneNode(true);
            cardElement.classList.remove("locked", "selected")
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
                    this.popupButtons.deckToFrom.classList.remove("hidden");
                    this.popupButtons.selectionFrom.classList.remove("hidden");
                }
                else if (this.deck.includes(cardID)) {
                    this.popupButtons.deckFrom.classList.remove("hidden");
                    this.popupButtons.selectionToFrom.classList.remove("hidden");
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

        addCardToCollection(_name: string, _amount: number) {
            if (!this.collection[_name]) {
                this.collection[_name] = { amount: 0, lvl: 0 };
            }
            this.collection[_name].amount += _amount;
            this.updateVisuals(true);
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
            document.getElementById("card-popup-close").querySelector("img").addEventListener("click", () => { this.hidePopup(); })
            document.getElementById("deck-back-button").querySelector("button").addEventListener("click", () => {
                this.hidePopup();
                provider.get(MenuManager).openMenu(MenuType.MAIN);
            })

            this.popupButtons.selectionTo.addEventListener("click", () => { this.addCardToSelection(this.selectedCard); this.hidePopup(); })
            this.popupButtons.selectionToFrom.addEventListener("click", () => { this.addCardToSelection(this.selectedCard); this.hidePopup(); })
            this.popupButtons.selectionFrom.addEventListener("click", () => { this.removeCardFromSelection(this.selectedCard); this.hidePopup(); })
            this.popupButtons.deckTo.addEventListener("click", () => { this.addCardToDeck(this.selectedCard); this.hidePopup(); })
            this.popupButtons.deckToFrom.addEventListener("click", () => { this.addCardToDeck(this.selectedCard); this.hidePopup(); })
            this.popupButtons.deckFrom.addEventListener("click", () => { this.removeCardFromDeck(this.selectedCard); this.hidePopup(); })

            this.popupElement.addEventListener("click", (_e) => {
                if (_e.target === this.popupElement) this.hidePopup();
            })
        }

        private updateVisuals(_fullReset: boolean = false) {
            // collection
            let allCardsForCollection: HTMLElement[] = [];
            let collectionEntires: string[] = Object.keys(this.collection).sort(this.compareRarity);
            for (let cardID of collectionEntires) {
                let visual = this.cardVisuals.get(cardID);
                if (!visual) continue;
                allCardsForCollection.push(visual.htmlElement);
                visual.htmlElement.classList.remove("locked", "selected");
            }
            for (let cardID in cards) {
                if (this.collection[cardID]) continue;
                let visual = this.cardVisuals.get(cardID);
                if (!visual) continue;
                allCardsForCollection.push(visual.htmlElement);
                if(!_fullReset){
                    visual.htmlElement.classList.add("locked");
                }
            }
            // for debugging we're adding a bunch of empty stuff to fill up to 100.
            // this.fillWithPlaceholders(allCardsForCollection, 100);

            if (_fullReset) {
                this.collectionElement.replaceChildren(...allCardsForCollection);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        this.updateVisuals();
                    });
                });
            } else {
                // selection
                this.putCardsInDeck(this.selection, this.selectionElement, this.maxSelectedSize);

                // deck
                this.putCardsInDeck(this.deck, this.deckElement, this.maxDeckSize);
            }

            // number
            this.deckSelectionSizeElement.innerText = `${this.deck.length + this.selection.length}/${this.maxDeckSize + this.maxSelectedSize}`;
        }

        private putCardsInDeck(_selection: string[], _parent: HTMLElement, _maxSize: number) {
            let cards: HTMLElement[] = [];
            for (let card of _selection) {
                let visual = this.cardVisuals.get(card);
                if (!visual) continue;
                let clone = <HTMLElement>visual.htmlElement.cloneNode(true);
                clone.classList.remove("selected", "locked");
                clone.addEventListener("click", this.openPopup);
                cards.push(clone);
                visual.htmlElement.classList.add("selected");
            }
            this.fillWithPlaceholders(cards, _maxSize);
            _parent.replaceChildren(...cards);
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

        private compareRarity = (a: string, b: string): number => {
            let cardA = cards[a];
            let cardB = cards[b];
            if (!cardA) return -1;
            if (!cardB) return 1;
            return this.getRarityNumber(cardA.rarity) - this.getRarityNumber(cardB.rarity);
        }

        private getRarityNumber(_rarity: CardRarity): number {
            if (_rarity === CardRarity.UNCOMMON) return 1;
            if (_rarity === CardRarity.RARE) return 2;
            if (_rarity === CardRarity.EPIC) return 3;
            if (_rarity === CardRarity.LEGENDARY) return 4;
            return 0;
        }
    }
}