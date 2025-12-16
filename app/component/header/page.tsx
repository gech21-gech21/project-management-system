"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const user = session?.user;
  const firstName = user?.name?.split(" ")[0];
  const role = user?.role;

  return (
    <header className="w-full bg-gray-800 text-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:text-amber-300">
          Project Management
        </Link>

        {/* Navigation */}
        <nav className="space-x-6">
          {user && (
            <Link href="/dashboard" className="hover:text-amber-300">
              Dashboard
            </Link>
          )}

          {role === "ADMIN" && (
            <Link href="/projects" className="hover:text-amber-300">
              Projects
            </Link>
          )}

          {(role === "ADMIN" || role === "TEAM_LEADER") && (
            <Link href="/teams" className="hover:text-amber-300">
              Teams
            </Link>
          )}

          {user && (
            <Link href="/tasks" className="hover:text-amber-300">
              Tasks
            </Link>
          )}

          {role === "ADMIN" && (
            <Link href="/reports" className="hover:text-amber-300">
              Reports
            </Link>
          )}
        </nav>

        {/* User area */}
        <div className="flex items-center space-x-4">
          {!user && (
            <button
              onClick={() => signIn("google")}
              className="hover:text-amber-300 font-medium"
            >
              Sign In
            </button>
          )}

          {user && (
            <>
              <span className="text-amber-300 font-medium">
                {firstName} ({role})
              </span>

              {role === "ADMIN" && (
                <Link href="/admin-dashboard" className="hover:text-amber-300">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => signOut()}
                className="hover:text-red-400 font-medium"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
