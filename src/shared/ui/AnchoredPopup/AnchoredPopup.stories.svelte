<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AnchoredPopupDemo from './AnchoredPopup.demo.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/AnchoredPopup',
    component: AnchoredPopupDemo,
  });
</script>

<Story name="Click" args={{ triggerMode: 'click' }} />
<Story name="Hover" args={{ triggerMode: 'hover' }} />
