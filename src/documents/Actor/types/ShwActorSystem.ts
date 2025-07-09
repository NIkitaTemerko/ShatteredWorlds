export interface ShwActorSystem {
   health: { value: number; max: number };
   attributes: {
      fortune: { value: number; extra: number; charBonus: number; saveBonus: number };
      force: { value: number; extra: number; charBonus: number; saveBonus: number };
      perception: { value: number; extra: number; charBonus: number; saveBonus: number };
      psyDefence: { value: number; extra: number; charBonus: number; saveBonus: number };
      diplomacy: { value: number; extra: number; charBonus: number; saveBonus: number };
   };
   additionalAttributes: {
      actions: number;
      bonusActions: number;
      reactions: number;
      impulse: number;
      initiative: number;

      damage: number;
      range: number;
      discount: number;
      damageReduction: number;
      armorClass: number;
      aoeResist: number;
   };
   utility: {
      speed: number;
      level: number;
   };
   helpers: {
      totalHealth: number;
      totalImpulse: number;
      totalSpeed: number;
   };
}
