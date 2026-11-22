<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AttributeRollDetailContentDemo from './AttributeRollDetailContent.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/AttributeRollDetailContent',
    component: AttributeRollDetailContentDemo,
  });
</script>

<Story name="Default" />
