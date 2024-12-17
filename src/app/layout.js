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
        <Head>
            <meta name="theme-color" content="#151515"/>
            <meta name="msapplication-navbutton-color" content="#151515"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="#151515"/>

        </Head>
        <body className={rubik.className}>
        <LenisScroll/>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
