// Transfer size (cache disabled, full scroll so lazy images load) and scroll frame times at 1728x1117.
const pw = require(process.env.PLAYWRIGHT || '/Users/eyalraz/.npm/_npx/705bc6b22212b352/node_modules/playwright');
(async () => {
  const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1728, height: 1117 } }); const p = await ctx.newPage();
  let bytes = 0, n = 0; const byType = {};
  p.on('response', async r => { try { const h = r.headers(); const len = +(h['content-length'] || 0) || (await r.body()).length; bytes += len; n++; const t = (h['content-type'] || '?').split(';')[0]; byType[t] = (byType[t] || 0) + len; } catch (e) {} });
  await p.goto('http://localhost:8010/?nointro', { waitUntil: 'networkidle' });
  const frames = await p.evaluate(() => new Promise(res => {
    const d = []; let last = performance.now(); let y = 0; const max = document.documentElement.scrollHeight - innerHeight;
    function f(t) { d.push(t - last); last = t; y += 24; scrollTo(0, y); if (y < max) requestAnimationFrame(f); else res(d); }
    requestAnimationFrame(f);
  }));
  await p.waitForTimeout(1500);
  const long = frames.filter(x => x > 32).length, p95 = frames.slice().sort((a, b) => a - b)[Math.floor(frames.length * 0.95)];
  console.log(`transfer: ${(bytes / 1048576).toFixed(2)} MB over ${n} requests`); for (const k of Object.keys(byType)) console.log(`  ${k.padEnd(24)} ${(byType[k] / 1024).toFixed(0)} KB`);
  console.log(`scroll frames: ${frames.length}, p95 ${p95.toFixed(1)} ms, >32ms: ${long}`);
  await b.close();
})();
