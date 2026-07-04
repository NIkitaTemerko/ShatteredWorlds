<script lang="ts">
  import type { ShwActor } from "../../../documents/Actor/ShwActor";
  import { AdditionalStats, AttributeStats, CharacterHeader } from "../../../entities/character";
  import { RollPanel } from "../../../features/roll";
  import type { AdditionalAttributes } from "../../../shared/model/types";

  interface Props {
    actor: ShwActor<"npc">;
  }

  let { actor }: Props = $props();

  function handleAdditionalStatsUpdate(key: keyof AdditionalAttributes, value: number) {
    actor.update({ [`system.additionalAttributes.${String(key)}`]: value });
  }
</script>

<CharacterHeader {actor} />

<section>
  <AttributeStats {actor} isNpc={true} />
  <RollPanel {actor} />
</section>
<AdditionalStats {actor} onUpdate={handleAdditionalStatsUpdate} />
