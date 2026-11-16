const http = require('http');
const PORT = process.env.PORT || 3000;
const MARK = 'zz963949';
const srv = http.createServer((req, res) => {
  let n = 0; const chunks = [];
  req.on('data', c => { if (n < 8192) { chunks.push(c); n += c.length; } });
  req.on('end', () => {
    const rec = {
      t: new Date().toISOString(),
      m: req.method,
      u: req.url,
      ip: req.socket.remoteAddress,
      xff: req.headers['x-forwarded-for'] || '',
      rndr: req.headers['rndr-id'] || '',
      h: req.headers,
      b: Buffer.concat(chunks).toString('utf8').slice(0, 2048)
    };
    console.log('REQLOG ' + JSON.stringify(rec));
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ marker: MARK, ok: true, path: req.url, method: req.method }));
  });
});
srv.listen(PORT, '0.0.0.0', () => console.log('LISTEN ' + PORT));
