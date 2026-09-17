<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatsCard from './ui.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/StatsCard',
  });
</script>

<Story name="ThreeColumns">
  <div style="width: 28rem; color: var(--shw-color-text, #e8e4f0)">
    <StatsCard columns={3}>
      <div class="stat-col" style="--dark: #8b4fc9">
        <div class="stat-header">Power</div>
        <div class="stat-body">12</div>
      </div>
      <div class="stat-col" style="--dark: #2a9b8f">
        <div class="stat-header">Focus</div>
        <div class="stat-body">8</div>
      </div>
      <div class="stat-col" style="--dark: #c4922a">
        <div class="stat-header">Speed</div>
        <div class="stat-body">14</div>
      </div>
    </StatsCard>
  </div>
</Story>

<Story name="FullWidth">
  <div style="width: 22rem; color: var(--shw-color-text, #e8e4f0)">
    <StatsCard columns={1}>
      <div class="stat-col full" style="--dark: #5a2d8a">
        <div class="stat-header">Notes</div>
        <div class="stat-body">Single full-width column</div>
      </div>
    </StatsCard>
  </div>
</Story>
