<script lang="ts">
  import type { ShwActor } from '../../documents/Actor/ShwActor';
  import { FoundryWindow } from '../../storybook/foundry';
  import {
    createAbilityItemFixture,
    createCharacterActorFixture,
    createConsumableItemFixture,
    createEquipmentItemFixture,
    createMutableDoc,
    createSpellItemFixture,
  } from '../../storybook/fixtures';
  import RootCharacterShell from './ui/RootCharacterShell.svelte';

  const sampleItems = [
    createAbilityItemFixture({ name: 'Удар искры' }),
    createSpellItemFixture({ name: 'Spark', category: 'elemental' }),
    createSpellItemFixture({ id: 'story-spell-2', name: 'Ward', category: 'holy' }),
    createEquipmentItemFixture({ name: 'Кольчуга путника' }),
    createConsumableItemFixture({ name: 'Огненная бомба' }),
  ];

  let actor = $state(
    createMutableDoc(createCharacterActorFixture({ items: sampleItems }), (next) => {
      actor = next as unknown as ShwActor<'character'>;
    }) as unknown as ShwActor<'character'>,
  );
</script>

<div class="stage">
  <FoundryWindow title={actor.name} width={800} height={770} kind="actor">
    <RootCharacterShell {actor} />
  </FoundryWindow>
</div>

<style>
  .stage {
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
</style>
