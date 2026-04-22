"use client";

import Link from "next/link";
import { Briefcase, LogOut } from "lucide-react"; // Import LogOut icon
import { Button } from "@/src/components/ui/button";
import { logoutUserAction } from "@/src/features/auth/server/auth.actions";

type userType = {
  id: number;
  session: {
    id: string;
    expiresAt: Date;
    userAgent: string;
    ip: string;
  };
  name: string;
  userName: string;
  role: "employer" | "admin" | "applicant";
  phoneNumber: string | null;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

type Props = {
  user: userType;
};

export default function Navbar({ user }: Props) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600"
        >
          <Briefcase className="w-6 h-6" />
          JobAdda
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">
            Find Job
          </Link>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Employers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link
                  href={
                    user.role === "employer"
                      ? "/employer-dashboard"
                      : "/dashboard/settings"
                  }
                >
                  Dashboard
                </Link>
              </Button>

              <form action={logoutUserAction}>
                <Button
                  variant="ghost"
                  type="submit"
                  size="icon"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
