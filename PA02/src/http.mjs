import { createServer } from 'node:http';

export function createHttpServer(app) {
  return createServer(async (request, reply) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    let body;
    try { body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : undefined; } catch { body = undefined; }
    const result = await app.handle({ method: request.method, path: new URL(request.url, `http://${request.headers.host}`).pathname, headers: request.headers, body });
    reply.writeHead(result.status, result.headers);
    reply.end(JSON.stringify(result.body));
  });
}
