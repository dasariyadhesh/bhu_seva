
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  budgetReallocationSuggestions,
  BudgetReallocationInput,
} from "@/ai/flows/budget-reallocation-suggestions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  arulneriThavachchalaiContributions: z.coerce.number().min(0),
  bhusevaNithyaAnnadhanamContributions: z.coerce.number().min(0),
  saplingsDistributionsContributions: z.coerce.number().min(0),
  otherSocialNeedsContributions: z.coerce.number().min(0),
  arulneriThavachchalaiExpenses: z.coerce.number().min(0),
  bhusevaNithyaAnnadhanamExpenses: z.coerce.number().min(0),
  saplingsDistributionsExpenses: z.coerce.number().min(0),
  otherSocialNeedsExpenses: z.coerce.number().min(0),
});

const defaultValues = {
    arulneriThavachchalaiContributions: 25000,
    bhusevaNithyaAnnadhanamContributions: 75000,
    saplingsDistributionsContributions: 15000,
    otherSocialNeedsContributions: 20000,
    arulneriThavachchalaiExpenses: 30000,
    bhusevaNithyaAnnadhanamExpenses: 60000,
    saplingsDistributionsExpenses: 10000,
    otherSocialNeedsExpenses: 25000,
}

export function AiReporter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const response = await budgetReallocationSuggestions(values);
      setResult(response.suggestions);
    } catch (error) {
      console.error("Error generating report:", error);
      setResult("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Wand2 className="text-primary" />
              AI Budget Reallocation Report
            </CardTitle>
            <CardDescription>
              Enter monthly contributions and expenses to get AI-powered suggestions for budget optimization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-semibold font-headline">Contributions (Rs.)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="arulneriThavachchalaiContributions" render={({ field }) => (
                    <FormItem><FormLabel>Arulneri Thavachchalai</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="bhusevaNithyaAnnadhanamContributions" render={({ field }) => (
                    <FormItem><FormLabel>Bhuseva Annadhanam</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="saplingsDistributionsContributions" render={({ field }) => (
                    <FormItem><FormLabel>Saplings Distributions</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="otherSocialNeedsContributions" render={({ field }) => (
                    <FormItem><FormLabel>Other Social Needs</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-semibold font-headline">Expenses (Rs.)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="arulneriThavachchalaiExpenses" render={({ field }) => (
                    <FormItem><FormLabel>Arulneri Thavachchalai</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="bhusevaNithyaAnnadhanamExpenses" render={({ field }) => (
                    <FormItem><FormLabel>Bhuseva Annadhanam</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="saplingsDistributionsExpenses" render={({ field }) => (
                    <FormItem><FormLabel>Saplings Distributions</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="otherSocialNeedsExpenses" render={({ field }) => (
                    <FormItem><FormLabel>Other Social Needs</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>
            </div>
            
            {loading && (
              <div className="space-y-4 pt-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
              </div>
            )}

            {result && !loading && (
              <Card className="bg-background/50">
                <CardHeader>
                  <CardTitle className="font-headline text-lg">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{result}</p>
                </CardContent>
              </Card>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
