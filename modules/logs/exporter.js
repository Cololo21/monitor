// modules/logs/exporter.js

export function exportLogs(logsArray, format) {
  let content = '';
  if (format === 'JSON') {
    content = JSON.stringify(logsArray, null, 2);
  } else {
    content = logsArray.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bitcrack_logs.${format.toLowerCase()}`;
  link.click();
}