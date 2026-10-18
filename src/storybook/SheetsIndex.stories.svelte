<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Sheets/Index',
    parameters: {
      layout: 'padded',
    },
  });
</script>

<Story name="Overview">
  <div class="sheets-index">
    <h1>Sheets</h1>
    <p>
      Full Foundry-framed document sheets. Each story mounts the real
      <code>Root*Shell</code> inside an appv1 window chrome emulator.
    </p>
    <ul>
      <li><strong>Character</strong> — 800×770 actor sheet</li>
      <li><strong>Ability</strong> — 600×700 item sheet</li>
      <li><strong>Spell</strong> — 600×700 item sheet</li>
      <li><strong>Equipment</strong> — 600×650 item sheet</li>
      <li><strong>Consumable</strong> — 600×650 bomb fixture</li>
    </ul>
  </div>
</Story>

<style>
  .sheets-index {
    max-width: 36rem;
    color: var(--shw-color-text, #e8e4f0);
    font-family: var(--shw-font, inherit);
  }

  .sheets-index h1 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }

  .sheets-index p {
    margin: 0 0 1rem;
    color: var(--shw-color-text-muted, #9a93ad);
    line-height: 1.5;
  }

  .sheets-index ul {
    margin: 0;
    padding-left: 1.25rem;
    line-height: 1.7;
  }

  .sheets-index code {
    font-size: 0.9em;
  }
</style>
