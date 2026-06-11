<script lang="ts">
  import { t } from '../../../shared/i18n';
  import { parseIconInput, resolveIconClass } from '../lib/iconUtils';

  interface Props {
    icon: string;
    type: string;
    label: string;
    color?: string;
    onUpdateType: (value: string) => void;
    onUpdateLabel: (value: string) => void;
    onUpdateIcon: (value: string) => void;
    onRemove: () => void;
  }

  let { icon, type, label, color, onUpdateType, onUpdateLabel, onUpdateIcon, onRemove }: Props =
    $props();

  function handleIconInput(e: Event & { currentTarget: HTMLInputElement }) {
    const parsed = parseIconInput(e.currentTarget.value);
    onUpdateIcon(parsed);
    if (parsed !== e.currentTarget.value) {
      e.currentTarget.value = parsed;
    }
  }
</script>

<div class="type-row">
  <i class="{resolveIconClass(icon)} type-icon" style:color></i>
  <input
    type="text"
    value={type}
    placeholder={t('settings.resources.placeholderKey')}
    class="input-id"
    oninput={(e) => onUpdateType(e.currentTarget.value)}
  />
  <input
    type="text"
    value={label}
    placeholder={t('settings.resources.placeholderName')}
    class="input-name"
    oninput={(e) => onUpdateLabel(e.currentTarget.value)}
  />
  <input
    type="text"
    value={icon}
    placeholder={t('settings.resources.placeholderIcon')}
    class="input-icon"
    oninput={handleIconInput}
  />
  <button
    type="button"
    class="btn-remove"
    onclick={onRemove}
    title={t('settings.resources.deleteType')}
  >
    <i class="fas fa-trash"></i>
  </button>
</div>

<style>
  .type-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .type-icon {
    width: 16px;
    text-align: center;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .input-id {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    width: 100px;
    flex-shrink: 0;
  }

  .input-name {
    flex: 1;
    min-width: 0;
  }

  .input-icon {
    width: 130px;
    flex-shrink: 0;
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
  }

  .btn-remove {
    all: unset;
    cursor: pointer;
    opacity: 0.25;
    padding: 0.15rem 0.3rem;
    flex-shrink: 0;
    font-size: 0.75rem;
  }

  .btn-remove:hover {
    opacity: 1;
    color: var(--color-level-error, #ef4444);
  }
</style>
