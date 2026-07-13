<script lang="ts">
  import { localize, t } from "../../../../shared/i18n";
  import type { I18nKey } from "../../../../shared/i18n";
  import type { DamageSequenceResult } from "../../../../shared/model/damage/types";

  interface Props {
    result: DamageSequenceResult;
  }

  let { result }: Props = $props();

  function shouldShowDefenseStep(
    step: DamageSequenceResult["entries"][number]["defenseSteps"][number],
  ): boolean {
    if (step.blocked > 0) return true;
    return step.layer === "armorClass" && (step.penetration ?? 0) > 0;
  }

  function defenseStepLabel(
    step: DamageSequenceResult["entries"][number]["defenseSteps"][number],
  ): string {
    if (step.layer === "armorClass") {
      const pen = step.penetration ?? 0;
      if (pen > 0 && step.blocked === 0) {
        return localize("character.damage.log.armorFullPen", {
          stat: String(step.stat),
          pen: String(pen),
        });
      }
      if (pen > 0) {
        return localize("character.damage.log.armorWithPen", {
          blocked: String(step.blocked),
          stat: String(step.stat),
          pen: String(pen),
          effective: String(step.effectiveStat ?? step.stat),
        });
      }
      return localize("character.damage.log.armor", {
        blocked: String(step.blocked),
        stat: String(step.effectiveStat ?? step.stat),
      });
    }
    if (step.layer === "psiDefense") {
      return localize("character.damage.log.psiDefense", {
        blocked: String(step.blocked),
        stat: String(step.stat),
      });
    }
    return localize("character.damage.log.damageReduction", {
      blocked: String(step.blocked),
      stat: String(step.stat),
    });
  }
</script>

<div class="damage-log">
  {#each result.entries as entry (entry.id)}
    {@const typeLabel = t(`damage.types.${entry.type}` as I18nKey)}
    <section class="damage-log-entry">
      <header class="damage-log-entry-header">
        {localize("character.damage.log.entry", {
          order: String(entry.order),
          type: typeLabel,
          raw: String(entry.raw),
        })}
      </header>

      {#if entry.raw <= 0}
        <p class="damage-log-line damage-log-line--muted">{t("character.damage.log.noDamage")}</p>
      {:else}
        {#if entry.barrierAbsorbed > 0}
          <p class="damage-log-line">
            {localize("character.damage.log.barrier", { amount: String(entry.barrierAbsorbed) })}
            <span class="damage-log-muted">
              ({localize("character.damage.log.barrierRemaining", {
                remaining: String(entry.barrierAfter),
              })})
            </span>
          </p>
        {/if}

        {#if entry.overflow > 0}
          <p class="damage-log-line">
            {localize("character.damage.log.overflow", { amount: String(entry.overflow) })}
          </p>
        {/if}

        {#each entry.defenseSteps as step, stepIndex (stepIndex)}
          {#if shouldShowDefenseStep(step)}
            <p class="damage-log-line">{defenseStepLabel(step)}</p>
          {/if}
        {/each}

        <p class="damage-log-line damage-log-line--hp">
          {localize("character.damage.log.hpDamage", { amount: String(entry.hpDamage) })}
        </p>

        <p class="damage-log-line damage-log-line--muted">
          {localize("character.damage.log.afterState", {
            barrier: String(entry.barrierAfter),
            health: String(entry.healthAfter),
          })}
        </p>
      {/if}
    </section>
  {/each}

  <footer class="damage-log-footer">
    {localize("character.damage.log.finalState", {
      barrier: String(result.finalBarrier),
      health: String(result.finalHealth),
    })}
  </footer>
</div>

<style>
  .damage-log {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding-bottom: 0.15rem;
    font-size: 13px;
    color: #374151;
    font-variant-numeric: tabular-nums;
  }

  .damage-log-entry {
    padding-top: 0.45rem;
  }

  .damage-log-entry + .damage-log-entry {
    border-top: 1px dashed rgba(0, 0, 0, 0.08);
  }

  .damage-log-entry-header {
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }

  .damage-log-line {
    margin: 0.1rem 0;
    padding-left: 0.75rem;
    line-height: 1.35;
  }

  .damage-log-line--hp {
    font-weight: 600;
    color: #d7263d;
  }

  .damage-log-line--muted {
    color: #6b7280;
    font-size: 12px;
  }

  .damage-log-muted {
    color: #6b7280;
  }

  .damage-log-footer {
    margin-top: 0.25rem;
    padding-top: 0.45rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-weight: 700;
    color: #1a1a1a;
  }
</style>
