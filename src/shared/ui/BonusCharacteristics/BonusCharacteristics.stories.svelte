<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BonusCharacteristicsDemo from './BonusCharacteristics.demo.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/BonusCharacteristics',
    component: BonusCharacteristicsDemo,
  });
</script>

<Story name="Editor" />
