<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { getSheetEvents } from './sheetEvents';
  import { t } from '../../../shared/i18n';
  let {
    title,
    onClose,
    children,
    wide = false,
  }: { title: string; onClose: () => void | boolean; children: Snippet; wide?: boolean } = $props();
  let panel: HTMLDivElement;
  const sheetEvents = getSheetEvents();
  onMount(() => {
    const previous = document.activeElement;
    const eventName = 'shw-character-panel-open';
    const closeOther = (event: Event) => {
      if ((event as CustomEvent).detail !== panel && onClose() === false) event.preventDefault();
    };
    if (!sheetEvents.dispatchEvent(new CustomEvent(eventName, { detail: panel, cancelable: true }))) {
      onClose();
      return;
    }
    sheetEvents.addEventListener(eventName, closeOther);
    panel.focus();
    return () => {
      sheetEvents.removeEventListener(eventName, closeOther);
      if (
        panel.contains(document.activeElement) &&
        previous instanceof HTMLElement &&
        previous.isConnected
      )
        previous.focus();
    };
  });
</script>

<div
  class="sheet-panel"
  class:panel-wide={wide}
  role="dialog"
  aria-label={title}
  tabindex="-1"
  bind:this={panel}
  onkeydown={(event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  }}
>
  <header class="panel-heading">
    <h2>{title}</h2>
    <button class="icon-button" type="button" aria-label={t('common.close')} onclick={onClose}
      >×</button
    >
  </header>
  {@render children()}
</div>
