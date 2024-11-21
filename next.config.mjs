/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/media/subs/download/get/:path*',
                destination: 'https://www.opensubtitles.com/download/:path*',
            },
        ]
    },
    images: {
        domains: ['image.yts.rs', 'm.media-amazon.com', 'image.tmdb.org'],
    },
};

export default nextConfig;
