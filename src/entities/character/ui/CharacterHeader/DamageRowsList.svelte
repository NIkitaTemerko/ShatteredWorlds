<script lang="ts">
  import DamageRowItem, { type DamageRow } from "./DamageRowItem.svelte";

  const AUTO_SCROLL_EDGE_PX = 40;
  const AUTO_SCROLL_MAX_SPEED = 3;

  interface Props {
    rows?: DamageRow[];
    massCategory: number;
    onDragChange?: (dragging: boolean) => void;
  }

  let { rows = $bindable([]), massCategory, onDragChange }: Props = $props();

  let container = $state<HTMLDivElement | undefined>();

  let mouseYCoordinate = $state<number | null>(null);
  let distanceTopGrabbedVsPointer = $state<number | null>(null);

  let draggingItem = $state<DamageRow | null>(null);
  let draggingItemId = $state<string | null>(null);
  let draggingItemIndex = $state<number | null>(null);
  let hoveredItemIndex = $state<number | null>(null);

  let scrollDragOverHandler: ((e: DragEvent) => void) | null = null;

  const sortDisabled = $derived(rows.length <= 1);

  const ghostStyle = $derived.by(() => {
    if (
      mouseYCoordinate === null ||
      distanceTopGrabbedVsPointer === null ||
      !container
    ) {
      return null;
    }

    const rect = container.getBoundingClientRect();
    return {
      top: mouseYCoordinate + distanceTopGrabbedVsPointer,
      left: rect.left,
      width: rect.width,
    };
  });

  $effect(() => {
    if (
      draggingItemIndex !== null &&
      hoveredItemIndex !== null &&
      draggingItemIndex !== hoveredItemIndex
    ) {
      const from = draggingItemIndex;
      const to = hoveredItemIndex;
      const items = [...rows];
      [items[from], items[to]] = [items[to], items[from]];
      rows = items;
      draggingItemIndex = to;
    }
  });

  function getScrollEl(): HTMLElement | null {
    const scrollEl = container?.closest(".scroll-area");
    return scrollEl instanceof HTMLElement ? scrollEl : null;
  }

  function isInAutoScrollZone(clientY: number, rect: DOMRect): boolean {
    return (
      clientY < rect.top + AUTO_SCROLL_EDGE_PX ||
      clientY > rect.bottom - AUTO_SCROLL_EDGE_PX
    );
  }

  function autoScroll(clientY: number) {
    const scrollEl = getScrollEl();
    if (!scrollEl) return;

    const rect = scrollEl.getBoundingClientRect();
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScroll <= 0) return;

    if (clientY > rect.bottom - AUTO_SCROLL_EDGE_PX) {
      let t: number;
      if (clientY > rect.bottom) {
        t = 0.4;
      } else {
        t = (clientY - (rect.bottom - AUTO_SCROLL_EDGE_PX)) / AUTO_SCROLL_EDGE_PX;
      }
      scrollEl.scrollTop = Math.min(
        maxScroll,
        scrollEl.scrollTop + AUTO_SCROLL_MAX_SPEED * Math.min(1, t),
      );
      return;
    }

    if (clientY < rect.top + AUTO_SCROLL_EDGE_PX) {
      let t: number;
      if (clientY < rect.top) {
        t = 0.4;
      } else {
        t = (rect.top + AUTO_SCROLL_EDGE_PX - clientY) / AUTO_SCROLL_EDGE_PX;
      }
      scrollEl.scrollTop = Math.max(
        0,
        scrollEl.scrollTop - AUTO_SCROLL_MAX_SPEED * Math.min(1, t),
      );
    }
  }

  function attachScrollDragOver() {
    const scrollEl = getScrollEl();
    if (!scrollEl || scrollDragOverHandler) return;

    scrollDragOverHandler = (ev: DragEvent) => {
      ev.preventDefault();
      if (ev.clientY === 0) return;
      mouseYCoordinate = ev.clientY;
      autoScroll(ev.clientY);
    };
    scrollEl.addEventListener("dragover", scrollDragOverHandler);
  }

  function detachScrollDragOver() {
    const scrollEl = getScrollEl();
    if (scrollEl && scrollDragOverHandler) {
      scrollEl.removeEventListener("dragover", scrollDragOverHandler);
    }
    scrollDragOverHandler = null;
  }

  function updateRow(id: string, patch: Partial<Omit<DamageRow, "id">>) {
    rows = rows.map((row) => (row.id === id ? { ...row, ...patch } : row));
  }

  function removeRowById(id: string) {
    if (sortDisabled) return;
    rows = rows.filter((row) => row.id !== id);
  }

  function isInteractiveDragTarget(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLElement &&
      !!target.closest("input, select, button, label, textarea")
    );
  }

  function handleDragStart(e: DragEvent, item: DamageRow, index: number) {
    if (sortDisabled || isInteractiveDragTarget(e.target)) {
      e.preventDefault();
      return;
    }

    const rowEl = e.currentTarget as HTMLElement;
    mouseYCoordinate = e.clientY;
    distanceTopGrabbedVsPointer = rowEl.getBoundingClientRect().top - e.clientY;

    draggingItem = item;
    draggingItemIndex = index;
    draggingItemId = item.id;
    hoveredItemIndex = index;
    onDragChange?.(true);
    attachScrollDragOver();
  }

  function handleDrag(e: DragEvent) {
    if (e.clientY === 0) return;
    mouseYCoordinate = e.clientY;
    autoScroll(e.clientY);
  }

  function handleDragOver(e: DragEvent, index: number) {
    if (e.clientY !== 0) {
      mouseYCoordinate = e.clientY;
      autoScroll(e.clientY);
    }

    const scrollEl = getScrollEl();
    if (scrollEl && e.clientY !== 0 && isInAutoScrollZone(e.clientY, scrollEl.getBoundingClientRect())) {
      return;
    }

    hoveredItemIndex = index;
  }

  function handleDragEnd() {
    detachScrollDragOver();
    draggingItemId = null;
    hoveredItemIndex = null;
    mouseYCoordinate = null;
    distanceTopGrabbedVsPointer = null;
    draggingItem = null;
    draggingItemIndex = null;
    onDragChange?.(false);
  }

  function ghostPortal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

<div class="damage-rows" role="list" bind:this={container}>
  {#if mouseYCoordinate !== null && draggingItem && ghostStyle}
    <div
      use:ghostPortal
      class="item ghost"
      style:top="{ghostStyle.top}px"
      style:left="{ghostStyle.left}px"
      style:width="{ghostStyle.width}px"
    >
      <div class="damage-row-item">
        <DamageRowItem row={draggingItem} {massCategory} dragDisabled />
      </div>
    </div>
  {/if}

  {#each rows as item, index (item.id)}
    <div
      class="damage-row-item"
      role="listitem"
      class:invisible={draggingItemId === item.id}
      draggable={!sortDisabled}
      ondragstart={(e) => handleDragStart(e, item, index)}
      ondrag={handleDrag}
      ondragover={(e) => {
        e.preventDefault();
        handleDragOver(e, index);
      }}
      ondragend={handleDragEnd}
    >
      <DamageRowItem
        row={item}
        {massCategory}
        dragDisabled={sortDisabled}
        removeDisabled={sortDisabled}
        onUpdate={(patch) => updateRow(item.id, patch)}
        onRemove={() => removeRowById(item.id)}
      />
    </div>
  {/each}
</div>

<style>
  .damage-rows {
    position: relative;
    padding: 0.15rem 0;
  }

  .damage-row-item {
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
    box-sizing: border-box;
    margin-bottom: 0.35rem;
    padding: 0.4rem 0.45rem;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    cursor: grab;
  }

  .item.ghost {
    position: fixed;
    margin-bottom: 0.35rem;
    pointer-events: none;
    z-index: 1000001;
    box-sizing: border-box;
  }

  .item.ghost .damage-row-item {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
    cursor: grabbing;
  }

  .invisible {
    opacity: 0;
  }
</style>
