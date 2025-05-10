import "../globals.css";
import Navbar from "@/app/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={"md:pl-28 p-4 md:pb-4 pb-28 min-h-[100vh] flex flex-col"}>
          <Navbar/>
          {children}
      </div>
  );
}
