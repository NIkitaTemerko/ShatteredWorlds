<script lang="ts">
  import { t } from '../../i18n';
  import './crystal-section.css';

  interface Props {
    value?: string;
    placeholder?: string;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    placeholder = t('item.description.placeholder'),
    onchange,
  }: Props = $props();
</script>

<section
  class="shw-sheet-section description"
  style="--dark: var(--shw-color-border-bright); --light: var(--shw-glass-fill-tint)"
>
  <div class="section-header">{t('item.description.title')}</div>
  <textarea
    bind:value
    {placeholder}
    onchange={(e) => onchange?.(e.currentTarget.value)}
  ></textarea>
</section>
