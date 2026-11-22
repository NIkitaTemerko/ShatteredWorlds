<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AttributeExtraDetailContentDemo from './AttributeExtraDetailContent.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/AttributeExtraDetailContent',
    component: AttributeExtraDetailContentDemo,
  });
</script>

<Story name="Default" />
