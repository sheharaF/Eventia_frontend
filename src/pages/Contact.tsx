import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Mail, Phone } from "lucide-react";
import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          We’d love to hear from you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Get In Touch</CardTitle>
            <CardDescription>Reach us using the details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Head Office</p>
                  <p>Eventia Crafted Visions (Pvt) Ltd.</p>
                  <p>123, Lotus Road</p>
                  <p>Colombo 01, Sri Lanka</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Hotline</p>
                <p>+94 11 234 5678</p>
                <p>+94 77 123 4567</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p>hello@eventia.lk</p>
                <p>support@eventia.lk</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-1">Business Hours</p>
              <p className="text-muted-foreground">
                Mon–Fri: 9:00 AM – 6:00 PM
              </p>
              <p className="text-muted-foreground">Sat: 9:00 AM – 1:00 PM</p>
              <p className="text-muted-foreground">Sun & Poya: Closed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! This sample form does not submit.");
              }}
            >
              <Input placeholder="Your Name" required />
              <Input type="email" placeholder="Email Address" required />
              <Input placeholder="Phone (optional)" />
              <textarea
                className="form-select min-h-28 w-full"
                placeholder="How can we help?"
                required
              />
              <Button type="submit" className="w-full">
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Find Us</CardTitle>
            <CardDescription>Our Colombo head office</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=Colombo,Sri+Lanka&zoom=12&size=800x300&maptype=roadmap&markers=color:red%7CColombo,Sri+Lanka"
              alt="Map showing Colombo, Sri Lanka"
              className="w-full h-72 object-cover rounded"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop";
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
