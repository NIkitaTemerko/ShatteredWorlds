<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AutocompleteInput from './ui.svelte';

  const { Story } = defineMeta({
    title: 'Crystal/AutocompleteInput',
  });

  const options = [
    { value: 'amethyst', label: 'Amethyst' },
    { value: 'quartz', label: 'Quartz' },
    { value: 'obsidian', label: 'Obsidian' },
    { value: 'sapphire', label: 'Sapphire' },
  ];
</script>

<Story name="Ghost">
  <AutocompleteInput value="amethyst" {options} variant="ghost" />
</Story>

<Story name="Outline">
  <AutocompleteInput value="quartz" {options} variant="outline" />
</Story>

<Story name="Disabled">
  <AutocompleteInput value="obsidian" {options} disabled />
</Story>

<Story name="Full width">
  <div style="width: 20rem">
    <AutocompleteInput value="" {options} fullWidth placeholder="Search crystal…" />
  </div>
</Story>
