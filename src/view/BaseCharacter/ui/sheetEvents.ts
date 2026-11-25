import { getContext, setContext } from 'svelte';

const sheetEventsKey = Symbol('character-sheet-events');

export function createSheetEvents(): EventTarget {
  return setContext(sheetEventsKey, new EventTarget());
}

export function getSheetEvents(): EventTarget {
  return getContext<EventTarget>(sheetEventsKey);
}
