<script lang="ts">
  import type { ShwActor } from "../../../../documents/Actor/ShwActor";
  import {
    getActorCombatState,
    previewDamageSequence,
  } from "../../../../shared/helpers/damage";
  import { localize, t } from "../../../../shared/i18n";
  import { getDamageTypeDefinition, damageTypeHitsArmor } from "../../../../shared/model/damage/damageTypeConfig";
  import type { CombatDamageType, DamageEntry } from "../../../../shared/model/damage/types";
  import DamagePreviewLog from "./DamagePreviewLog.svelte";
  import DamageRowsList from "./DamageRowsList.svelte";
  import { type DamageRow } from "./DamageRowItem.svelte";

  const POPUP_MAX_HEIGHT = 500;
  const DEFAULT_SUMMARY_RATIO = 0.25;
  const MIN_SUMMARY_RATIO = 0.15;
  const MAX_SUMMARY_RATIO = 0.55;
  const PREVIEW_MIN_HEIGHT = 80;
  const PREVIEW_MAX_HEIGHT = 260;

  interface Props {
    actor: ShwActor<"character"> | ShwActor<"npc">;
    onApplied?: () => void;
  }

  let { actor, onApplied }: Props = $props();

  let nextRowId = $state(1);
  let previewExpanded = $state(false);
  let summaryPaneRatio = $state(DEFAULT_SUMMARY_RATIO);

  function createRow(type: CombatDamageType = "physical"): DamageRow {
    return {
      id: `damage-row-${nextRowId++}`,
      type,
      amount: 0,
      penetration: 0,
      fallHeight: 0,
    };
  }

  let rows = $state<DamageRow[]>([createRow()]);
  let isDraggingRows = $state(false);
  let frozenPreviewEntries = $state<DamageEntry[]>([]);

  const combatState = $derived(getActorCombatState(actor));

  function toDamageEntry(row: DamageRow): DamageEntry {
    const def = getDamageTypeDefinition(row.type);
    if (def.inputKind === "fallHeight") {
      return {
        id: row.id,
        type: row.type,
        amount: 0,
        fallHeight: row.fallHeight,
      };
    }
    return {
      id: row.id,
      type: row.type,
      amount: row.amount,
      penetration: damageTypeHitsArmor(def) ? row.penetration : 0,
    };
  }

  function rowsToPreviewEntries(source: DamageRow[]): DamageEntry[] {
    return source.map(toDamageEntry);
  }

  function handleRowsDragChange(dragging: boolean) {
    if (dragging) {
      frozenPreviewEntries = rowsToPreviewEntries(rows);
    }
    isDraggingRows = dragging;
  }

  const previewEntries = $derived(
    isDraggingRows ? frozenPreviewEntries : rowsToPreviewEntries(rows),
  );
  const previewResult = $derived(previewDamageSequence(previewEntries, combatState));
  const previewSummary = $derived(
    localize("character.damage.preview", {
      barrier: String(previewResult.barrierLost),
      health: String(previewResult.healthLost),
    }),
  );
  const canApply = $derived(previewResult.barrierLost > 0 || previewResult.healthLost > 0);
  const previewMaxHeight = $derived(
    Math.round(PREVIEW_MIN_HEIGHT + summaryPaneRatio * (PREVIEW_MAX_HEIGHT - PREVIEW_MIN_HEIGHT)),
  );

  function togglePreviewExpanded() {
    previewExpanded = !previewExpanded;
    if (previewExpanded) {
      summaryPaneRatio = DEFAULT_SUMMARY_RATIO;
    }
  }

  function handlePreviewResizeStart(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    const resizer = e.currentTarget as HTMLElement;
    const startY = e.clientY;
    const startRatio = summaryPaneRatio;

    resizer.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";

    const onMove = (ev: PointerEvent) => {
      const deltaRatio = (startY - ev.clientY) / (PREVIEW_MAX_HEIGHT - PREVIEW_MIN_HEIGHT);
      summaryPaneRatio = Math.min(
        MAX_SUMMARY_RATIO,
        Math.max(MIN_SUMMARY_RATIO, startRatio + deltaRatio),
      );
    };

    const onUp = (ev: PointerEvent) => {
      resizer.releasePointerCapture(ev.pointerId);
      resizer.removeEventListener("pointermove", onMove);
      resizer.removeEventListener("pointerup", onUp);
      resizer.removeEventListener("pointercancel", onUp);
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
    };

    resizer.addEventListener("pointermove", onMove);
    resizer.addEventListener("pointerup", onUp);
    resizer.addEventListener("pointercancel", onUp);
  }

  function stopPointer(e: PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.closest(".pane-resizer, .damage-rows, .drag-handle")) return;
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  function addRow() {
    rows = [...rows, createRow()];
  }

  async function applyDamage() {
    if (!canApply) return;

    await actor.update({
      "system.barrier.value": previewResult.finalBarrier,
      "system.health.value": previewResult.finalHealth,
    });

    rows = [createRow()];
    onApplied?.();
  }
</script>

<div
  class="damage-popup"
  style:max-height="{POPUP_MAX_HEIGHT}px"
  onpointerdowncapture={stopPointer}
>
  <div class="damage-popup-body">
    <div class="scroll-area">
      <DamageRowsList
        bind:rows
        massCategory={combatState.massCategory}
        onDragChange={handleRowsDragChange}
      />
    </div>
  </div>

  <div class="damage-popup-footer">
    <button type="button" class="add-entry-btn" onclick={addRow}>
      {t("character.damage.addEntry")}
    </button>

    <button
      type="button"
      class="preview-toggle"
      class:preview-toggle--expanded={previewExpanded}
      aria-expanded={previewExpanded}
      onclick={togglePreviewExpanded}
    >
      {previewSummary}
    </button>

    {#if previewExpanded}
      <div
        class="pane-resizer"
        role="separator"
        aria-orientation="horizontal"
        aria-label={t("character.damage.resizePanes")}
        onpointerdown={handlePreviewResizeStart}
      ></div>

      <div class="preview-log-scroll" style:max-height="{previewMaxHeight}px">
        <DamagePreviewLog result={previewResult} />
      </div>
    {/if}

    <button type="button" class="apply-btn" disabled={!canApply} onclick={applyDamage}>
      {t("character.damage.apply")}
    </button>
  </div>
</div>

<style>
  .damage-popup {
    padding: 0.75rem;
    min-width: 320px;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    overflow: hidden;
  }

  .damage-popup-body {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .scroll-area {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.16) transparent;
  }

  .scroll-area::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .scroll-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .scroll-area::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.16);
    border-radius: 999px;
  }

  .scroll-area::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.28);
  }

  .damage-popup-footer {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .preview-toggle {
    width: 100%;
    min-height: 2.15rem;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    font-variant-numeric: tabular-nums;
    text-align: left;
    padding: 0.35rem 0.45rem;
    user-select: none;
  }

  .preview-toggle::before {
    content: "▸";
    display: inline-block;
    margin-right: 0.35rem;
    transition: transform 150ms ease;
  }

  .preview-toggle--expanded::before {
    transform: rotate(90deg);
  }

  .preview-toggle:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .pane-resizer {
    height: 7px;
    margin: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(0, 0, 0, 0.03);
    cursor: row-resize;
    touch-action: none;
    position: relative;
    z-index: 1;
  }

  .pane-resizer::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -5px;
    bottom: -5px;
  }

  .pane-resizer::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 36px;
    height: 3px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.18);
    transform: translate(-50%, -50%);
  }

  .pane-resizer:hover {
    background: linear-gradient(
      180deg,
      rgba(0, 102, 204, 0.06),
      rgba(0, 102, 204, 0.14) 45%,
      rgba(0, 102, 204, 0.06)
    );
  }

  .preview-log-scroll {
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.16) transparent;
  }

  .preview-log-scroll::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .preview-log-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .preview-log-scroll::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.16);
    border-radius: 999px;
  }

  .preview-log-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.28);
  }

  .add-entry-btn,
  .apply-btn {
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    padding: 0.3rem 0.45rem;
    color: #374151;
  }

  .add-entry-btn:hover,
  .apply-btn:hover:not(:disabled) {
    background: rgba(222, 184, 135, 0.25);
  }

  .apply-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }
</style>
