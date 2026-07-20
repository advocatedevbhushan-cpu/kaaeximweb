export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kaaexim</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }
      code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Kaaexim</h1>
    <p>This worker entrypoint was added so Wrangler can deploy the project.</p>
    <p>Use the app build output for full site functionality after configuring the Cloudflare adapter.</p>
  </body>
</html>`,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        }
      );
    }

    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  },
};

