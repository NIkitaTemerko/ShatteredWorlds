<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Widgets/Catalog',
  });
</script>

<Story name="Index">
  <div class="catalog">
    <h1>SHW widgets in Storybook</h1>
    <p>Crystal surfaces first; Foundry wiring later.</p>

    <h2>Crystal / shared</h2>
    <ul>
      <li>Crystal/Button</li>
      <li>Crystal/ActionIcon</li>
      <li>Crystal/Input</li>
      <li>Crystal/SelectInput</li>
      <li>Crystal/AutocompleteInput</li>
      <li>Crystal/HoverTooltip</li>
      <li>Crystal/AnchoredPopup</li>
      <li>Crystal/Tree</li>
      <li>Crystal/BonusCharacteristics</li>
    </ul>

    <h2>Features</h2>
    <ul>
      <li>Widgets/TabNavigation</li>
      <li>Widgets/RollPanel</li>
      <li>Widgets/UsesControl</li>
      <li>Widgets/ActivationControl</li>
      <li>Widgets/StatBonusesEditor</li>
    </ul>

    <h2>Entities · stats & damage</h2>
    <ul>
      <li>Widgets/StatsCard</li>
      <li>Widgets/AttributeStatCell</li>
      <li>Widgets/StatTile</li>
      <li>Widgets/LegacyAdditionalStats</li>
      <li>Widgets/StatDetailAdjustableValue</li>
      <li>Widgets/StatDetailContent</li>
      <li>Widgets/AttributeBaseDetailContent</li>
      <li>Widgets/AttributeExtraDetailContent</li>
      <li>Widgets/AttributeRollDetailContent</li>
      <li>Widgets/HealthDetailContent</li>
      <li>Widgets/CoefficientCalculationPanel</li>
      <li>Widgets/DamageRowItem</li>
      <li>Widgets/DamageRowsList</li>
      <li>Widgets/DamagePreviewLog</li>
    </ul>

    <h2>Entities · menus & trees</h2>
    <ul>
      <li>Widgets/PopupMenu</li>
      <li>Widgets/MenuAction</li>
      <li>Widgets/MenuQuantity</li>
      <li>Widgets/AbilityTree</li>
      <li>Widgets/SpellTree</li>
      <li>Widgets/EquipmentTree</li>
    </ul>

    <h2>Needs actor fixture</h2>
    <ul>
      <li>HPBar, CharacterHeader, DamagePopupContent</li>
      <li>AttributeStats / AdditionalStats grids</li>
      <li>CharacterInventory / Equipment / Spells / Abilities shells</li>
      <li>InventoryTree (Foundry Hooks)</li>
      <li>ReactiveDocumentWrapper</li>
      <li>BookLayout + editMode</li>
    </ul>
  </div>
</Story>

<style>
  .catalog {
    max-width: 36rem;
    color: var(--shw-color-text, #e8e4f0);
    font-family: var(--shw-font, inherit);
  }

  h1 {
    margin: 0 0 0.35rem;
    font-size: 1.35rem;
  }

  h2 {
    margin: 1.25rem 0 0.35rem;
    font-size: 0.95rem;
    color: var(--shw-color-primary-bright, #b57aef);
  }

  p,
  li {
    color: var(--shw-color-text-muted, #9a93ad);
    font-size: 13px;
  }

  ul {
    margin: 0;
    padding-left: 1.1rem;
  }
</style>
