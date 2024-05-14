namespace Script {
    export class ProjectileManager {
        private characterManager: CharacterManager;
        private config: Config;
        private projectileScripts: ProjectileComponent[] = [];
        private projectiles: ProjectileGraphInstance[] = [];
        static projectileGraph: ƒ.Graph;
        static hitZoneGraph: ƒ.Graph;
        private projectilesNode: ƒ.Node;

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
        }
        private loaded = async () => {
            ProjectileManager.projectileGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("projectile")[0];
            ProjectileManager.hitZoneGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("hitzone")[0];
        }
        private update = () => {
            if (gameState !== GAMESTATE.PLAYING) return;
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

        public async createProjectile(_options: Partial<Projectile>, _position: ƒ.Vector3, _parent: ƒ.Node = this.projectilesNode) {
            let pgi = ƒ.Recycler.get(ProjectileGraphInstance);
            if (!pgi.initialized) {
                await pgi.set(ProjectileManager.projectileGraph);
            }
            let p = pgi.getComponent(ProjectileComponent);
            p.setup(_options, provider.get(CardManager));

            pgi.mtxLocal.translation = ƒ.Vector3.SUM(_position);
            _parent.addChild(pgi);

            this.projectileScripts.push(p);
            this.projectiles.push(pgi);
        }

        public async createHitZone(_position: ƒ.Vector3, _size: number = 1, _parent: ƒ.Node = this.projectilesNode): Promise<ƒ.GraphInstance> {
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