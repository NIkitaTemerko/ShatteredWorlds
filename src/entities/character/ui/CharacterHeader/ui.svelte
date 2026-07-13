<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import { t } from "../../../../shared/i18n";
  import { ActionIcon } from "../../../../shared/ui/ActionIcon";
  import { AnchoredPopup, closeActivePopup } from "../../../../shared/ui/AnchoredPopup";
  import Input from "../../../../shared/ui/Input/ui.svelte";
  import { StatDetailContent } from "../StatDetailPopup";
  import HPBar from "./HPBar.svelte";

  interface Props {
    actor: ShwActor<"character"> | ShwActor<"npc">;
  }

  let { actor }: Props = $props();

  const isCharacter = $derived(actor.isCharacter());
  const variant = $derived(isCharacter ? "character" : "npc");
  const speedSources = $derived(actor.system.speedStatSources);
  const speedTotal = $derived(actor.system.totals.speed);

  let speedPopupOpen = $state(false);
  let speedAnchorEl = $state<HTMLElement | undefined>();

  function toggleSpeedPopup(e: Event) {
    e.stopPropagation();
    if (!speedPopupOpen) {
      closeActivePopup();
    }
    speedPopupOpen = !speedPopupOpen;
  }

  function closeSpeedPopup() {
    speedPopupOpen = false;
  }

  function handleSpeedExtraChange(value: number) {
    if (isCharacter) {
      actor.update({ "system.utility.speedExtra": value });
      return;
    }

    const sources = actor.system.speedStatSources;
    if (!sources) return;
    actor.update({
      "system.utility.speedExtra": value,
      "system.utility.speed": sources.base + sources.growth + value,
    });
  }
</script>

<header class="sheet-header">
  <img class="profile-img" src={actor.img} alt="avatar" data-edit="img" title={actor.name} height="100" width="100" />

  <div class="header-fields">
    <div class="introduction-info">
      <h1 class="charname">
        <label>
          <span class="name-label">{t("character.nameLabel")}</span>
          <Input
            variant="underline"
            name="name"
            type="text"
            value={actor.name}
            placeholder="Name"
            fullWidth
            style="font-size:var(--font-size-20);padding:0.25rem 0.5rem;"
          />
        </label>
      </h1>
      <h1 class="level">
        <label class="level">
          {t("character.levelLabel")}<Input
            variant="underline"
            name="system.utility.level"
            type="number"
            value={actor.system.utility.level}
            style="width:fit-content;max-width:5rem;font-size:var(--font-size-20);padding:0.25rem 0.5rem;"
          />
        </label>
      </h1>
      <div class="speed-wrapper">
        <span class="speed-icon-anchor" data-popup-id="speed" bind:this={speedAnchorEl}>
          <ActionIcon
            title={t("character.utility.speed")}
            aria-label={t("character.utility.speed")}
            variant="ghost"
            class="speed-action"
            onclick={toggleSpeedPopup}
            onkeydown={(e) => e.key === "Enter" && toggleSpeedPopup(e)}
          >
            {#snippet icon()}
              <i class="fas fa-rabbit-fast" aria-hidden="true"></i>
            {/snippet}
          </ActionIcon>
        </span>
        <h1>
          {#if isCharacter}
            <span class="computed-speed">{actor.system.utility.speed}</span>
          {:else}
            <label>
              <Input
                variant="underline"
                name="system.utility.speed"
                type="number"
                data-dtype="Number"
                value={actor.system.utility.speed}
                style="width:3rem;font-size:var(--font-size-20);padding:0.25rem 0.5rem;"
              />
            </label>
          {/if}
        </h1>
        {#if !isCharacter || actor.system.totals.speed !== actor.system.utility.speed}
          <span class="total-speed">({actor.system.totals.speed})</span>
        {/if}
        {#if speedPopupOpen && speedSources}
          <AnchoredPopup
            open={true}
            anchorEl={speedAnchorEl}
            onClose={closeSpeedPopup}
            popupId="speed"
            triggerMode="click"
          >
            {#snippet children()}
              <StatDetailContent
                titleKey="character.utility.speed"
                sources={speedSources}
                total={speedTotal}
                {variant}
                onExtraChange={handleSpeedExtraChange}
              />
            {/snippet}
          </AnchoredPopup>
        {/if}
      </div>
    </div>

    <HPBar {actor} />
  </div>
</header>

<style>
  .sheet-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 0 0 auto;
    padding-bottom: 4px;
  }

  .profile-img {
    flex: 0 0 72px;
    border: 1px solid var(--color-border-light-1);
    border-radius: 3px;
    object-fit: cover;
    cursor: pointer;
    height: 100%;
  }

  .introduction-info {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  .total-speed,
  .computed-speed {
    font-size: 1.25rem;
  }

  .level {
    display: flex;
    align-items: baseline;
    flex-grow: 0;
    font-size: var(--font-size-20);
  }

  .header-fields {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .charname {
    flex: 1;
    margin: 0;
    font-size: var(--font-size-20);
  }

  .charname label {
    display: inline-flex;
    align-items: baseline;
    gap: 0.25rem;
    width: 100%;
  }

  .name-label {
    font-size: var(--font-size-20);
    white-space: nowrap;
  }

  .speed-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .speed-icon-anchor {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 0.15rem;
  }

  .speed-wrapper :global(.speed-action.action-icon) {
    width: auto;
    min-width: 2.75rem;
    min-height: 2.75rem;
    height: auto;
    font-size: var(--font-size-20);
    padding: 0.3rem 0.4rem;
    box-sizing: border-box;
  }
</style>
