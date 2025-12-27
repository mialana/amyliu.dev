import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/external/shadcn/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface Props {
    children: React.ReactNode;
    defaultSidebarOpen: boolean; // remove this if not using cookies for sidebar state
}

export default function Page(props: Props) {
    return (
        <SidebarProvider>
            <SidebarTrigger />
            <AppSidebar />
            <SidebarInset>{props.children}</SidebarInset>
        </SidebarProvider>
    );
}
