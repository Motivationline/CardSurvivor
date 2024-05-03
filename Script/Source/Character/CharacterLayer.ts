namespace Script {
    import ƒ = FudgeCore;
    export class CharacterLayer extends ƒ.Component {
        #layerId: number = 0;
        #material: ƒ.CoatTextured;
        #textures: { [key in AnimationState]: ƒ.TextureImage };

        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, () => {
                this.#layerId = Number(this.node.name.slice(9));
                this.#material = <ƒ.CoatTextured>this.node.getComponent(ƒ.ComponentMaterial).material.coat;
            });
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, async () => {
                let allTextures = await ƒ.Project.getResourcesByType(ƒ.TextureImage);
                this.#textures = {
                    idle: <ƒ.TextureImage>allTextures.find(t => t.name.includes("Robot_base_idle_Layer" + this.#layerId)),
                    walking: <ƒ.TextureImage>allTextures.find(t => t.name.includes("Robot_base_walk_Layer" + this.#layerId)),
                };
            });
        }

        public setTexture(_state: AnimationState) {
            if (!this.#textures[_state]) return;
            this.#material.texture = this.#textures[_state];
        }
    }
}