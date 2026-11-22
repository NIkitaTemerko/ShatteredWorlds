<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HealthDetailContentDemo from './HealthDetailContent.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/HealthDetailContent',
    component: HealthDetailContentDemo,
  });
</script>

<Story name="Default" />
