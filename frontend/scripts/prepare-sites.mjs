import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const client = new URL('./client/', dist);
const server = new URL('./server/', dist);

await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const entry of ['assets', 'favicon.svg']) {
  await cp(new URL(`./${entry}`, dist), new URL(`./${entry}`, client), { recursive: true });
}

const html = await readFile(new URL('./index.html', dist), 'utf8');
await writeFile(new URL('./index.html', client), html);

await writeFile(new URL('./index.js', server), `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;
    if ((request.headers.get("accept") || "").includes("text/html")) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }
    return response;
  }
};
export default worker;
`);
