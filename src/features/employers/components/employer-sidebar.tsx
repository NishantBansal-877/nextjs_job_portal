"use client";

import { logoutUserAction } from "@/src/features/auth/server/auth.actions";
import { isActiveLink } from "@/src/lib/navigation.utils";
import { cn } from "@/src/lib/utils";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { employerNavItems } from "@/src/config/constant";

const EmployerSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card border-r border-border fixed bottom-0 top-0">
      <div className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Employer Dashboard
        </h2>
      </div>

      <nav className="px-3 space-y-1">
        {employerNavItems.map((item) => {
          const Icon = item.icon;
          // Using your existing robust utility function! No URLPattern needed.
          const active = isActiveLink(pathname, item.href, item.exact);

          return (
            <Link
              key={item.name}
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-3 right-3">
        <button
          onClick={logoutUserAction}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Log-out
        </button>
      </div>
    </div>
  );
};

export default EmployerSidebar;
