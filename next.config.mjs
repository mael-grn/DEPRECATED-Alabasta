/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: 'https://theyallsayflix.su:8081/:path*',
                destination: 'http://theyallsayflix.su:8081/:path*',
            },
        ]
    },
    images: {
        domains: ['image.yts.rs', 'm.media-amazon.com', 'image.tmdb.org'],
    },
};

export default nextConfig;
