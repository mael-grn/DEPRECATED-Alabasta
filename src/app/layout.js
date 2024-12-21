import {Rubik} from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/ui/navbar";
import LenisScroll from "@/app/components/tools/lenis";
import Head from "next/head";

const rubik = Rubik({subsets: ['latin']})

export const metadata = {
    title: "Alabasta",
};

export default function RootLayout({children}) {
    return (
        <html lang="fr">
        <body className={rubik.className}>
        <LenisScroll/>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
