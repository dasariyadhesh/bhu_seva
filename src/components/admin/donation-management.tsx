
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
import { useAuth } from "@/context/auth-context";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Donation, DonationStatus } from "@/lib/donations";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { MessageSquare, ArrowUpDown, FileText, Calendar as CalendarIcon, Download } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { format, endOfDay } from "date-fns";
import * as XLSX from "xlsx";

type SortableKeys = 'date' | 'amount' | 'status';

export function DonationManagement() {
  const { donations, updateDonationStatus } = useAuth();
  const { toast } = useToast();
  
  // State for sorting
  const [sortConfig, setSortConfig] = React.useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });
  
  // State for filters
  const [donorNameFilter, setDonorNameFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<DonationStatus | "all">("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const filteredAndSortedDonations = React.useMemo(() => {
    let filteredItems = [...donations];

    // Apply donor name filter
    if (donorNameFilter) {
      filteredItems = filteredItems.filter(d => d.donorName.toLowerCase().includes(donorNameFilter.toLowerCase()));
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filteredItems = filteredItems.filter(d => d.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange?.from) {
        const fromDate = dateRange.from;
        const toDate = dateRange.to ? endOfDay(dateRange.to) : undefined;
        
        filteredItems = filteredItems.filter(d => {
            const donationDate = new Date(d.date);
            if (toDate) {
                return donationDate >= fromDate && donationDate <= toDate;
            }
            // If only 'from' is selected, filter from that day onwards
            return donationDate >= fromDate;
        });
    }

    // Apply sorting
    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredItems;
  }, [donations, sortConfig, donorNameFilter, statusFilter, dateRange]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };
  
  const handleGenerate10BE = (donation: Donation) => {
    toast({
        title: "Generating 10BE Certificate",
        description: `Certificate for ${donation.donorName} (PAN: ${donation.panCard}) is being prepared.`,
    })
  }

  const handleExportToExcel = () => {
    const dataToExport = filteredAndSortedDonations.map(d => ({
        "Transaction ID": d.transactionId,
        "Date": format(new Date(d.date), "yyyy-MM-dd"),
        "Donor Name": d.donorName,
        "PAN Card": d.panCard,
        "Purpose": d.purpose,
        "Credit (Rs.)": d.amount,
        "Status": d.status,
        "UTR": d.utr,
        "Message": d.message,
    }));

    const worksheet = (XLSX.utils as any).json_to_sheet(dataToExport);
    const workbook = (XLSX.utils as any).book_new();
    (XLSX.utils as any).book_append_sheet(workbook, worksheet, "Donations");
    XLSX.writeFile(workbook, "Donation_Report.xlsx");
  }

  const statusColors: { [key in DonationStatus]: string } = {
    pending: "bg-yellow-500 hover:bg-yellow-600",
    successful: "bg-green-500 hover:bg-green-600",
    failed: "bg-red-500 hover:bg-red-600",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
                <CardTitle>Donation Management</CardTitle>
                <CardDescription>
                Review and approve incoming donations. Use filters to refine the list.
                </CardDescription>
            </div>
            <Button onClick={handleExportToExcel} disabled={filteredAndSortedDonations.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
            </Button>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row flex-wrap items-center gap-2">
            <Input 
                placeholder="Filter by donor name..."
                value={donorNameFilter}
                onChange={(e) => setDonorNameFilter(e.target.value)}
                className="w-full sm:w-auto sm:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DonationStatus | "all")}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date range</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={() => {
                setDonorNameFilter("");
                setStatusFilter("all");
                setDateRange(undefined);
            }}>Clear Filters</Button>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead>Transaction ID</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('date')}>
                        Date
                        {getSortIndicator('date')}
                    </Button>
                </TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('amount')}>
                        Amount (Rs.)
                        {getSortIndicator('amount')}
                    </Button>
                </TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>PAN Card</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('status')}>
                       Status
                       {getSortIndicator('status')}
                    </Button>
                </TableHead>
                <TableHead>10BE Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-mono text-xs">{donation.transactionId}</TableCell>
                  <TableCell>
                    {new Date(donation.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{donation.donorName}</TableCell>
                  <TableCell>Rs.{donation.amount.toLocaleString()}</TableCell>
                  <TableCell>{donation.purpose}</TableCell>
                  <TableCell>{donation.panCard}</TableCell>
                  <TableCell>
                    {donation.message && (
                      <Tooltip>
                        <TooltipTrigger>
                          <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{donation.message}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={donation.status}
                      onValueChange={(value) =>
                        handleStatusChange(donation.id, value as DonationStatus)
                      }
                    >
                      <SelectTrigger className={cn("w-[140px] text-white border-0", statusColors[donation.status])}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {donation.status === 'successful' && (
                        <Button variant="outline" size="sm" onClick={() => handleGenerate10BE(donation)}>
                           <FileText className="mr-2 h-4 w-4" />
                           Generate
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );

    function handleStatusChange(donationId: number, newStatus: DonationStatus) {
        updateDonationStatus(donationId, newStatus);
    }
}

    