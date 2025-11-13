// Deprecated: Store-based state management replaced with Svelte 5 runes
// Tab state is now managed locally in RootCharacterShell.svelte using $state
// This file is kept for backwards compatibility but should not be used in new code

import { writable } from 'svelte/store';
import type { Tabs } from '../types';

export const currentTab = writable<Tabs>('stats');
