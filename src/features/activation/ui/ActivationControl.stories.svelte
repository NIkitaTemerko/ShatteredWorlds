<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActivationControlDemo from './ActivationControl.demo.svelte';

  const { Story } = defineMeta({
    title: 'Widgets/ActivationControl',
    component: ActivationControlDemo,
  });
</script>

<Story name="Default" />
