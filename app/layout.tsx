import "./globals.css";
import MotionProvider from "@/app/components/motionProvider";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <MotionProvider>
            {children}
        </MotionProvider>
        </body>
        </html>
    );
}
