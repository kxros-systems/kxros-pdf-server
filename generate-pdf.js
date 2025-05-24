// simple node script to test locally
import fs   from 'fs';
import http from 'http';

const data = JSON.stringify({
  html: '<h1>Hello Chase 👑</h1><p>Live from local test.</p>',
  filename: 'local-test.pdf'
});

const req = http.request(
  {host:'localhost', port:3000, path:'/generate-pdf', method:'POST',
   headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}},
  res => res.pipe(fs.createWriteStream('local-test.pdf'))
);
req.end(data);
