<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HoverTooltip from './HoverTooltip.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/HoverTooltip',
  });
</script>

<Story name="Default">
  <HoverTooltip label="Crystal facet tip">
    {#snippet children()}
      <span style="color: #e8e4f0; border-bottom: 1px dashed #6e6488; cursor: help;">
        Hover me
      </span>
    {/snippet}
  </HoverTooltip>
</Story>
