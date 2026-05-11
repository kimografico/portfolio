import { ALL_ENTRIES } from './normalization';
import type { AdminEntryId, DataEntry } from '../../../../interfaces/adminData';

export function calculateDuplicateIds(entries: DataEntry[] = ALL_ENTRIES): AdminEntryId[] {
  const idCount: Record<string, number> = {};

  entries.forEach((entry) => {
    const key = String(entry.id);
    idCount[key] = (idCount[key] || 0) + 1;
  });

  return Object.entries(idCount)
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort((left, right) => {
      const numericLeft = Number(left);
      const numericRight = Number(right);

      if (Number.isNaN(numericLeft) || Number.isNaN(numericRight)) {
        return left.localeCompare(right);
      }

      return numericLeft - numericRight;
    });
}
