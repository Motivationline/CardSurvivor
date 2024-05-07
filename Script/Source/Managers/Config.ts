namespace Script {
    export class Config {
        private animations: AnimationList;

        public constructor(){

        }

        public async loadFiles(){
            const animationFilePath = "./Assets/Enemies/animations.json";

            this.animations = await (await fetch(animationFilePath)).json()
        }

        public getAnimation(_enemyID: string, _animationID: string): AnimationSprite {
            if(!this.animations[_enemyID]) return undefined;
            if(!this.animations[_enemyID].animations[_animationID]) return undefined;
            let anim = this.animations[_enemyID].animations[_animationID];
            if(!anim.material){
                let materials = ƒ.Project.getResourcesByType(ƒ.Material)
                anim.material = <ƒ.Material>materials.find(mat => mat.idResource === anim.materialString);
            }
            return anim;
        }


    }

    interface AnimationList {
        [id: string]: {
            animations: {
                [id: string]: AnimationSpriteRaw
            }
        }
    }

    interface AnimationSpriteRaw extends AnimationSprite {
        materialString: string;
    }
}