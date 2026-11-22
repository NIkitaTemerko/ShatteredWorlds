<script lang="ts">
  import { untrack } from 'svelte';
  import type { ShwActor } from '../../documents/Actor/ShwActor';
  import { createCharacterShowcase } from '../../storybook/fixtures/characterShowcase';
  import { FoundryWindow } from '../../storybook/foundry';
  import RootCharacterShell, { type SheetSection } from './ui/RootCharacterShell.svelte';
  let {
    initialTab = 'stats',
    initialEditing = false,
    resourceState = 'normal',
    foundryFrame = false,
    windowHeight = 1008,
  }: {
    initialTab?: SheetSection;
    initialEditing?: boolean;
    resourceState?: 'normal' | 'empty' | 'overcharge';
    foundryFrame?: boolean;
    windowHeight?: number;
  } = $props();
  let actor = $state<ShwActor<'character'>>();
  let notification = $state('');
  let showcase: ReturnType<typeof createCharacterShowcase>;
  $effect(() => {
    const state = resourceState;
    untrack(() => {
      showcase = createCharacterShowcase((next) => {
        actor = next;
        notification = showcase.getNotification();
      }, state);
      actor = showcase.actor;
      notification = '';
    });
  });
</script>

<div class="stage">
  {#if actor}
    {@const currentActor = actor}
    {#snippet sheet()}
      {#key `${initialTab}-${initialEditing}`}<RootCharacterShell
          actor={currentActor}
          {initialTab}
          {initialEditing}
        />{/key}
    {/snippet}
    <div class="character-preview">
      {#if foundryFrame}
        <FoundryWindow title={actor.name} width={800} height={windowHeight} kind="actor">
          {@render sheet()}
        </FoundryWindow>
      {:else}
        {@render sheet()}
      {/if}
    </div>
  {/if}
  {#if notification}<output class="story-notification" aria-live="polite">{notification}</output
    >{/if}
</div>

<style>
  .stage {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 24px;
    background: #100f16;
  }
  .character-preview {
    width: 800px;
    max-width: 100%;
    margin: 0 auto;
  }
  .story-notification {
    position: fixed;
    right: 24px;
    bottom: 24px;
    max-width: 420px;
    padding: 12px 20px;
    border: 1px solid #ba98f3;
    border-radius: 8px;
    background: #1d1a28;
    color: #f1eef7;
    font-family: var(--shw-font);
  }
</style>
