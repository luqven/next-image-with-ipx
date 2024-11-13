// app/api/_ipx/[...path]/route.ts
import { createIPX, ipxFSStorage, ipxHttpStorage } from "ipx";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const DEFAULT_IMAGE_FORMAT = process.env.DEFAULT_IMAGE_FORMAT || "webp";

const isRemoteImage = (urlPath: string) => {
  return urlPath.includes("%3A%2F%2F");
};

// Configure IPX with local and remote storage
const ipx = createIPX({
  alias: {
    images: `https://${process.env.IPX_REMOTE_STORAGE}`,
  },
  storage: ipxFSStorage({
    dir: path.join(process.cwd(), "public"), // Using Next.js public directory
  }),
  httpStorage: ipxHttpStorage({
    domains: process.env.IPX_REMOTE_STORAGE || "*", // Default to any domain
  }),
});

export const runtime = "nodejs"; // Required for file system operations

export async function GET(request: NextRequest) {
  try {
    // Reconstruct the path from the dynamic segments
    let imagePath = new URL(request.url).pathname.split("/").slice(3).join("/");

    // Correctly handle absolute urls, ie remote image that don't use alias
    if (isRemoteImage(imagePath)) {
      imagePath = new URL(decodeURIComponent(imagePath)).toString();
    }

    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const width = searchParams.get("w");
    const height = searchParams.get("h");
    const format = searchParams.get("fm") || DEFAULT_IMAGE_FORMAT;
    const quality = searchParams.get("q");

    // Build IPX operation options
    const operations: Record<string, string> = {};

    if (width) operations.width = width;
    if (height) operations.height = height; // NOTE: custom loaders don't pass heights, but if you're not using next/image this would work
    if (format) operations.format = format;
    if (quality) operations.quality = quality;

    // Process the image
    const processedImage = await ipx(imagePath, operations).process();
    const data = processedImage.data;
    // Return the optimized image
    return new NextResponse(data, {
      headers: {
        "Content-Type":
          data === "jpeg" ? "image/jpeg" : `image/${processedImage.format}`,
        // Cache with stale-while-revalidate strategy
        "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
