import { ALL_ENTRIES, DATA_SOURCES } from './normalization';
import type { DataEntry, FilterOptions } from '../../../../interfaces/adminData';

export function getCategoryOptions(filterType: string): string[] {
  const categories = DATA_SOURCES.filter((source) => !filterType || source.type === filterType).map(
    (source) => source.category,
  );

  return Array.from(new Set(categories)).sort();
}

export function getClienteOptions(filterType: string, filterCategory: string): string[] {
  const filteredEntries = ALL_ENTRIES.filter(
    (entry) =>
      (!filterType || entry.type === filterType) &&
      (!filterCategory || entry.category === filterCategory),
  );

  const clientCount: Record<string, number> = {};

  filteredEntries.forEach((entry) => {
    if (entry.cliente) {
      clientCount[entry.cliente] = (clientCount[entry.cliente] || 0) + 1;
    }
  });

  const frequentClients = Object.entries(clientCount)
    .filter(([, count]) => count > 1)
    .map(([client]) => client)
    .sort();

  if (Object.values(clientCount).some((count) => count === 1)) {
    frequentClients.push('OTROS');
  }

  return frequentClients;
}

export function applyFilters(entries: DataEntry[], options: FilterOptions): DataEntry[] {
  const { filterVisibility, filterType, filterCategory, filterCliente, localVisibility } = options;

  return entries.filter((entry) => {
    const isVisible = entry.id in localVisibility ? localVisibility[entry.id] : entry.visible;

    if (filterCliente === 'OTROS') {
      const subset = entries.filter(
        (item) =>
          (!filterType || item.type === filterType) &&
          (!filterCategory || item.category === filterCategory),
      );
      const clientCount: Record<string, number> = {};

      subset.forEach((item) => {
        if (item.cliente) {
          clientCount[item.cliente] = (clientCount[item.cliente] || 0) + 1;
        }
      });

      return (
        (filterVisibility === 'all' ||
          (filterVisibility === 'visible' && isVisible) ||
          (filterVisibility === 'hidden' && !isVisible)) &&
        (!filterType || entry.type === filterType) &&
        (!filterCategory || entry.category === filterCategory) &&
        clientCount[entry.cliente] === 1
      );
    }

    return (
      (filterVisibility === 'all' ||
        (filterVisibility === 'visible' && isVisible) ||
        (filterVisibility === 'hidden' && !isVisible)) &&
      (!filterType || entry.type === filterType) &&
      (!filterCategory || entry.category === filterCategory) &&
      (!filterCliente || entry.cliente === filterCliente)
    );
  });
}
