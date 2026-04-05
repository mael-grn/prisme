import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qel34catjilbjzcm.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
