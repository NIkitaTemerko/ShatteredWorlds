<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActionIcon from './ui.svelte';

  // No `component` — ActionIcon requires an `icon` snippet; auto-wrap would break.
  const { Story } = defineMeta({
    title: 'Crystal/ActionIcon',
  });
</script>

<Story name="Ghost">
  <ActionIcon variant="ghost" aria-label="Edit">
    {#snippet icon()}
      <span aria-hidden="true">✎</span>
    {/snippet}
  </ActionIcon>
</Story>

<Story name="Outline">
  <ActionIcon variant="outline" aria-label="Settings">
    {#snippet icon()}
      <span aria-hidden="true">⚙</span>
    {/snippet}
  </ActionIcon>
</Story>

<Story name="Sizes">
  <div style="display: flex; gap: 0.75rem; align-items: center; color: #e8e4f0;">
    <ActionIcon size="sm" aria-label="Small">
      {#snippet icon()}
        <span aria-hidden="true">◆</span>
      {/snippet}
    </ActionIcon>
    <ActionIcon size="md" aria-label="Medium">
      {#snippet icon()}
        <span aria-hidden="true">◆</span>
      {/snippet}
    </ActionIcon>
    <ActionIcon size="lg" aria-label="Large">
      {#snippet icon()}
        <span aria-hidden="true">◆</span>
      {/snippet}
    </ActionIcon>
  </div>
</Story>

<Story name="Disabled">
  <ActionIcon disabled aria-label="Disabled">
    {#snippet icon()}
      <span aria-hidden="true">✕</span>
    {/snippet}
  </ActionIcon>
</Story>
