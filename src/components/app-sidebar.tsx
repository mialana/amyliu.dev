import {
    Sidebar,
    SidebarContent,
} from "@/external/shadcn/components/ui/sidebar";

interface Props {}

export function AppSidebar(props: Props) {
    return <Sidebar variant="inset" collapsible="offcanvas" />;
}
