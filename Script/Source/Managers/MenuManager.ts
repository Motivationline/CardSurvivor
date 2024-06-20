namespace Script {
    export enum MenuType {
        NONE,
        MAIN,
        COLLECTION,
        SETTINGS,
        PAUSE,
        CARD_UPGRADE,
        END_CONFIRM,
        GAME_OVER,
        BETWEEN_ROOMS,
    }
    export class MenuManager {
        private menus: Map<MenuType, HTMLElement> = new Map();
        private prevGameState: GAMESTATE = GAMESTATE.PLAYING;
        private gameIsReady = false;


        constructor() {
            document.addEventListener("interactiveViewportStarted", <EventListener>this.ready);
        }

        public setup() {
            let main: HTMLElement = document.getElementById("main-menu-overlay");
            this.menus.set(MenuType.MAIN, main);
            this.menus.set(MenuType.COLLECTION, document.getElementById("collection-overlay"));
            this.menus.set(MenuType.SETTINGS, document.getElementById("settings-overlay"));
            this.menus.set(MenuType.PAUSE, document.getElementById("pause-overlay"));
            this.menus.set(MenuType.CARD_UPGRADE, document.getElementById("card-upgrade-popup"));
            this.menus.set(MenuType.END_CONFIRM, document.getElementById("end-confirm"));
            this.menus.set(MenuType.GAME_OVER, document.getElementById("game-over-overlay"));
            this.menus.set(MenuType.BETWEEN_ROOMS, document.getElementById("between-rooms-overlay"));

            main.querySelector("#main-menu-deck").addEventListener("click", () => { this.openMenu(MenuType.COLLECTION) });
            main.querySelector("#main-menu-game").addEventListener("click", () => {
                this.startGame();
            });

            document.getElementById("game-overlay-pause").addEventListener("click", () => {
                this.openPauseMenu();
            });
            document.getElementById("pause-resume").addEventListener("click", () => {
                this.openMenu(MenuType.NONE);
                gameState = this.prevGameState;
                ƒ.Time.game.setScale(1);
            });
            document.getElementById("pause-quit").addEventListener("click", () => { this.openMenu(MenuType.END_CONFIRM) });
            document.getElementById("end-abort").addEventListener("click", () => { this.openPauseMenu() });
            document.getElementById("game-over-button").addEventListener("click", () => {
                this.openMenu(MenuType.MAIN);
                provider.get(EnemyManager).reset();
            });
            document.getElementById("end-quit").addEventListener("click", () => {
                this.openMenu(MenuType.MAIN);
                //TODO handle game abort.
                provider.get(EnemyManager).reset();
            });
        }

        public openMenu(_menu: MenuType) {
            for (let menu of this.menus.entries()) {
                if (menu[0] === _menu) {
                    menu[1].classList.remove("hidden");
                } else {
                    menu[1].classList.add("hidden");
                }
            }
        }

        private async startGame() {
            this.openMenu(MenuType.NONE);
            gameState = GAMESTATE.ROOM_CLEAR;

            let dataManager = provider.get(DataManager);
            let cardManager = provider.get(CardManager);
            cardManager.setCards([], dataManager.savedDeckRaw);
            let character = provider.get(CharacterManager).character;
            character?.reset();
            await provider.get(CharacterManager).upgradeCards(5, true, 1);
            await this.waitForReady();
            provider.get(EnemyManager).nextRoom();
        }

        public openPauseMenu() {
            if (gameState !== GAMESTATE.PAUSED)
                this.prevGameState = gameState;
            gameState = GAMESTATE.PAUSED;
            ƒ.Time.game.setScale(0);

            this.openMenu(MenuType.PAUSE);

            let cardsForPauseMenu: HTMLElement[] = [];
            let cm = provider.get(CardManager);
            let element = document.getElementById("pause-overlay-cards");
            for (let card of cm.activeCards) {
                let cv = new CardVisual(card, element, card.id, card.level);
                cardsForPauseMenu.push(cv.htmlElement);
                cv.htmlElement.addEventListener("click", this.openPauseCardPopup);
            }
            provider.get(CardCollection).fillWithPlaceholders(cardsForPauseMenu, cm.maxActiveCardAmount);
            element.replaceChildren(...cardsForPauseMenu);
        }

        private openPauseCardPopup = (_event: MouseEvent) => {

        }

        private ready = () => {
            this.gameIsReady = true;
        }

        private async waitForReady(): Promise<void> {
            if (this.gameIsReady) return;
            let em = provider.get(EnemyManager);
            while(!this.gameIsReady) {
                await em.waitMs(100);
            }
        }
    }
}