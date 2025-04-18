
import {
  Home,
  LayoutDashboard,
  Pickaxe,
  Folders,
  Crown,
  Book,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define menu items with their routes and icons
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mining",
    url: "/mining",
    icon: Pickaxe,
  },
  {
    title: "Content",
    url: "/content",
    icon: Folders,
    isNew: true,
  },
  {
    title: "Premium",
    url: "/premium",
    icon: Crown,
    isNew: true,
  },
  {
    title: "Docs",
    url: "/docs",
    icon: Book,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url} className="relative">
                      <item.icon />
                      <span>{item.title}</span>
                      {item.isNew && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium bg-sphere-green text-black rounded">
                          NEW
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
