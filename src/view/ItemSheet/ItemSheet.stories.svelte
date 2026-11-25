<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, within, userEvent, waitFor, fireEvent } from 'storybook/test';
  import ItemSheetDemo from './ItemSheet.demo.svelte';
  const state = (canvasElement) => JSON.parse(canvasElement.querySelector('[data-testid="item-demo-state"]').textContent);
  const { Story } = defineMeta({
    title: 'Sheets/Items V2', component: ItemSheetDemo, parameters: { layout: 'fullscreen' },
    argTypes: { kind: { control: 'select', options: ['equipment', 'consumable', 'resource'] }, consumableType: { control: 'select', options: ['potion', 'bomb', 'food', 'scroll', 'poison'] } },
  });
</script>

<Story name="Equipment" />
<Story name="Missing link" args={{ missingLink: true }} />
<Story name="Empty bonuses" args={{ empty: true }} />
<Story name="Potion" args={{ kind: 'consumable', consumableType: 'potion' }} />
<Story name="Bomb" args={{ kind: 'consumable', consumableType: 'bomb' }} />
<Story name="Poison" args={{ kind: 'consumable', consumableType: 'poison' }} />
<Story name="Scroll" args={{ kind: 'consumable', consumableType: 'scroll' }} />
<Story name="Food" args={{ kind: 'consumable', consumableType: 'food' }} />
<Story name="Resource" args={{ kind: 'resource' }} />
<Story name="Compact window" args={{ windowHeight: 520 }} />
<Story name="Narrow window" args={{ windowWidth: 600 }} />
<Story name="Read only" args={{ readonly: true }} />

<Story name="Edit equipment" play={async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: /Напор.*Экстра.*12/ }));
  const value = canvas.getByRole('spinbutton', { name: 'Значение', exact: true });
  await userEvent.clear(value); await userEvent.type(value, '18'); await userEvent.tab();
  await waitFor(() => expect(state(canvasElement).system.statBonuses.modifiers[0].value).toBe(18));
  await expect(canvas.getByRole('spinbutton', { name: 'Значение', exact: true })).toBeVisible();
  const slot = canvas.getByRole('combobox', { name: 'Слот:', exact: true });
  await userEvent.selectOptions(slot, 'cloak');
  await waitFor(() => expect(state(canvasElement).system.slot).toBe('cloak'));
  await expect(state(canvasElement).system.linkedItemIds).toHaveLength(2);
  await expect(state(canvasElement).system.statBonuses.modifiers[0].value).toBe(18);
  await expect(state(canvasElement).system.armorClass).toBe(12);
  await userEvent.click(canvas.getByRole('button', { name: /^Удалить связь · Каменная кожа/ }));
  await waitFor(() => expect(state(canvasElement).system.linkedItemIds).toEqual(['story-spell-1']));
}} />
<Story name="Edit food" args={{ kind: 'consumable', consumableType: 'food' }} play={async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const strength = canvas.getByRole('spinbutton', { name: 'Сила насыщения', exact: true });
  await userEvent.clear(strength); await userEvent.type(strength, '8'); await userEvent.tab();
  await waitFor(() => expect(state(canvasElement).system.nutrition.value).toBe(8));
  await userEvent.click(canvas.getByRole('button', { name: /Добавить эффект/ }));
  await waitFor(() => expect(state(canvasElement).system.effects).toHaveLength(2));
  await userEvent.click(canvas.getAllByRole('button', { name: 'Удалить эффект', exact: true })[0]);
  await waitFor(() => expect(state(canvasElement).system.effects).toHaveLength(1));
}} />
<Story name="Change consumable type" args={{ kind: 'consumable', consumableType: 'potion' }} play={async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const type = canvas.getByRole('combobox', { name: 'Тип:', exact: true });
  await userEvent.selectOptions(type, 'bomb');
  await userEvent.click(canvas.getByRole('button', { name: 'Отменить', exact: true }));
  await expect(type).toHaveValue('potion');
  await userEvent.selectOptions(type, 'bomb');
  await userEvent.click(canvas.getByRole('button', { name: 'Сменить вид', exact: true }));
  await waitFor(() => expect(state(canvasElement).system.consumableType).toBe('bomb'));
  await expect(state(canvasElement).system.effects).toBeUndefined();
  await expect(state(canvasElement).system.price).toBe(25);
  await expect(state(canvasElement).system.quantity).toBe(3);
  await expect(state(canvasElement).system.stackLimit).toBe(10);
  await expect(state(canvasElement).system.damage.amount).toBe(50);
}} />
<Story name="Save error and retry" args={{ failSave: true }} play={async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const name = canvas.getByRole('textbox', { name: 'Название предмета', exact: true });
  await userEvent.clear(name); await userEvent.type(name, 'Новая кольчуга'); await userEvent.tab();
  await waitFor(() => expect(canvas.getByRole('alert')).toBeVisible());
  await userEvent.click(canvas.getByRole('button', { name: 'Повторить', exact: true }));
  await waitFor(() => expect(state(canvasElement).name).toBe('Новая кольчуга'));
  await expect(canvas.queryByRole('alert')).toBeNull();
}} />
<Story name="Drop linked item" args={{ empty: true }} play={async ({ canvasElement }) => {
  const zone = canvasElement.querySelector('.item-drop-zone');
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', JSON.stringify({ type: 'Item', uuid: 'Item.story-spell-1' }));
  const drop = () => fireEvent(zone, new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
  await drop();
  await waitFor(() => expect(state(canvasElement).system.linkedItemIds).toEqual(['story-spell-1']));
  await waitFor(() => expect(within(canvasElement).getByRole('button', { name: /Добавить бонус/ })).toBeEnabled());
  await drop();
  await expect(state(canvasElement).system.linkedItemIds).toHaveLength(1);
  await waitFor(() => expect(within(canvasElement).getByRole('alert')).toHaveTextContent('Этот предмет уже связан.'));
}} />
<Story name="Edit resource" args={{ kind: 'resource' }} play={async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Категория:', exact: true }), 'raw');
  await waitFor(() => expect(state(canvasElement).system.category).toBe('raw'));
  const type = canvas.getByRole('combobox', { name: 'Тип ресурса', exact: true });
  await userEvent.clear(type); await userEvent.type(type, 'Лунная руда'); await userEvent.tab();
  await waitFor(() => expect(state(canvasElement).system.resourceType).toBe('Лунная руда'));
  await expect(state(canvasElement).system.quantity).toBe(12);
  await expect(state(canvasElement).system.stackLimit).toBe(99);
  await expect(state(canvasElement).system.price).toBe(80);
  await expect(state(canvasElement).system.weight).toBe(.1);
}} />
