<script lang="ts">
  import type { ShwItem } from "../../../documents/Item/ShwItem";
  import { ReactiveDocumentWrapper } from "../../../shared/ui";
  import RootItemShell from "./RootItemShell.svelte";

  interface Props {
    getItem: () => ShwItem;
  }

  let { getItem }: Props = $props();

  const itemHooks = ["updateItem"];
</script>

<ReactiveDocumentWrapper getDocument={getItem} Shell={RootItemShell} hooks={itemHooks} propName="item" />
