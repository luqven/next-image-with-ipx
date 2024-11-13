import { ImageLoader } from "next/image";

const imageLoader: ImageLoader = ({ src, width, quality = 75 }) => {
  // Handle both local and remote images
  const isRemoteImage = src.startsWith("http://") || src.startsWith("https://");

  // For remote images, encode the full URL
  const imagePath = isRemoteImage
    ? encodeURIComponent(src)
    : src.startsWith("/")
    ? src.slice(1)
    : src;

  // Construct the URL with optimization parameters
  const url = `/api/_ipx/${imagePath}`;

  // Add optimization parameters
  const searchParams = new URLSearchParams();
  searchParams.set("w", width?.toString());
  searchParams.set("q", quality?.toString());

  return `${url}?${searchParams.toString()}`;
};

export default imageLoader;
