// Utility: simple HTML render with a style
function wrapHtml(title: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 24px; line-height:1.5;}
    h1,h2,h3{color:#111}
    table{border-collapse: collapse; width:100%;}
    th,td{border:1px solid #ddd; padding:6px 8px; text-align:left; font-size:14px;}
    th{background:#f7f7f7;}
    code,pre{background:#f5f5f5; padding:6px 8px; border-radius:6px;}
    .muted{color:#666; font-size:12px;}
  </style></head><body>${body}</body></html>`;
}

function toCSV(rows: any[]) {
  if(!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v:any) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('\n') || s.includes('"')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [headers.join(',')];
  rows.forEach(r => lines.push(headers.map(h=>esc(r[h])).join(',')));
  return lines.join('\n');
}
