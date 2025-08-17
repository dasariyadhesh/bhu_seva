
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { Mail, MapPin, Phone } from "lucide-react";

export function VisionStatement() {
  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Our Vision</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Annadhanam, Arogyam, Arivu & Aanmeegam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-lg text-foreground/80 leading-relaxed text-center max-w-4xl mx-auto">
        <p>
          Bhu Seva Public Charitable Trust is dedicated to fostering a society where every individual has access to essential needs and opportunities for growth. Our mission is built on four pillars: Annadhanam (Offering Food), Arogyam (Good Health), Arivu (Education), and Aanmeegam (Spirituality).
        </p>
        <p>
          We strive to eradicate hunger by providing nutritious meals, promote well-being through healthcare initiatives, empower communities with knowledge and skills, and nurture spiritual growth for inner peace and harmony. Through selfless service and community participation, we aim to create a compassionate and self-reliant society.
        </p>
        
        <Separator className="my-8" />

        <div className="text-center">
            <h2 className="font-headline text-3xl">Contact Us</h2>
            <p className="text-lg text-muted-foreground mt-2">
                We would love to hear from you.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 text-base">
            <div className="flex flex-col items-center gap-2">
            <MapPin className="w-10 h-10 text-primary" />
            <h3 className="font-semibold text-xl">Address</h3>
            <p className="text-muted-foreground">
                Bhu Seva Public Charitable Trust<br />
                123, Temple Road, Villupuram<br />
                Tamil Nadu, India - 605602
            </p>
            </div>
            <div className="flex flex-col items-center gap-2">
            <Phone className="w-10 h-10 text-primary" />
            <h3 className="font-semibold text-xl">Phone</h3>
            <p className="text-muted-foreground">
                +91 98765 43210
            </p>
            </div>
            <div className="flex flex-col items-center gap-2">
            <Mail className="w-10 h-10 text-primary" />
            <h3 className="font-semibold text-xl">Email</h3>
            <p className="text-muted-foreground">
                <a href="mailto:contact@bhusevatrust.org" className="hover:underline">
                contact@bhusevatrust.org
                </a>
            </p>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
