<script lang="ts">
  import { untrack } from 'svelte';
  import type { ShwItem } from '../../documents/Item/ShwItem';
  import type { ConsumableType } from '../../documents/Item/types/ConsumableDataTypes';
  import { ItemFactory } from '../../documents/Item/ItemFactory';
  import { createMutableDoc, createEquipmentItemFixture, createConsumableItemFixture, createAbilityItemFixture, createSpellItemFixture } from '../../storybook/fixtures';
  import { FoundryWindow } from '../../storybook/foundry';
  import ItemShell from './ui/ItemShell.svelte';
  let { kind = 'equipment', consumableType = 'potion', empty = false, missingLink = false, readonly = false, windowHeight = 790, windowWidth = 860, failSave = false }:
    { kind?: 'equipment' | 'consumable' | 'resource'; consumableType?: ConsumableType; empty?: boolean; missingLink?: boolean; readonly?: boolean; windowHeight?: number; windowWidth?: number; failSave?: boolean } = $props();
  let item = $state<ShwItem>();
  let edits = $state(0);
  let failures = $state(0);
  const linkedItems = new Map<string, ShwItem>([
    ['story-ability-1', { ...createAbilityItemFixture({ category: 'passive' }), sheet: { render() {} } } as unknown as ShwItem],
    ['story-spell-1', { ...createSpellItemFixture({ name: 'Свет' }), sheet: { render() {} } } as unknown as ShwItem],
  ]);
  $effect(() => {
    const config = { kind, consumableType, empty, missingLink, readonly, failSave };
    untrack(() => {
      const base = config.kind === 'equipment' ? createEquipmentItemFixture() : createConsumableItemFixture();
      let system: ShwItem['system'] = base.system;
      let name = base.name;
      if (config.kind === 'equipment' && 'armorClass' in system) {
        system.armorClass = 12; system.price = 150; system.weight = 8; system.rarity = 'uncommon';
        system.description = 'Гибкая кольчуга из потемневшей стали. Лёгкие кольца не сковывают движения в долгой дороге.';
        system.statBonuses = { modifiers: config.empty ? [] : [{ stat: 'attributes.force.extra', mode: 'add', value: 12 }, { stat: 'attributes.force.value', mode: 'add', value: 1 }] };
        system.linkedItemIds = config.empty ? [] : ['story-ability-1', config.missingLink ? 'deleted-spell' : 'story-spell-1'];
      } else if (config.kind === 'consumable') {
        name = { potion: 'Зелье восстановления', bomb: 'Огненная бомба', scroll: 'Свиток огненного шара', poison: 'Яд теневого паука', food: 'Дорожный паёк' }[config.consumableType];
        const s = ItemFactory.createConsumable(config.consumableType, { name, description: 'Описание предмета. Измените текст, чтобы проверить сохранение.', weight: .2 });
        s.price = 25; s.stackLimit = 10; s.quantity = 3;
        if (s.consumableType === 'potion') s.effects = config.empty ? [] : [{ type: 'heal', amount: 20, duration: 0, attribute: '' }];
        if (s.consumableType === 'food') { s.nutrition = { value: 5, duration: 8 }; s.effects = [{ type: 'buff', value: 5, duration: 1 }]; }
        if (s.consumableType === 'bomb') { s.damage.amount = 30; s.radius = 3; }
        if (s.consumableType === 'scroll') { s.spell = { name: 'Огненный шар', level: 3, school: 'Стихийная' }; s.requirements = { ability: 'Воля', dc: 15 }; }
        if (s.consumableType === 'poison') s.damage = { initial: '2d6', recurring: '1d6', duration: 3 };
        system = s;
      } else {
        name = 'Астральный кристалл';
        system = { ...ItemFactory.createResource('magical', 'Астральный кристалл', { name, description: 'Прозрачный кристалл с бледным свечением внутри.', rarity: 'rare', weight: .1 }), price: 80, quantity: 12, stackLimit: 99 };
      }
      edits = 0; failures = 0;
      const doc = createMutableDoc({ ...base, name, img: '', system, type: config.kind, isOwner: !config.readonly,
        isEquipment: () => config.kind === 'equipment', isConsumable: () => config.kind === 'consumable', isResource: () => config.kind === 'resource',
      }, next => { item = next as unknown as ShwItem; edits++; });
      const update = doc.update;
      doc.update = async (data, options) => {
        if (config.failSave && failures === 0) { failures++; throw new Error('Storybook: save failed'); }
        return update(data, options);
      };
      item = doc as unknown as ShwItem;
    });
  });
</script>

<div class="item-demo-stage">
  {#if item}<FoundryWindow title={item.name} width={windowWidth} height={windowHeight} kind="item">
      <ItemShell {item} {linkedItems} />
    </FoundryWindow>
    <output data-testid="item-demo-state" hidden>{JSON.stringify({ edits, system: item.system, name: item.name })}</output>
  {/if}
</div>

<style>
  .item-demo-stage { min-height: 100vh; padding: 24px; display: flex; justify-content: center; align-items: flex-start; background: #0d0b12; }
</style>
