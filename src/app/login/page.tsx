
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, user, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("admin@trusttrack.org");
  const [password, setPassword] = React.useState("adminpassword");

  React.useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
       toast({
        title: "Invalid Credentials",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
     return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/home">
          <Button variant="outline">
            Back to Home
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-headline">Welcome</CardTitle>
          <CardDescription>
            Sign in to Bhu Seva Trust account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@trusttrack.org" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                Sign In
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <Icons.google className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
