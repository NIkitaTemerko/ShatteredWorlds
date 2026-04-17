import { t } from '../../../shared/i18n';
import type { ResourceCategorySetting } from '../model/types';

/** Хук управления категориями ресурсов: CRUD + аккордеон */
export function useCategoryEditor(initial: ResourceCategorySetting[], onDirty: () => void) {
  let categories = $state<ResourceCategorySetting[]>(initial);
  let expandedCategories = $state<Set<string>>(new Set());

  function addCategory() {
    const id = `custom-${Date.now()}`;
    categories = [
      ...categories,
      { id: id as any, label: t('settings.resources.newCategory'), color: '#6B7280' },
    ];
    const next = new Set(expandedCategories);
    next.add(id);
    expandedCategories = next;
    onDirty();
  }

  function removeCategory(index: number, hasLinkedTypes: boolean) {
    if (hasLinkedTypes) {
      ui.notifications?.warn(t('settings.resources.cannotDelete'));
      return;
    }
    categories = categories.filter((_, i) => i !== index);
    onDirty();
  }

  function updateCategory(index: number, field: keyof ResourceCategorySetting, value: string) {
    categories[index] = { ...categories[index], [field]: value };
    onDirty();
  }

  function toggleCategory(id: string) {
    const next = new Set(expandedCategories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expandedCategories = next;
  }

  return {
    get categories() {
      return categories;
    },
    set categories(v) {
      categories = v;
    },
    get expandedCategories() {
      return expandedCategories;
    },
    set expandedCategories(v) {
      expandedCategories = v;
    },
    addCategory,
    removeCategory,
    updateCategory,
    toggleCategory,
  };
}
