
"use client";

import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Donation, DonationStatus } from "@/lib/donations";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MyDonationsPage() {
  const { user, donations, loading, firebaseUser } = useAuth();
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const userIdentifier = firebaseUser?.displayName || user.email;
      const filteredDonations = donations.filter(
        (donation) => donation.donorName === userIdentifier
      );
      setMyDonations(filteredDonations);
    }
  }, [donations, user, firebaseUser]);

  const statusColors: { [key in DonationStatus]: string } = {
    pending: "bg-yellow-500 text-yellow-900 border-yellow-600",
    successful: "bg-green-500 text-green-900 border-green-600",
    failed: "bg-red-500 text-red-900 border-red-600",
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">My Donations</CardTitle>
            <CardDescription>
              Here is a history of all your contributions. Thank you for your support!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myDonations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Amount (Rs.)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        {new Date(donation.date).toLocaleDateString()}
                      </TableCell>
                       <TableCell className="font-mono text-xs">{donation.transactionId}</TableCell>
                      <TableCell>{donation.purpose}</TableCell>
                      <TableCell className="text-right">
                        Rs.{donation.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={cn("text-xs capitalize", statusColors[donation.status])}
                        >
                          {donation.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                You have not made any donations yet.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
