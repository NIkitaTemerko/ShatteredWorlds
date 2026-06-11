import { t } from '../../../shared/i18n';
import type { ResourceTypeSetting } from '../model/types';

interface TypeWithIndex extends ResourceTypeSetting {
  originalIndex: number;
}

/** Хук управления типами ресурсов: CRUD + фильтрация + сиротские типы */
export function useTypeEditor(
  initial: ResourceTypeSetting[],
  getCategoryIds: () => string[],
  onDirty: () => void,
) {
  let types = $state<ResourceTypeSetting[]>(initial);

  const orphanTypes: TypeWithIndex[] = $derived(
    types
      .map((typ, i) => ({ ...typ, originalIndex: i }))
      .filter((typ) => !getCategoryIds().includes(typ.category)),
  );

  function addType(categoryId: string) {
    types = [
      ...types,
      {
        type: `custom-${Date.now()}`,
        category: categoryId as any,
        label: t('settings.resources.newType'),
        icon: 'fas fa-box',
      },
    ];
    onDirty();
  }

  function removeType(index: number) {
    types = types.filter((_, i) => i !== index);
    onDirty();
  }

  function updateType(index: number, field: keyof ResourceTypeSetting, value: string) {
    types[index] = { ...types[index], [field]: value };
    onDirty();
  }

  function getTypesForCategory(categoryId: string): TypeWithIndex[] {
    return types
      .map((typ, i) => ({ ...typ, originalIndex: i }))
      .filter((typ) => typ.category === categoryId);
  }

  return {
    get types() {
      return types;
    },
    set types(v) {
      types = v;
    },
    get orphanTypes() {
      return orphanTypes;
    },
    addType,
    removeType,
    updateType,
    getTypesForCategory,
  };
}
