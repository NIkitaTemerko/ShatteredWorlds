<script lang="ts">
  import type { ShwItem } from '../../documents/Item/ShwItem';
  import { FoundryWindow } from '../../storybook/foundry';
  import { createAbilityItemFixture, createMutableDoc } from '../../storybook/fixtures';
  import RootItemShell from './ui/RootItemShell.svelte';

  let item = $state(
    createMutableDoc(createAbilityItemFixture(), (next) => {
      item = next as unknown as ShwItem;
    }) as unknown as ShwItem,
  );
</script>

<div class="stage">
  <FoundryWindow title={item.name} width={600} height={700} kind="item">
    <RootItemShell {item} />
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
