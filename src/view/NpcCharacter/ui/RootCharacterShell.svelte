<script lang="ts">
  import type { ShwActor } from '../../../documents/Actor/ShwActor';
  import type { AdditionalAttributes } from '../../../entities/character';
  import { AdditionalStats, AttributeStats, CharacterHeader } from '../../../entities/character';
  import { RollPanel } from '../../../features/roll';

  interface Props {
    actor: ShwActor<'npc'>;
  }

  let { actor }: Props = $props();

  function handleAdditionalStatsUpdate(key: keyof AdditionalAttributes, value: number) {
    actor.update({ [`system.additionalAttributes.${String(key)}`]: value });
  }

  // For NPC, ALL additional stats should be editable
  const npcEditableKeys = new Set<keyof AdditionalAttributes>([
    'actions',
    'bonusActions',
    'reactions',
    'impulse',
    'initiative',
    'additionalCloseCombatDamage',
    'additionalRangeDamage',
    'range',
    'damageReduction',
    'armorClass',
  ]);
</script>

<CharacterHeader {actor} />

<section>
  <AttributeStats {actor} isNpc={true} />
  <RollPanel {actor} />
</section>
<AdditionalStats
  stats={actor.system.additionalAttributes}
  helpers={actor.system.helpers}
  editableKeys={npcEditableKeys}
  onUpdate={handleAdditionalStatsUpdate}
/>
