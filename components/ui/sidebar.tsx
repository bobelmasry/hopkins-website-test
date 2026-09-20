import * as React from "react";

import { cn } from "@/lib/utils";

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn("sidebar", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-content"
      className={cn("navigation", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("nav-group", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sidebar-group-label"
      className={cn("nav-label", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu"
      className={cn("nav-menu", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-item"
      className={cn("nav-menu-item", className)}
      {...props}
    />
  );
}

function SidebarMenuButton({
  className,
  isActive = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  isActive?: boolean;
}) {
  const classes = cn("nav-item", isActive && "nav-item-active", className);

  if (
    asChild &&
    React.isValidElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>(children)
  ) {
    return React.cloneElement(children, {
      ...props,
      className: cn(classes, children.props.className),
    });
  }

  return (
    <a
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={classes}
      {...props}
    >
      {children}
    </a>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
};