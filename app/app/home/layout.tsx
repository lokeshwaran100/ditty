
import Navbar from "@/components/shared/navbar/Navbar"
import { Sidebar } from "@/components/shared/sidebar/Sidebar"



export default function HomeLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <div className=" ">
          <Navbar/>
        </div>
        <div className="flex gap-2">
            <Sidebar/>
          {children}
        </div>
      </section>
    )
  }