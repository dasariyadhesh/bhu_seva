
"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/auth-context";

export function DonorBoard() {
  const { donations } = useAuth();
  const successfulDonations = donations.filter(d => d.status === 'successful');

  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg w-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Recent Donors</CardTitle>
        <CardDescription>A heartfelt thank you to our generous contributors.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          {successfulDonations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Donor</TableHead>
                  <TableHead className="text-right font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {successfulDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="font-medium">{donation.donorName}</div>
                      <div className="text-xs text-muted-foreground">{donation.purpose}</div>
                    </TableCell>
                    <TableCell className="text-right">
                       <Badge variant="outline" className="text-sm font-medium">
                          {new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              No successful donations yet.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
