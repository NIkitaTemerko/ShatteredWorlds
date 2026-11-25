<script lang="ts">
  import { resolveLabel } from '../../../shared/i18n';
  let {
    label, value, onChange, options, type = 'text', min, max, step = 'any', disabled = false,
    suggestions,
  }: {
    label: string;
    value?: string | number | null;
    onChange: (value: string | number) => unknown;
    options?: { value: string; label: string }[];
    type?: 'text' | 'number';
    min?: number;
    max?: number;
    step?: number | string;
    disabled?: boolean;
    suggestions?: { value: string; label: string }[];
  } = $props();
  const id = $props.id();
  function change(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    if (type === 'number' && (!input.checkValidity() || !Number.isFinite(input.valueAsNumber))) {
      input.reportValidity();
      input.value = String(value ?? '');
      return;
    }
    onChange(type === 'number' ? input.valueAsNumber : input.value);
  }
</script>

<label class="item-field">
  <span>{label}</span>
  {#if options}
    <select {disabled} value={value ?? ''} onchange={(e) => {
      const next = e.currentTarget.value;
      e.currentTarget.value = String(value ?? '');
      onChange(next);
    }}>
      {#if value != null && !options.some(option => option.value === String(value))}
        <option value={value}>{value}</option>
      {/if}
      {#each options as option}<option value={option.value}>{resolveLabel(option.label)}</option>{/each}
    </select>
  {:else}
    <input {type} {min} {max} {step} {disabled} value={value ?? ''} onchange={change}
      list={suggestions ? id : undefined} />
    {#if suggestions}<datalist {id}>
      {#each suggestions as option}<option value={option.value}>{resolveLabel(option.label)}</option>{/each}
    </datalist>{/if}
  {/if}
</label>
