/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        // Supabase Storage — para imágenes de producto subidas desde el panel
        protocol: "https",
        hostname: "achzefxiylozwnuglvyz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
