/**
 * ISO-2 country codes → SU_A3 subunit codes mapping.
 * Only mainland/continental territories are mapped (no overseas).
 *
 * Source: Natural Earth Admin 0 Map Subunits (50m)
 * SU_A3 codes: https://github.com/nvkelso/natural-earth-vector/blob/master/ne_10m_admin_0_scale_rank.tsv
 */
export const VISITED_COUNTRIES: Record<string, string[]> = {
  AD: ['AND'], // Andorra
  ES: ['ESX'], // Spain
  FR: ['FXX'], // France (mainland only)
  GR: ['GRC'], // Greece
  IE: ['IRL'], // Ireland
  NL: ['NLD'], // Netherlands
  TH: ['THA'], // Thailand
  GB: ['ENG'], // United Kingdom (England only)
};
