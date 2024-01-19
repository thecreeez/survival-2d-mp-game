class Effect {
  type = "none";
  
  static Type = {
    Healing: "heal",
    Poison: "poison",
    AuraOfHealingAllies: "aura_heal_allies",
    AuraOfPoisonEnemy: "aura_poison_enemy",
    Ammo: "ammo"
  }

  constructor({ ticksTime = 1 }) {
    this.ticksTime = ticksTime;
  }
}