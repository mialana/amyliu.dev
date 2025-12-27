import {
    Sidebar,
    SidebarContent,
} from "@/external/shadcn/components/ui/sidebar";

interface Props {}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            variant="inset"
            collapsible="offcanvas"
            {...props}
            className="top-(--header-height)"
        >
            <SidebarContent>This is the content</SidebarContent>
        </Sidebar>
    );
}
