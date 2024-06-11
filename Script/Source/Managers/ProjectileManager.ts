namespace Script {
    export class ProjectileManager {
        private characterManager: CharacterManager;
        private config: Config;
        private projectileScripts: Animateable[] = [];
        private projectiles: InitializableGraphInstance[] = [];
        static projectileGraph: ƒ.Graph;
        static aoeGraph: ƒ.Graph;
        static hitZoneGraph: ƒ.Graph;
        private projectilesNode: ƒ.Node;
        private hitzoneNode: ƒ.Node;

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            document.addEventListener("interactiveViewportStarted", <EventListener>this.start);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded);
            this.characterManager = provider.get(CharacterManager);
            this.config = provider.get(Config);
        }

        public setup() {
            ƒ.Debug.log("EnemyManager setup");
        }

        private start = (_event: CustomEvent) => {
            let viewport: ƒ.Viewport = _event.detail;
            this.projectilesNode = viewport.getBranch().getChildrenByName("projectiles")[0];
            this.hitzoneNode = viewport.getBranch().getChildrenByName("hitzones")[0];
        }
        private loaded = async () => {
            ProjectileManager.projectileGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("projectile")[0];
            ProjectileManager.hitZoneGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("hitzone")[0];
            ProjectileManager.aoeGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("aoe")[0];
        }
        private update = () => {
            if (gameState === GAMESTATE.PAUSED) return;
            if (gameState === GAMESTATE.IDLE) return;
            let character = this.characterManager.character;
            if (!character) return;

            // update projectiles
            let time = ƒ.Loop.timeFrameGame / 1000;
            for (let projectile of this.projectileScripts) {
                projectile.update(character.node.mtxWorld.translation, time);
            }
        }


        public removeProjectile(_projectile: ProjectileComponent) {
            let index = this.projectileScripts.findIndex((n) => n === _projectile);
            if (index >= 0) {
                this.projectileScripts.splice(index, 1);
                ƒ.Recycler.storeMultiple(...this.projectiles.splice(index, 1));
            }
            _projectile.node.getParent().removeChild(_projectile.node);
        }
        public removeAOE(_aoe: AOE) {
            let index = this.projectileScripts.findIndex((n) => n === _aoe);
            if (index >= 0) {
                this.projectileScripts.splice(index, 1);
                ƒ.Recycler.storeMultiple(...this.projectiles.splice(index, 1));
            }
            _aoe.node.getParent().removeChild(_aoe.node);
        }

        public async createProjectile(_options: Partial<Projectile>, _position: ƒ.Vector3, _modifiers: PassiveCardEffectObject, _parent: ƒ.Node = this.projectilesNode) {
            let pgi = ƒ.Recycler.get(ProjectileGraphInstance);
            if (!pgi.initialized) {
                await pgi.set(ProjectileManager.projectileGraph);
            }
            pgi.mtxLocal.translation = ƒ.Vector3.SUM(_position);
            
            let p = pgi.getComponent(ProjectileComponent);
            _parent.addChild(pgi);

            this.projectileScripts.push(p);
            this.projectiles.push(pgi);
            
            p.setup(_options, _modifiers);
        }
        public async createAOE(_options: Partial<AreaOfEffect>, _position: ƒ.Vector3, _modifiers: PassiveCardEffectObject, _parent: ƒ.Node = this.projectilesNode) {
            let aoeGi = ƒ.Recycler.get(AOEGraphInstance);
            if (!aoeGi.initialized) {
                await aoeGi.set(ProjectileManager.aoeGraph);
            }
            let a = aoeGi.getComponent(AOE);
            a.setup(_options, _modifiers);

            aoeGi.mtxLocal.translation = ƒ.Vector3.SUM(_position);
            _parent.addChild(aoeGi);

            this.projectileScripts.push(a);
            this.projectiles.push(aoeGi);
        }

        public async createHitZone(_position: ƒ.Vector3, _size: number = 1, _parent: ƒ.Node = this.hitzoneNode): Promise<HitZoneGraphInstance> {
            let hz = ƒ.Recycler.get(HitZoneGraphInstance);
            if(!hz.initialized) {
                await hz.set(ProjectileManager.hitZoneGraph);
            }
            hz.getComponent(ƒ.ComponentMesh).mtxPivot.scaling = ƒ.Vector3.ONE(_size);
            hz.mtxLocal.translation = _position;
            _parent.addChild(hz);
            return hz;
        }
    }
}