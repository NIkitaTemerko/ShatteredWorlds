import { writable } from 'svelte/store';
import type { Tabs } from '../types';
export const currentTab = writable<Tabs>('stats');
