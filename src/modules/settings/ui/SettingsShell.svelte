<script lang="ts">
  import { t, type I18nKey } from "../../../shared/i18n";
  import ResourceSettings from "./ResourceSettings.svelte";

  /** Описание секции настроек */
  interface SettingsSection {
    id: string;
    icon: string;
    titleKey: I18nKey;
  }

  const sections: SettingsSection[] = [{ id: "resources", icon: "fas fa-cubes", titleKey: "settings.resources.title" }];

  let expandedSection = $state<string>("resources");

  function toggle(id: string) {
    expandedSection = expandedSection === id ? "" : id;
  }
</script>

<div class="shw-settings">
  {#each sections as section}
    <div class="section" class:expanded={expandedSection === section.id}>
      <button type="button" class="section-header" onclick={() => toggle(section.id)}>
        <i
          class="chevron fas"
          class:fa-chevron-right={expandedSection !== section.id}
          class:fa-chevron-down={expandedSection === section.id}
        ></i>
        <i class="{section.icon} section-icon"></i>
        <span class="section-title">{t(section.titleKey)}</span>
      </button>

      {#if expandedSection === section.id}
        <div class="section-body">
          {#if section.id === "resources"}
            <ResourceSettings />
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .shw-settings {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;
    height: 100%;
    overflow-y: auto;
    gap: 2px;
  }

  .section {
    border: 1px solid var(--color-border-light-tertiary, rgba(255, 255, 255, 0.08));
    border-radius: 4px;
    overflow: hidden;
  }

  .section.expanded {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .section-header {
    all: unset;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.6rem;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    box-sizing: border-box;
  }

  .section-header:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .chevron {
    width: 12px;
    text-align: center;
    font-size: 0.7rem;
    opacity: 0.5;
    flex-shrink: 0;
  }

  .section-icon {
    font-size: 0.85rem;
    opacity: 0.7;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
  }

  .section-title {
    flex: 1;
    min-width: 0;
  }

  .section-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 0 0.6rem 0.5rem;
  }
</style>
