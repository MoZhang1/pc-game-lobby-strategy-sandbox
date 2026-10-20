export const UNMATCHED_STUDIO = '未匹配工作室';
export const CONFLICT_STUDIO = '工作室映射冲突';

export function studioFor(game, mapping) {
  return mapping.games[String(game.id)]?.studio || UNMATCHED_STUDIO;
}

// Browsing is deliberately separate from the comparison pool.
export function browseGames(pool, mapping, studio = 'all', query = '') {
  const term = query.trim().toLocaleLowerCase();
  return pool.filter(game =>
    (studio === 'all' || studioFor(game, mapping) === studio) &&
    `${game.name} ${game.id} ${game.aliases || ''}`.toLocaleLowerCase().includes(term)
  );
}

export function studioOptions(pool, mapping) {
  const counts = new Map();
  for (const game of pool) {
    const studio = studioFor(game, mapping);
    counts.set(studio, (counts.get(studio) || 0) + 1);
  }
  return [...counts].sort(([a], [b]) => {
    const special = name => [UNMATCHED_STUDIO, CONFLICT_STUDIO].includes(name) ? 1 : 0;
    return special(a) - special(b) || a.localeCompare(b, 'zh-CN');
  });
}
