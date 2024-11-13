This is a Next.js application configured to use [IPX image transformations](#).

Images are transformed by making requests to an `/_ipx` API route which optimizes `next/image` `<Image />` requests.

This repo is not production ready and is mostly for demonstration purposes. You should consider deploying a separate IPX image transformation server if you intend to run this in production.

## Getting Started

First, [configure](#configuration) your environment variables.

Then, install the optional dependencies needed by this project.

```bash
npm i --include=optional sharp
# or
pnpm i --force
```

Then, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

You can try different image transformations at [http://localhost:3000/\_ipx/path-to-image](http://localhost:3000/_ipx/).

## Configuration

#### Storage

You can configure the remote storage and default format options for IPX using the environment variables.

```bash
# replace these values
IPX_REMOTE_STORAGE='remote.image.domain' # remote image domain
DEFAULT_IMAGE_FORMAT='webp' # default format to use for images
```

#### Caching

The API route is configured to cache for only 60 seconds by default. You can and should modify this to better suite your needs.

```js
headers: {
  "Content-Type":
  //...
  "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
},
```

Whether or not your're deploying on Vercel, consider [using a CDN](https://focusreactive.com/configure-cdn-caching-for-self-hosted-next-js-websites/#configuring-cloudflare-cdn-for-the-nextjs-app) like Cloudflare to cache the image response. This will help prevent unnecessary transformations and control costs.

#### `<Image />` component

You can customize the behavior of the `<Image />` component by changing the [`image-loader.ts`](./lib/image-loader.ts) file.

The `next/image` custom [loaders](https://nextjs.org/docs/app/api-reference/next-config-js/images) don't support passing the `height` prop. If you need to, for example, crop and image and preserve the aspect ratio of the image you might need to try to use a [work-around](https://github.com/vercel/next.js/discussions/22050#discussioncomment-652148). In theory you could move the `route.ts` configuration into the custom loader and do away with the API route. In doing so you'd lose some of the cache control and you'd also lose the ability to use an image component other than `next/image`.

You can use the `/api/_ipx` route with another image component, for example [`unpic-image`](https://unpic.pics/img/). It has native [support](https://x.com/ascorbic/status/1721070114814980161) for IPX.

## Learn More

To learn more, take a look at the following resources:

- [IPX Documentation](https://github.com/unjs/ipx) - learn how to use ipx transforms
- [Sharp Documentation](https://github.com/lovell/sharp) - learn how to use additional sharp options
- [libvips Documentation](https://github.com/libvips/libvips) - learn what sharp binds itself to
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

Your feedback and contributions are welcome!

## Deploy

You can deploy and try out this Next.js application for free on:

- [Vercel](https://vercel.com/new)
- [Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/luqven/next-image-with-ipx)
- [Railway](https://railway.app/new)
- [STT](https://v2.sst.dev/learn/deploy-to-prod)
- [Self-host with Coolify](https://coolify.io/docs/applications/nextjs/)
