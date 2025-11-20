<script lang="ts" generics="TDoc extends { id: string | null }">
  import { onMount, onDestroy } from "svelte";
  import type { Component } from "svelte";

  interface Props {
    getDocument: () => TDoc;
    Shell: Component<any>;
    hooks: string[];
    propName?: string;
  }

  let { getDocument, Shell, hooks, propName = "actor" }: Props = $props();

  let docData = $state({ doc: getDocument(), version: 0 });

  function handleUpdate(doc: any) {
    const currentDoc = getDocument();
    // Only update if it's our document or a child (e.g., item on actor)
    if (!doc || doc.id === currentDoc?.id || doc.parent?.id === currentDoc?.id) {
      docData = { doc: currentDoc, version: docData.version + 1 };
    }
  }

  onMount(() => {
    for (const hook of hooks) {
      Hooks.on(hook as any, handleUpdate);
    }
  });

  onDestroy(() => {
    for (const hook of hooks) {
      Hooks.off(hook as any, handleUpdate);
    }
  });

  // Build props object dynamically
  const shellProps = $derived({ [propName]: docData.doc } as any);
</script>

<Shell {...shellProps} />
