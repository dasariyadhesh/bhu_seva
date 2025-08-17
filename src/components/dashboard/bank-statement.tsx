
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { UploadCloud } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function BankStatement() {
  const { user } = useAuth();

  // Only show this component to admins
  if (user?.role !== "admin") {
    return null;
  }

  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Icons.Admin className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-xl">Admin Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Manage financial records and user access. This section is restricted to authorized personnel.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Bank Statement
        </Button>
      </CardFooter>
    </Card>
  );
}
