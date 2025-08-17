
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Donation } from "@/lib/donations";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  purpose: string;
}

export function DonationDialog({ open, onOpenChange, amount, purpose }: DonationDialogProps) {
  const { firebaseUser, addDonation, verifyDonationUtr, qrCodeImage } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = React.useState(1);
  const [donorName, setDonorName] = React.useState(firebaseUser?.displayName || '');
  const [donationAmount, setDonationAmount] = React.useState(amount);
  const [panCard, setPanCard] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [utr, setUtr] = React.useState("");
  const [currentDonationId, setCurrentDonationId] = React.useState<number | null>(null);
  const [finalStatus, setFinalStatus] = React.useState<Donation['status'] | null>(null);

  React.useEffect(() => {
    if(open) {
        setStep(1);
        setDonationAmount(amount);
        setPanCard("");
        setMessage("");
        setUtr("");
        setCurrentDonationId(null);
        setFinalStatus(null);
    }
  }, [open, amount]);
  
  React.useEffect(() => {
    setDonorName(firebaseUser?.displayName || 'Anonymous');
  }, [firebaseUser]);

  const handleConfirm = () => {
    if (!donorName || donationAmount <= 0 || !panCard) {
        toast({
            title: "Invalid Input",
            description: "Please enter your name, a valid donation amount, and your PAN card number.",
            variant: "destructive"
        });
        return;
    }
    setStep(2);
  };
  
  const handlePaymentComplete = () => {
    if(!qrCodeImage) return;
    const newDonationId = addDonation({
        donorName: donorName,
        amount: donationAmount,
        purpose: purpose,
        panCard: panCard,
        message: message,
    });
    setCurrentDonationId(newDonationId);
    setStep(3);
  }

  const handleVerifyUtr = async () => {
    if (!utr || !currentDonationId) {
       toast({
            title: "UTR Required",
            description: "Please enter the UTR number from your payment app.",
            variant: "destructive"
        });
        return;
    }
    const status = await verifyDonationUtr(currentDonationId, utr);

    if (status === 'duplicate') {
        toast({
            title: "Transaction Already Processed",
            description: "This UTR number has already been used. We are awaiting confirmation.",
        });
        return;
    }

    setFinalStatus(status);
    setStep(4);
  }

  const handleClose = () => {
    onOpenChange(false);
  }

  const renderFinalScreen = () => {
      switch (finalStatus) {
          case 'successful':
              return (
                   <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500" />
                      <p className="text-lg font-medium">Donation Successful!</p>
                      <p className="text-muted-foreground">Thank you for your generous contribution. Your donation has been successfully verified and will now appear on our donor board.</p>
                  </div>
              );
          case 'pending':
               return (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <Clock className="w-16 h-16 text-yellow-500" />
                      <p className="text-lg font-medium">Your donation is pending.</p>
                      <p className="text-muted-foreground">We couldn't automatically verify your UTR. Our team will manually verify it within 5 minutes. Please check "My Donations" for status updates.</p>
                  </div>
              );
          case 'failed':
              return (
                   <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <XCircle className="w-16 h-16 text-red-500" />
                      <p className="text-lg font-medium">Verification Failed</p>
                      <p className="text-muted-foreground">We could not verify your payment. Your donation has been marked as failed. Please contact us if you believe this is an error.</p>
                  </div>
              )
          default:
              return null;
      }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
            <>
                <DialogHeader>
                <DialogTitle>Confirm Your Donation</DialogTitle>
                <DialogDescription>
                    Please confirm your details before proceeding to payment. Fields marked with * are mandatory.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name*</Label>
                        <Input id="name" value={donorName} onChange={(e) => setDonorName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount (Rs.)*</Label>
                        <Input id="amount" type="number" value={donationAmount} onChange={(e) => setDonationAmount(Number(e.target.value))} className="col-span-3" disabled={amount > 0} />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pan" className="text-right">PAN Card*</Label>
                        <Input id="pan" value={panCard} onChange={(e) => setPanCard(e.target.value)} className="col-span-3" placeholder="Enter PAN number" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">Message</Label>
                        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="col-span-3" placeholder="Optional message..." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Purpose</Label>
                        <p className="col-span-3 text-sm font-medium">{purpose}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleConfirm}>Proceed to Pay</Button>
                </DialogFooter>
            </>
        )}
        {step === 2 && (
            <>
                <DialogHeader>
                    <DialogTitle>Scan to Pay</DialogTitle>
                    <DialogDescription>
                        Use your favorite payment app to scan the QR code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                    {qrCodeImage ? (
                        <Image 
                            src={qrCodeImage}
                            alt="Payment QR Code" 
                            width={256} 
                            height={256} 
                            data-ai-hint="QR code"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4 bg-destructive/10 text-destructive rounded-md w-64 h-64">
                            <p className="font-bold">QR Code not available</p>
                            <p className="text-sm">Please contact an administrator.</p>
                        </div>
                    )}
                    <p className="font-bold text-lg">Amount: Rs.{donationAmount}</p>
                </div>
                 <DialogFooter>
                    <Button type="button" onClick={handlePaymentComplete} disabled={!qrCodeImage}>I have paid</Button>
                </DialogFooter>
            </>
        )}
        {step === 3 && (
             <>
                <DialogHeader>
                    <DialogTitle>Verify Your Payment</DialogTitle>
                     <DialogDescription>
                        Enter the UTR/Transaction ID from your payment app to complete the process.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="utr" className="text-right">UTR Number*</Label>
                        <Input id="utr" value={utr} onChange={(e) => setUtr(e.target.value.toUpperCase())} className="col-span-3" placeholder="Enter UTR here" />
                    </div>
                </div>
                 <DialogFooter>
                    <Button type="button" onClick={handleVerifyUtr}>Verify Payment</Button>
                </DialogFooter>
            </>
        )}
         {step === 4 && (
             <>
                <DialogHeader>
                    <DialogTitle>Donation Status</DialogTitle>
                </DialogHeader>
                {renderFinalScreen()}
                 <DialogFooter>
                    <Button type="button" onClick={handleClose}>Close</Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}

    