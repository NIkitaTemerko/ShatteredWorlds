<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SelectInput from './ui.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/SelectInput',
  });

  const options = [
    { value: 'amethyst', label: 'Amethyst' },
    { value: 'quartz', label: 'Quartz' },
    { value: 'obsidian', label: 'Obsidian' },
  ];
</script>

<Story name="Outline">
  <SelectInput value="amethyst" {options} variant="outline" />
</Story>

<Story name="Ghost">
  <SelectInput value="quartz" {options} variant="ghost" />
</Story>

<Story name="Disabled">
  <SelectInput value="obsidian" {options} disabled />
</Story>
