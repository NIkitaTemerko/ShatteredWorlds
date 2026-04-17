import { t } from '../../../shared/i18n';
import { DEFAULT_RESOURCE_CATEGORIES, DEFAULT_RESOURCE_TYPES } from '../model/constants';
import type { ResourceCategorySetting, ResourceTypeSetting } from '../model/types';
import { setResourceCategories, setResourceTypes } from './settingsStorage';

/** Хук персистентности: сохранение, сброс, отслеживание несохранённых изменений */
export function useResourcePersistence(
  getCategories: () => ResourceCategorySetting[],
  getTypes: () => ResourceTypeSetting[],
  onReset: (categories: ResourceCategorySetting[], types: ResourceTypeSetting[]) => void,
) {
  let isSaving = $state(false);
  let hasChanges = $state(false);

  function markDirty() {
    hasChanges = true;
  }

  async function handleSave() {
    isSaving = true;
    try {
      await setResourceCategories(getCategories());
      await setResourceTypes(getTypes());
      hasChanges = false;
      ui.notifications?.info(t('settings.resources.saved'));
    } catch (err) {
      ui.notifications?.error(t('settings.resources.saveError'));
      console.error(err);
    } finally {
      isSaving = false;
    }
  }

  function handleReset() {
    onReset(structuredClone(DEFAULT_RESOURCE_CATEGORIES), structuredClone(DEFAULT_RESOURCE_TYPES));
    hasChanges = true;
  }

  return {
    get isSaving() {
      return isSaving;
    },
    get hasChanges() {
      return hasChanges;
    },
    markDirty,
    handleSave,
    handleReset,
  };
}
