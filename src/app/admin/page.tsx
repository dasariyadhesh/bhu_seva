
"use client";

import { Header } from "@/components/header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-4">
            <Link href="/home">
                <Button variant="outline">
                    Back to Home
                </Button>
            </Link>
        </div>
        <AdminDashboard />
      </main>
    </div>
  );
}
