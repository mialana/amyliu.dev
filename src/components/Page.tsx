import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/external/shadcn/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface Props {
    children: React.ReactNode;
}

export default function Page(props: Props) {
    return (
        <SidebarProvider>
            <AppSidebar side="left" />
            <SidebarInset>{props.children}</SidebarInset>
            <AppSidebar side="right" />
        </SidebarProvider>
    );
}
