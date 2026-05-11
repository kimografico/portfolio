export {
  ALL_ENTRIES,
  DATA_SOURCES,
  getEntriesWithExtras,
  getPendingEntries,
} from './data/normalization';
export { buildProjectDetailPath } from './data/routes';
export { applyFilters, getCategoryOptions, getClienteOptions } from './data/filters';
export { calculateDuplicateIds } from './data/duplicates';

export type {
  AdminDataSource,
  AdminEntryId,
  AdminEntryType,
  AdminMediaItem,
  AdminSourceEntry,
  AdminVideoItem,
  DataEntry,
  FilterOptions,
  PendingEntry,
} from '../../../interfaces/adminData';
