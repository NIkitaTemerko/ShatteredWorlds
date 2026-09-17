<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from './ui.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/Input',
    component: Input,
    argTypes: {
      variant: {
        control: 'radio',
        options: ['ghost', 'outline'],
      },
      disabled: { control: 'boolean' },
      fullWidth: { control: 'boolean' },
    },
  });
</script>

<Story name="Ghost" args={{ variant: 'ghost', value: 'Amethyst' }} />

<Story name="Outline" args={{ variant: 'outline', value: 'Quartz' }} />

<Story name="Number" args={{ variant: 'ghost', value: 42, type: 'number' }} />

<Story name="Disabled" args={{ variant: 'ghost', value: 'Locked', disabled: true }} />

<Story name="FullWidth" args={{ variant: 'ghost', fullWidth: true, value: 'Full width' }} />
