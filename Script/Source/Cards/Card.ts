/// <reference path="../Attacks/Projectiles.ts" />

namespace Script {
    export class Card implements iCard {
        name: string;
        description: string;
        image: string;
        rarity: CardRarity;
        levels: CardLevel[];
        id: string;
        isWeapon?: boolean;
        #level: number;
        #cm: CardManager;
        #pm: ProjectileManager;
        #charm: CharacterManager;

        constructor(_init: iCard, _id: string, _level: number = 0) {
            this.name = _init.name ?? `card.${_id}.name`;
            this.description = _init.description ?? `card.${_id}.description`;
            this.image = _init.image;
            this.rarity = _init.rarity;
            this.levels = _init.levels;
            this.level = _level;
            this.id = _id;
            this.isWeapon = _init.isWeapon;

            this.#cm = provider.get(CardManager);
            this.#pm = provider.get(ProjectileManager);
            this.#charm = provider.get(CharacterManager);
        }

        get level(): number {
            return this.#level;
        }

        set level(_level: number) {
            this.#level = Math.max(0, Math.min(this.levels.length, _level));
        }

        get effects(): PassiveCardEffectObject {
            return structuredClone(this.levels[this.level].passiveEffects);
        }

        public update(_time: number, _cumulatedEffects: PassiveCardEffectObject) {
            let limitation = "";
            if (!this.levels[this.level].activeEffects || !this.levels[this.level].activeEffects.length) return;
            for (let effect of this.levels[this.level].activeEffects) {
                if (isNaN(effect.currentCooldown)) effect.currentCooldown = effect.cooldown;
                if (effect.cooldownBasedOnDistance) {
                    effect.currentCooldown -= this.#charm.getMovement().magnitude * this.#cm.modifyValuePlayer(this.#charm.character.speed, PassiveCardEffect.MOVEMENT_SPEED) * _time;
                } else {
                    effect.currentCooldown -= _time;
                }
                if (effect.currentCooldown <= 0) {
                    if (provider.get(CharacterManager).isMoving())
                        limitation = "stopped";
                    effect.currentCooldown = this.#cm.modifyValuePlayer(effect.cooldown, PassiveCardEffect.COOLDOWN_REDUCTION, effect.modifiers, limitation);
                    switch (effect.type) {
                        case "projectile":
                            let amount = this.#cm.modifyValuePlayer(effect.amount ?? 1, PassiveCardEffect.PROJECTILE_AMOUNT, effect.modifiers, limitation);
                            for (let i: number = 0; i < amount; i++) {
                                setTimeout(() => {
                                    let pos = this.#charm.character.node.mtxWorld.translation.clone;
                                    if (effect.offset) {
                                        if (typeof effect.offset === "string") {
                                            pos.add(eval(effect.offset));
                                        } else {
                                            pos.add(effect.offset);
                                        }
                                    }
                                    let projectile = projectiles[effect.projectile];
                                    this.#pm.createProjectile(projectile, pos, this.#cm.combineEffects(_cumulatedEffects, effect.modifiers), projectile.lockedToEntity ? this.#charm.character.node : undefined)
                                }, i * (effect.delay ?? 0.1) * 1000);
                            }
                            break;
                        case "aoe":
                            let pos = this.#charm.character.node.mtxWorld.translation.clone;
                            let aoe = areasOfEffect[effect.aoe];
                            this.#pm.createAOE(aoe, pos, this.#cm.combineEffects(_cumulatedEffects, effect.modifiers));
                            break;
                    }
                }
            }
        }
    }
}
