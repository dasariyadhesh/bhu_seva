
"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";

export function Header() {
  const router = useRouter();
  const { user, firebaseUser, logout, loading, logo } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (nameOrEmail: string | null | undefined): string => {
    if (!nameOrEmail) return "U";
    const parts = nameOrEmail.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameOrEmail.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center sm:justify-between sm:space-x-0">
        <Link href="/home" className="flex items-center gap-4">
          {logo ? (
             <Image src={logo} alt="Logo" width={32} height={32} className="h-8 w-8 text-primary" />
          ) : (
            <Icons.logo className="h-8 w-8 text-primary" />
          )}
          <h1 className="font-headline text-xl font-bold md:text-2xl">
            Bhu Seva Public Charitable Trust
          </h1>
        </Link>
        
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => router.push('/home')}>Home</Button>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          {loading ? null : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={firebaseUser?.photoURL || ''} alt={user.email} data-ai-hint="user avatar" />
                    <AvatarFallback>{getInitials(firebaseUser?.displayName || user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{firebaseUser?.displayName || user.role}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/my-donations')}>My Donations</DropdownMenuItem>
                { (user.role === 'admin' || user.role === 'editor') && <DropdownMenuItem onClick={() => router.push('/admin')}>Admin</DropdownMenuItem> }
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
