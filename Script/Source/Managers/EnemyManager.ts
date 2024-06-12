namespace Script {
    const pools: Pools = {
        "electronics": [
            ["microwave", "chair"],
            ["toaster", "closet"],
            ["motor"],
            ["ventilator"],
            ["chair"],
        ]
    }

    const rooms: Rooms = {
        "electronics": [
            // room 1
            {
                duration: 20,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 5,
                    duration: 4,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
            },
            // room 2
            {
                duration: 30,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 6,
                    duration: 5,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 1 }
                        ],
                        amount: 4,
                        duration: 10,
                    }
                ]
            },
            // room 3
            {
                duration: 40,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 8,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 1, weight: 4 },
                            { pool: 0, elite: true },
                        ],
                        amount: 6,
                        duration: 10,
                    }
                ],
            },
            // room bonus
            {
                duration: Infinity,
                reward: true,
            },
            // room 4
            {
                duration: 50,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 55 },
                        { pool: 1, weight: 25 },
                        { pool: 2, weight: 20 },
                    ],
                    amount: 10,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 2 },
                        ],
                        amount: 4,
                        duration: 10,
                    }
                ],
            },
            // room 5
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 1,
                    duration: 60,
                    enemies: ["microwave-boss"],
                },
                waveAmount: 1
            },
            //room 6
            {
                duration: 60,
                bonus: {
                    multiplier: {
                        health: 1.5,
                    }
                }
            }
        ]
    }


    export class EnemyManager {
        private characterManager: CharacterManager;
        private config: Config;
        private enemyScripts: Enemy[] = [];
        private enemies: EnemyGraphInstance[] = [];
        private enemyGraph: ƒ.Graph;
        private enemyNode: ƒ.Node;
        private currentWave: number = -1;
        private currentRoom: number = -1;
        private currentArea: string = "electronics";
        private currentWaveEnd: number = 0;
        private currentRoomEnd: number = 0;

        private currentXP: number = 0;
        private xpElement: HTMLElement;

        private timeElement: HTMLElement = document.getElementById("timer");

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            document.addEventListener("interactiveViewportStarted", <EventListener>this.start);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded);
            this.characterManager = provider.get(CharacterManager);
            this.config = provider.get(Config);

            document.addEventListener("keydown", this.debugEvents);
            document.getElementById("debug-next-wave").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-end-room").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-next-room").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-kill-enemies").addEventListener("touchstart", this.debugButtons);
            this.xpElement = document.getElementById("xp-display");
        }

        public setup() {
            ƒ.Debug.log("EnemyManager setup");
        }

        private start = (_event: CustomEvent) => {
            let viewport: ƒ.Viewport = _event.detail;
            this.enemyNode = viewport.getBranch().getChildrenByName("enemies")[0];
        }
        private loaded = async () => {
            this.enemyGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("enemy")[0];
        }
        private update = () => {
            if (gameState === GAMESTATE.PAUSED) return;
            if (gameState === GAMESTATE.IDLE) return;
            let character = this.characterManager.character;
            if (!character) return;

            this.roomManagement();

            // update enemies
            let time = ƒ.Loop.timeFrameGame / 1000;
            for (let enemy of this.enemyScripts) {
                enemy.update(character.node.mtxWorld.translation, time);
            }

            // dmg numbers
            for (let dmg of this.dmgDisplayElements) {
                let pos = viewport.pointWorldToClient(dmg[1]);
                dmg[0].style.top = pos.y + "px";
                dmg[0].style.left = pos.x + "px";
            }
        }
        nextWaveOverride = false;
        private async roomManagement() {
            if (gameState === GAMESTATE.ROOM_CLEAR) return;
            let currentTime = ƒ.Time.game.get();
            let nextWave = this.getWave(this.currentArea, this.currentRoom, this.currentWave + 1);
            // should we start a new wave?
            if (
                nextWave && (
                    this.nextWaveOverride ||
                    this.currentWave < 0 || // no wave yet
                    this.currentWaveEnd < currentTime || // wave timer is up
                    this.enemies.length <= (nextWave?.minEnemiesOverride ?? 0) // wave min enemies are reached
                )
            ) {
                this.nextWaveOverride = false;
                if (await this.spawnWave(nextWave)) {
                    this.currentWave++;
                }
            }

            // no more enenmies left, everything was killed
            // @ts-expect-error
            if (this.enemies.length === 0 && gameState !== GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }

            // is the rooms timer up?
            // TODO special cases for boss rooms and no-damage runs
            // @ts-expect-error
            if (this.currentRoomEnd < currentTime && gameState !== GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }

            // update timer
            this.timeElement.innerText = `room ${this.currentRoom} ends in: ${Math.floor(this.currentRoomEnd - currentTime)}ms - wave ${this.currentWave} ends in: ${Math.floor(this.currentWaveEnd - currentTime)}ms`;

        }


        private async endRoom(_cleanup: boolean = false) {
            gameState = GAMESTATE.PAUSED;
            while (this.enemyScripts.length > 0) {
                this.enemyScripts[0].hit({ damage: Infinity });
            }
            provider.get(ProjectileManager).cleanup();
            console.log(`Room ${this.currentRoom} done. Press N to continue.`);
            ƒ.Time.game.setScale(0);
            
            if(!_cleanup){
                // collect XP
                while(this.currentXP >= 100){
                    this.currentXP -= 100;
                    await this.characterManager.upgradeCards();
                }
                this.nextRoom();
            }
        }

        public nextRoom() {
            ƒ.Time.game.setScale(1);
            this.currentRoom++;
            this.currentWave = -1;
            this.currentWaveEnd = 0;

            if (rooms[this.currentArea].length <= this.currentRoom) {
                console.log("LAST ROOM CLEARED");
                gameState = GAMESTATE.IDLE;
                return;
            }
            let room = rooms[this.currentArea][this.currentRoom];
            this.currentRoomEnd = ƒ.Time.game.get() + room.duration * 1000;

            gameState = GAMESTATE.PLAYING;
            if (room.reward) {
                //TODO spawn reward stuff
            }
        }


        private async spawnWave(wave: Wave): Promise<boolean> {
            if (!wave) {
                this.currentWaveEnd = Infinity;
                return false;
            }
            console.log(`spawning wave ${this.currentWave + 1} in room ${this.currentRoom}`);

            this.currentWaveEnd = ƒ.Time.game.get() + wave.duration * 1000;

            let { totalWeight, enemies, elites } = this.getEnemyList(wave);
            for (let elite of elites) {
                this.spawnEnemy(elite);
            }
            for (let i = 0; i < wave.amount; i++) {
                let x = Math.random() * totalWeight;
                for (let enemy of enemies) {
                    x -= enemy.weight;
                    if (x <= 0) {
                        await this.spawnEnemy(enemy.name);
                        break;
                    }
                }
            }

            return true;
        }

        private getWave(_area: string, _room: number, _wave: number): Wave {
            if (!rooms[_area]) return undefined;
            if (!rooms[_area][_room]) return undefined;
            if (rooms[_area][_room].waveAmount !== undefined && rooms[_area][_room].waveAmount <= _wave) return undefined;
            return rooms[_area][_room].waves?.[_wave] ?? rooms[_area][_room].defaultWave;
        }

        private getRoomModifier(_area: string, _room: number): PassiveCardEffectObject | undefined {
            if(!rooms[_area]) return undefined;
            if(!rooms[_area][_room]) return undefined;
            return rooms[_area][_room].bonus;
        }

        private poolSelections: string[] = [];
        private getEnemyList(_wave: Wave): { totalWeight: number, enemies: { name: string, weight: number }[], elites: string[] } {
            let totalWeight = 0;
            let enemies: { name: string, weight: number }[] = [];
            let elites: string[] = [];

            for (let enemy of _wave.enemies) {
                if (typeof enemy === "string") {
                    enemies.push({ name: enemy, weight: 1 });
                    totalWeight++;
                } else {
                    if (!this.poolSelections[enemy.pool]) {
                        this.poolSelections[enemy.pool] = pools[this.currentArea][enemy.pool][Math.floor(Math.random() * pools[this.currentArea][enemy.pool].length)];
                    }
                    let name: string = this.poolSelections[enemy.pool];
                    if (enemy.elite) {
                        elites.push(name);
                    } else {
                        enemy.weight = enemy.weight ?? 1;
                        enemies.push({ name, weight: enemy.weight });
                        totalWeight += enemy.weight;
                    }
                }
            }

            return { totalWeight, enemies, elites };
        }

        private async spawnEnemy(_enemy: string, _relativePosition: ƒ.Vector3 = ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5)) {
            let newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(_relativePosition);
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies[_enemy], this.getRoomModifier(this.currentArea, this.currentRoom));
            this.enemyScripts.push(enemyScript);
        }

        private debugEvents = (_event: KeyboardEvent) => {
            switch (_event.key) {
                case "v":
                    this.nextWaveOverride = true;
                    break;
                case "b":
                    this.endRoom();
                    break;
                case "n":
                    this.nextRoom();
                    break;
                case "k":
                    this.debugRemoveEnemies();
                    break;
                case "l":
                    this.characterManager.upgradeCards();
                    break;
                case "Escape":
                    if (gameState === GAMESTATE.PLAYING || gameState === GAMESTATE.ROOM_CLEAR)
                        this.provider.get(MenuManager).openPauseMenu();
                    break;
            }
        }

        private debugButtons = (_event: TouchEvent) => {
            switch ((<HTMLElement>_event.target).id) {
                case "debug-next-wave":
                    this.nextWaveOverride = true;
                    break;
                case "debug-end-room":
                    this.endRoom();
                    break;
                case "debug-next-room":
                    this.nextRoom();
                    break;
                case "debug-kill-enemies":
                    this.debugRemoveEnemies();
                    break;
            }
        }

        private debugRemoveEnemies(_amt: number = 5) {

            for (let i = 0; i < 5; i++) {
                if (this.enemyScripts.length > 0) {
                    this.enemyScripts[0].hit({ damage: Infinity });
                }
            }
        }

        private async spawnEnemies() {
            if (this.enemies.length >= 2) {
                return;
            }

            // debug: spawn two different enemies
            /*
            let newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies["toaster"]);
            this.enemyScripts.push(enemyScript);

            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies["chair"]);
            this.enemyScripts.push(enemyScript);


            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation.clone;
            newEnemyGraphInstance.mtxLocal.translate(new ƒ.Vector3(0, 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: this.config.getAnimation("motor", "move"),
                speed: 3,
                directionOverride: ƒ.Vector3.Y(-1),
            });
            this.enemyScripts.push(enemyScript);
            */
        }

        public removeEnemy(_enemy: Enemy) {
            let index = this.enemyScripts.findIndex((n) => n === _enemy);
            if (index >= 0) {
                this.enemyScripts.splice(index, 1);
                ƒ.Recycler.storeMultiple(...this.enemies.splice(index, 1));
            }
            _enemy.node.getParent()?.removeChild(_enemy.node);
        }

        public getEnemy(_mode: ProjectileTargetMode, _pos: ƒ.Vector3 = provider.get(CharacterManager).character.node.mtxWorld.translation, _exclude: EnemyGraphInstance[] = [], _maxDistance: number = 20,): EnemyGraphInstance | undefined {
            if (!this.enemies || this.enemies.length === 0) return undefined;
            _maxDistance *= _maxDistance;
            let enemies = [...this.enemies];
            if (_mode === ProjectileTargetMode.RANDOM) {
                //TODO: make sure chosen enemy is visible on screen
                while (enemies.length > 0) {
                    let index = Math.floor(Math.random() * this.enemies.length)
                    let enemy = this.enemies.splice(index, 1)[0];
                    if (_exclude.includes(enemy)) continue;
                    if (ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, _pos).magnitudeSquared <= _maxDistance) {
                        return enemy;
                    }
                }
            } else if (_mode === ProjectileTargetMode.CLOSEST || _mode === ProjectileTargetMode.FURTHEST) {
                for (let e of enemies) {
                    e.distanceToCharacter = ƒ.Vector3.DIFFERENCE(e.mtxWorld.translation, _pos).magnitudeSquared;
                }
                enemies.sort((a, b) => a.distanceToCharacter - b.distanceToCharacter);
                if (_mode === ProjectileTargetMode.FURTHEST) enemies.reverse();
                for (let i = 0; i < enemies.length; i++) {
                    if (!_exclude.includes(enemies[i]))
                        return (enemies[i]);
                }
            }
            return undefined;
        }

        private dmgDisplayElements: [HTMLElement, ƒ.Vector3][] = [];
        public displayDamage(_amt: number, _pos: ƒ.Vector3) {
            if (!isFinite(_amt)) return;
            let dmgText = _amt.toFixed(0);
            let textElement = document.createElement("span");
            textElement.classList.add(("dmg-number"));
            textElement.innerText = dmgText;

            document.documentElement.appendChild(textElement);
            this.dmgDisplayElements.push([textElement, _pos.clone]);

            setTimeout(() => {
                document.documentElement.removeChild(textElement);
                this.dmgDisplayElements.shift();
            }, 1000);
        }

        public reset() {
            this.endRoom(true);
            this.currentXP = 0;
            this.addXP(0);
            this.currentWave = -1;
            this.currentRoom = -1;
            this.currentRoomEnd = 0;
            this.currentWaveEnd = 0;
        }

        public addXP(_xp: number) {
            this.currentXP += _xp;
            this.xpElement.innerText = this.currentXP.toString();
        }
    }
}