export const DASHBOARD_PAGES = ['android-conversion', 'pc-distribution', 'android-distribution', 'android-radar'];
const aliases = { 'android-new-user': 'android-conversion', 'pc-optimization': 'pc-distribution' };
export function readDashboardRoute(href) {
  const url = new URL(href);
  const requested = url.searchParams.get('page');
  const page = aliases[requested] || (DASHBOARD_PAGES.includes(requested) ? requested : 'android-conversion');
  const tabs = page === 'android-conversion' ? ['global', 'review', 'local-package-geo', 'channels'] : ['overview', 'review'];
  const requestedTab = url.searchParams.get('tab');
  return { page, tab: tabs.includes(requestedTab) ? requestedTab : tabs[0], game: url.searchParams.get('game') || '81' };
}
export function dashboardUrl(href, route) {
  const url = new URL(href);
  url.searchParams.set('page', route.page);
  url.searchParams.delete('tab');
  url.searchParams.delete('game');
  if (route.page === 'android-radar') url.searchParams.set('game', route.game || '81');
  else if (route.tab && route.tab !== (route.page === 'android-conversion' ? 'global' : 'overview')) url.searchParams.set('tab', route.tab);
  return url;
}
