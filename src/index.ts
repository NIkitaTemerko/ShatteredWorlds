import { ShwActor } from './documents/Actor/ShwActor';
import { ShwItem } from './documents/Item/ShwItem';
import { ShwTokenDocument } from './documents/ShwTokenDocument.js';
import { migrateConsumableData, needsMigration } from './helpers/Item/migrateConsumableData';
import { handleAddItem } from './helpers/Item/StackManager';
import { AbilityItemApp } from './view/AbilityItem/ItemApp';
import { CharacterApp } from './view/BaseCharacter/CharacterApp.js';
import { ConsumableItemApp } from './view/ConsumableItem/ItemApp';
import { NpcApp } from './view/NpcCharacter/NpcApp';
import './main.css';

(globalThis as any).MIN_WINDOW_HEIGHT = 200;
(globalThis as any).MIN_WINDOW_WIDTH = 200;

Hooks.once('init', () => {
  //@ts-expect-error
  CONFIG.Actor.documentClass = ShwActor;
  //@ts-expect-error
  CONFIG.Item.documentClass = ShwItem;
  CONFIG.Token.documentClass = ShwTokenDocument;
  CONFIG.Combat.initiative = {
    formula: '1d20 + @initiative',
    decimals: 0,
  };
});

Hooks.once('setup', () => {
  foundry.documents.collections.Actors.registerSheet('shw', CharacterApp, {
    types: ['character'],
    makeDefault: true,
  });
  foundry.documents.collections.Actors.registerSheet('shw', NpcApp, {
    types: ['npc'],
    makeDefault: true,
  });
  foundry.documents.collections.Items.registerSheet('shw', ConsumableItemApp, {
    types: ['consumable'],
    makeDefault: true,
  });
  foundry.documents.collections.Items.registerSheet('shw', AbilityItemApp, {
    types: ['ability'],
    makeDefault: true,
  });
});

Hooks.on('preCreateToken', (tokenDocument: any, tokenData: any) => {
  const actor = (game as any).actors.get(tokenData.actorId);
  if (actor?.type === 'character') {
    tokenDocument.updateSource({ actorLink: true });
  }
});

// Auto-migrate legacy consumable data on item creation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Hooks.on('preCreateItem', (item: any, data: any) => {
  // Migration pass
  if (needsMigration(data)) {
    const migrated = migrateConsumableData(data);
    item.updateSource({ system: migrated.system });
  }

  // Stack management: only for items being added to actors
  if (item.parent && item.parent instanceof ShwActor) {
    const result = handleAddItem(item.parent, {
      type: item.type,
      name: item.name,
      system: item.system,
    });

    // Prevent creation if item was stacked or blocked
    if (result === 'stacked' || result === 'blocked') {
      return false;
    }
  }
});

// Batch migrate existing items on world initialization (one-time on world load)
Hooks.once('setup', async () => {
  const items = (game as any).items;
  if (!items || items.size === 0) return;

  let migratedCount = 0;
  const itemsToMigrate: any[] = [];

  // Collect items that need migration
  for (const item of items) {
    if (needsMigration(item)) {
      itemsToMigrate.push(item);
      migratedCount++;
    }
  }

  // Batch update all at once
  if (migratedCount > 0) {
    const updates = itemsToMigrate.map((item) => {
      const migrated = migrateConsumableData(item);
      return {
        _id: item.id,
        system: migrated.system,
      };
    });

    await Item.updateDocuments(updates);
    console.log(`[SHW Migration] Migrated ${migratedCount} consumable items to flat structure`);
  }
});
