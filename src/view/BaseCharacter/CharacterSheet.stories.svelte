<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, within, userEvent } from 'storybook/test';
  import CharacterSheetDemo from './CharacterSheet.demo.svelte';
  const { Story } = defineMeta({
    title: 'Sheets/Character',
    component: CharacterSheetDemo,
    parameters: { layout: 'fullscreen' },
    async play({ canvasElement, args }) {
      if (!args.foundryFrame) return;
      const shell = canvasElement.querySelector('.shw-character');
      const view = canvasElement.ownerDocument.defaultView;
      if (!shell || !view) throw new Error('Character sheet did not mount');

      // Exercise the production cascade inside the host, not just the isolated mockup.
      await expect(view.getComputedStyle(shell).fontFamily).toContain('Inter Tight');
      const heading = shell.querySelector('h2');
      if (!heading) throw new Error('Character heading did not mount');
      await expect(view.getComputedStyle(heading).fontFamily).toContain('Inter Tight');
      const resourceButton = shell.querySelector('.resource-actions button');
      if (!resourceButton) throw new Error('Resource controls did not mount');
      await expect(resourceButton.getBoundingClientRect().height).toBe(28);
      const scrollArea = canvasElement.querySelector('.window-content');
      if (!scrollArea) throw new Error('Foundry scroll container did not mount');
      if ((args.windowHeight ?? 1008) >= 1008) {
        await expect(scrollArea.scrollHeight).toBeLessThanOrEqual(scrollArea.clientHeight + 1);
      } else {
        await expect(scrollArea.scrollHeight).toBeGreaterThan(scrollArea.clientHeight + 40);
      }

      if (args.initialTab === 'inventory') {
        const itemButton = shell.querySelector('.item-description-button');
        if (!itemButton) throw new Error('Inventory row did not mount');
        await expect(view.getComputedStyle(itemButton).justifyContent).toBe('flex-start');
      } else if (!args.initialTab || args.initialTab === 'stats') {
        const numericCell = shell.querySelector('.stat-value');
        if (!numericCell) throw new Error('Attribute table did not mount');
        await expect(view.getComputedStyle(numericCell).fontFamily).toContain('Tektur');
        const modes = shell.querySelector('.roll-modes');
        const buttons = modes?.querySelectorAll('button');
        if (!modes || !buttons || buttons.length !== 3) throw new Error('Roll modes did not mount');
        await expect(view.getComputedStyle(modes).overflow).toBe('hidden');
        await expect(view.getComputedStyle(buttons[0]).outlineStyle).toBe('none');
        await expect(view.getComputedStyle(buttons[0]).boxShadow).toBe('none');
        for (let index = 1; index < buttons.length; index++) {
          await expect(buttons[index].getBoundingClientRect().left).toBeGreaterThan(
            buttons[index - 1].getBoundingClientRect().right,
          );
        }
      }
    },
    argTypes: {
      initialTab: { control: 'select', options: ['stats', 'inventory', 'spells', 'abilities'] },
      initialEditing: { control: 'boolean' },
      resourceState: { control: 'select', options: ['normal', 'empty', 'overcharge'] },
      foundryFrame: { control: 'boolean' },
      windowHeight: { control: { type: 'number', min: 480, max: 1200 } },
    },
  });
</script>

<Story name="Default" />
<Story
  name="NPC"
  args={{ npc: true, foundryFrame: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('navigation')).toBeNull();
    await expect(canvas.getByRole('table')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Бросить', exact: true })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'Коэфф.' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Напор: Бонус', exact: true })).toHaveTextContent('9');
    await expect(canvas.getByRole('button', { name: 'Напор: СБ', exact: true })).toHaveTextContent('7');
    await expect(canvas.getByText('Обыч. барьер', { exact: true }).parentElement).toHaveTextContent('40');

    await userEvent.click(canvas.getByRole('button', { name: 'Напор: Доп.', exact: true }));
    const sources = within(canvas.getByRole('dialog', { name: 'Источники и коэффициенты · Напор' }));
    await expect(sources.queryByText('Экипировка', { exact: true })).toBeNull();
    await expect(sources.queryByText('Способности', { exact: true })).toBeNull();
    await userEvent.click(sources.getByRole('button', { name: 'Закрыть', exact: true }));

    await userEvent.click(canvas.getByRole('button', { name: 'Правка персонажа', exact: true }));
    await expect(canvas.queryByRole('button', { name: /^Дополнительные/ })).toBeNull();
    const force = canvas.getByRole('spinbutton', { name: 'Напор База', exact: true });
    const extraForce = canvas.getByRole('spinbutton', { name: 'Напор Ручн. доп.', exact: true });
    const speed = canvas.getByRole('spinbutton', { name: 'Скорость', exact: true });
    const maxHealth = canvas.getByRole('spinbutton', { name: 'Макс. здоровье', exact: true });
    const actions = canvas.getByRole('spinbutton', { name: 'Действия', exact: true });
    await userEvent.clear(force);
    await userEvent.type(force, '25');
    await userEvent.clear(extraForce);
    await userEvent.type(extraForce, '14');
    await userEvent.clear(speed);
    await userEvent.type(speed, '35');
    await userEvent.clear(maxHealth);
    await userEvent.type(maxHealth, '40');
    await userEvent.clear(actions);
    await userEvent.type(actions, '3');
    await userEvent.click(canvas.getByRole('button', { name: 'Применить', exact: true }));
    await expect(canvas.getByRole('button', { name: /Скорость 35/ })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Напор: Бонус', exact: true })).toHaveTextContent('14');
    await expect(canvas.getByRole('button', { name: 'Напор: СБ', exact: true })).toHaveTextContent('12');
    await expect(canvas.getByRole('button', { name: 'Напор: Коэфф.', exact: true })).toHaveTextContent('3');
    await expect(canvas.getByText('Импульс', { exact: true }).parentElement).toHaveTextContent('1');
    await expect(canvas.getByText('Действия', { exact: true }).parentElement).toHaveTextContent('3');
    await expect(canvas.getByText('18 / 40', { exact: true })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Напор: Коэфф.', exact: true }));
    const coefficients = within(canvas.getByRole('dialog', { name: 'Коэффициенты · Напор' }));
    await expect(coefficients.getByRole('heading', { name: 'Результат: 9' })).toBeVisible();
    await userEvent.click(coefficients.getByRole('button', { name: 'Закрыть', exact: true }));

    await userEvent.click(canvas.getByRole('button', { name: 'Макс. здоровье', exact: true }));
    const currentHealth = canvas.getByRole('spinbutton', { name: 'Здоровье', exact: true });
    await userEvent.clear(currentHealth);
    await userEvent.type(currentHealth, '27');
    await userEvent.tab();
    await expect(canvas.getByText('27 / 40', { exact: true })).toBeVisible();
    const healthPanel = within(canvas.getByRole('dialog', { name: 'Макс. здоровье' }));
    await userEvent.click(healthPanel.getByRole('button', { name: 'Закрыть', exact: true }));
    await userEvent.click(canvas.getByRole('button', { name: 'Лечение', exact: true }));
    const healingPanel = within(canvas.getByRole('dialog', { name: 'Лечение' }));
    await expect(healingPanel.getByText('1КЗ = 4', { exact: true })).toBeVisible();
    const amount = healingPanel.getByRole('spinbutton', { name: 'Количество коэффициентов' });
    await userEvent.clear(amount);
    await userEvent.type(amount, '3');
    await userEvent.click(healingPanel.getByRole('button', { name: 'Применить', exact: true }));
    await expect(canvas.getByText('39 / 40', { exact: true })).toBeVisible();
  }}
/>
<Story
  name="Independent sheets"
  asChild
  play={async ({ canvasElement }) => {
    const sheets = canvasElement.querySelectorAll('[data-test-sheet]');
    const first = within(sheets[0]);
    const second = within(sheets[1]);
    await userEvent.click(first.getByRole('button', { name: 'Удар искры Собственная способность' }));
    await userEvent.click(first.getByRole('button', { name: 'Редактировать', exact: true }));
    await userEvent.type(first.getByRole('textbox', { name: 'Название', exact: true }), ' A');

    // A dirty editor must not block another sheet's panels or navigation.
    await userEvent.click(second.getByRole('button', { name: 'Нанести урон', exact: true }));
    await expect(second.getByRole('dialog', { name: 'Нанести урон' })).toBeVisible();
    await expect(first.getByRole('textbox', { name: 'Название', exact: true })).toBeVisible();
    await userEvent.click(second.getByRole('button', { name: 'Вещи', exact: true }));
    await expect(second.getByRole('heading', { name: 'Вещи', exact: true })).toBeVisible();

    // Consume A → B once; closing B afterwards must not replay that transition.
    await userEvent.click(first.getByRole('button', { name: 'Быстрый выпад Собственная способность' }));
    await userEvent.click(first.getByRole('button', { name: 'Не сохранять', exact: true }));
    await userEvent.click(first.getByRole('button', { name: 'Редактировать', exact: true }));
    await userEvent.type(first.getByRole('textbox', { name: 'Название', exact: true }), ' B');
    await userEvent.click(within(first.getByRole('dialog')).getByRole('button', { name: 'Закрыть', exact: true }));
    await userEvent.click(first.getByRole('button', { name: 'Сохранить', exact: true }));
    await expect(first.queryByRole('dialog')).toBeNull();

    // Escape in the focused panel must leave the other sheet's panel open.
    await userEvent.click(first.getByRole('button', { name: 'Нанести урон', exact: true }));
    await expect(second.getByRole('dialog', { name: 'Нанести урон' })).toBeVisible();
    await userEvent.click(first.getByRole('spinbutton', { name: 'Урон', exact: true }));
    await userEvent.keyboard('{Escape}');
    await expect(first.queryByRole('dialog')).toBeNull();
    await expect(second.getByRole('dialog', { name: 'Нанести урон' })).toBeVisible();
  }}
>
  <div style="display: flex; align-items: flex-start; gap: 24px;">
    <div data-test-sheet="first"><CharacterSheetDemo initialTab="abilities" /></div>
    <div data-test-sheet="second"><CharacterSheetDemo /></div>
  </div>
</Story>
<Story name="Items" args={{ initialTab: 'inventory' }} />
<Story name="Spells" args={{ initialTab: 'spells' }} />
<Story name="Abilities" args={{ initialTab: 'abilities' }} />
<Story name="Edit character" args={{ initialEditing: true }} />
<Story name="Empty health" args={{ resourceState: 'empty' }} />
<Story name="Barrier overcharge" args={{ resourceState: 'overcharge' }} />
<Story name="Foundry window" args={{ foundryFrame: true }} />
<Story name="Foundry items" args={{ foundryFrame: true, initialTab: 'inventory' }} />
<Story name="Foundry compact window" args={{ foundryFrame: true, windowHeight: 720 }} />

<Story
  name="Foundry damage"
  args={{ foundryFrame: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Нанести урон', exact: true }));
    const dialog = canvas.getByRole('dialog', { name: 'Нанести урон', exact: true });
    const panel = within(dialog);
    await expect(panel.getByRole('button', { name: 'Применить урон', exact: true })).toBeDisabled();
    await userEvent.clear(panel.getByRole('spinbutton', { name: 'Урон', exact: true }));
    await userEvent.type(panel.getByRole('spinbutton', { name: 'Урон', exact: true }), '20');
    await userEvent.click(panel.getByRole('button', { name: '+ Добавить строку' }));
    await userEvent.selectOptions(panel.getAllByRole('combobox')[1], 'magical');
    await userEvent.clear(panel.getAllByRole('spinbutton', { name: 'Урон', exact: true })[1]);
    await userEvent.type(panel.getAllByRole('spinbutton', { name: 'Урон', exact: true })[1], '40');
    await expect(panel.getByRole('heading', { name: 'ОЗ: 45 → 35' })).toBeVisible();
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
  }}
/>
<Story
  name="Foundry sources"
  args={{ foundryFrame: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Напор: Доп.', exact: true }));
    const panel = canvas.getByRole('dialog', { name: 'Источники и коэффициенты · Напор' });
    await expect(panel.querySelector('.coefficient-submenu')).toBeNull();
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth);
  }}
/>
<Story
  name="Foundry coefficient"
  args={{ foundryFrame: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Напор: Коэфф.', exact: true }));
    await expect(canvas.getByRole('heading', { name: 'Результат: 12' })).toBeVisible();
  }}
/>

<Story
  name="Foundry ability editor"
  args={{ foundryFrame: true, initialTab: 'abilities' }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Удар искры Собственная способность' }),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Редактировать', exact: true }));
    await expect(canvas.getByRole('textbox', { name: 'Название', exact: true })).toHaveValue(
      'Удар искры',
    );
  }}
/>
<Story
  name="Foundry healing"
  args={{ foundryFrame: true }}
  play={async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Лечение', exact: true }),
    );
  }}
/>
<Story
  name="Foundry fall damage"
  args={{ foundryFrame: true }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Нанести урон', exact: true }));
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Тип урона' }), 'fall');
    await userEvent.clear(canvas.getByRole('spinbutton', { name: 'Высота падения' }));
    await userEvent.type(canvas.getByRole('spinbutton', { name: 'Высота падения' }), '10');
  }}
/>

<Story
  name="Foundry equipment selection"
  args={{ foundryFrame: true, initialTab: 'inventory' }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Сменить экипировку' }));
    const review = canvas.getByRole('button', { name: 'Проверить выбранную смену' });
    await expect(review).toBeDisabled();
    for (const box of canvas.getAllByRole('checkbox')) await expect(box).not.toBeChecked();
    const remove = canvas.getAllByRole('checkbox', { name: /^Снять ·/ })[0];
    const equip = canvas.getAllByRole('checkbox', { name: /^Надеть ·/ })[0];
    await userEvent.click(remove);
    await userEvent.click(equip);
    await userEvent.click(remove);
    await userEvent.click(review);
    const dialog = canvas.getByRole('dialog', { name: 'Проверить выбранную смену' });
    await expect(dialog).toHaveTextContent(equip.getAttribute('aria-label'));
    await expect(dialog).not.toHaveTextContent(remove.getAttribute('aria-label'));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Закрыть' }));
    await userEvent.click(equip);
    await expect(review).toBeDisabled();
  }}
/>
