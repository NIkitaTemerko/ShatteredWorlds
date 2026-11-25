<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button } from './index';

  const { Story } = defineMeta({
    title: 'Crystal/Button',
    component: Button,
    args: {
      variant: 'primary',
      size: 'md',
      disabled: false,
    },
    argTypes: {
      variant: {
        control: 'radio',
        options: ['primary', 'secondary', 'outline', 'ghost'],
      },
      size: {
        control: 'radio',
        options: ['sm', 'md', 'lg'],
      },
      disabled: { control: 'boolean' },
      icon: { table: { disable: true } },
      children: { table: { disable: true } },
      class: { table: { disable: true } },
      ref: { table: { disable: true } },
    },
  });
</script>

<Story name="Primary" args={{ variant: 'primary' }}>Primary</Story>
<Story name="Secondary" args={{ variant: 'secondary' }}>Secondary</Story>
<Story name="Outline" args={{ variant: 'outline' }}>Outline</Story>
<Story name="Ghost" args={{ variant: 'ghost' }}>Ghost</Story>
<Story name="Small" args={{ size: 'sm' }}>Small</Story>
<Story name="Medium" args={{ size: 'md' }}>Medium</Story>
<Story name="Large" args={{ size: 'lg' }}>Large</Story>
<Story name="Disabled" args={{ disabled: true }}>Disabled</Story>
