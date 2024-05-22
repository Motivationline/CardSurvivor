namespace Script {
    export class Card implements iCard {
        name: string;
        description: string;
        image: string;
        rarity: CardRarity;
        levels: CardLevel[];
        #level: number;
        #cm: CardManager;
        #pm: ProjectileManager;
        #charm: CharacterManager;

        constructor(_init: iCard, _level: number = 0, _nameFallback: string = "unknown") {
            this.name = _init.name ?? `cards.${_nameFallback}.name`;
            this.description = _init.description ?? i18next.t(`cards.${_nameFallback}.text`);
            this.image = _init.image;
            this.rarity = _init.rarity;
            this.levels = _init.levels;
            this.level = _level;

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
            if (!this.levels[this.level].activeEffects || !this.levels[this.level].activeEffects.length) return;
            for (let effect of this.levels[this.level].activeEffects) {
                if (isNaN(effect.currentCooldown)) effect.currentCooldown = 0;
                effect.currentCooldown -= _time;
                if (effect.currentCooldown <= 0) {
                    effect.currentCooldown = this.#cm.modifyValuePlayer(effect.cooldown, PassiveCardEffect.COOLDOWN_REDUCTION, effect.modifiers);
                    switch (effect.type) {
                        case "projectile":
                            for (let i: number = 0; i < (effect.amount ?? 1); i++) {
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
                                    this.#pm.createProjectile(projectile, pos, effect.modifiers, projectile.lockedToEntity ? this.#charm.character.node : undefined)
                                }, i * (effect.delay ?? 0));
                            }
                            break;
                    }
                }
            }
        }
    }
}
