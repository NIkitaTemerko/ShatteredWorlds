<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AttributeBaseDetailContentDemo from './AttributeBaseDetailContent.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/AttributeBaseDetailContent',
    component: AttributeBaseDetailContentDemo,
  });
</script>

<Story name="Default" />
