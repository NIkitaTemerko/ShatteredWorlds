<script lang="ts">
  import type { ShwActor } from '../../../../documents/Actor/ShwActor';
  import Input from '../../../../shared/ui/Input/ui.svelte';
  import HPBar from './HPBar.svelte';

  interface Props {
    actor: ShwActor<'character'> | ShwActor<'npc'>;
  }

  let { actor }: Props = $props();
</script>

<header class="sheet-header">
  <img
    class="profile-img"
    src={actor.img}
    alt="avatar"
    data-edit="img"
    title={actor.name}
    height="100"
    width="100"
  />

  <div class="header-fields">
    <div class="introduction-info">
      <h1 class="charname">
        <label>
          <span class="name-label">Имя:</span>
          <Input
            variant="underline"
            name="name"
            type="text"
            value={actor.name}
            placeholder="Name"
            fullWidth
            style="font-size:var(--font-size-20);padding:0.25rem 0.5rem;" />
        </label>
      </h1>
      <h1 class="level">
        <label class="level">
          LVL<Input
            variant="underline"
            name="system.utility.level"
            type="number"
            value={actor.system.utility.level}
            style="width:fit-content;max-width:5rem;font-size:var(--font-size-20);padding:0.25rem 0.5rem;"
          />
        </label>
      </h1>
      <div class="speed-wrapper">
        <i class="fas fa-rabbit-fast speed-icon"></i>
        <h1>
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
        </h1>
        <span class="tw:text-xl">({actor.system.helpers.totalSpeed})</span>
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
    align-items: baseline;
    gap: 0.5rem;
  }

  .speed-icon {
    font-size: var(--font-size-20);
  }
</style>
