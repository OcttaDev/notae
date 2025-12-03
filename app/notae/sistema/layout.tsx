import { SidebarInset, SidebarProvider } from "@/app/_components/ui/sidebar";
import { SiteHeader } from "./_components/site-header";
import { AppSidebar } from "./_components/app-sidebar";

export default function RootLayoutSystem({ children }: Readonly<{ children: React.ReactNode; }>) {
    return <SidebarProvider
        style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }
    ><AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader />
            {children}
        </SidebarInset>
    </SidebarProvider>
}