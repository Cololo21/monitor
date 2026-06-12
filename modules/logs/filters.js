// modules/logs/filters.js

export function filterLogs(logsArray, currentFilter) {
  if (currentFilter === 'ALL') return logsArray;
  return logsArray.filter(log => log.level === currentFilter);
}