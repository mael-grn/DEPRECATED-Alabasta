export default function manifest() {
    return {
        name: 'Alabasta',
        short_name: 'Alabasta',
        description: 'Watch movies and TV shows online',
        start_url: '/home',
        display: 'standalone',
        background_color: '#232323',
        theme_color: '#232323',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}