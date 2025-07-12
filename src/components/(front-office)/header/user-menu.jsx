"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleLogout } from "@/api/auth/api";
import { Separator } from "@/components/ui/separator";

export function UserMenu() {
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUsername(Cookies.get("username") || "");
    setMounted(true);
  }, []);

  function formatRole(role) {
    if (role === "CEO") {
      return "CEO";
    }
    if (role === "ADMIN_IT") {
      return "Admin IT";
    }

    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {mounted && username ? username.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {mounted && username && (
            <div className="px-2 py-1.5 text-sm font-medium">
              {formatRole(username)}
            </div>
          )}
          <Separator className="my-1" />
          <DropdownMenuItem onClick={handleLogout}>
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
