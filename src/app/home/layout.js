import Navbar from "@/app/components/ui/navbar";

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}