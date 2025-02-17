"use client";

import * as React from "react";
import { Music2, Music2Icon } from "lucide-react";

import { NavProjects } from "@/components/navbar/nav-projects";
import { TeamSwitcher } from "@/components/navbar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const projects = [
  {
    name: "Song",
    url: "/",
    icon: Music2,
  }
];

const devices = [
  {
    name: "tongla_dev",
    logo: Music2Icon,
    plan: "Apple Music",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={devices} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
