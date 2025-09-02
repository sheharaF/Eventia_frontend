import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PlanEvent = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    eventType: "",
    budget: "",
    guests: "",
    location: "",
    additionalRequirements: "",
  });
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [requiredServices, setRequiredServices] = useState<string[]>([]);
  const [optionalServices, setOptionalServices] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const navigate = useNavigate();

  const toTitle = (s: string) =>
    s
      ? s
          .split(/\s|-/)
          .filter(Boolean)
          .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : s;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventType = toTitle(formData.eventType);
    const params = new URLSearchParams();
    if (eventType) params.set("eventType", eventType);
    if (selectedServices.length) params.set("serviceCategory", selectedServices.join(","));
    if (formData.location) params.set("location", formData.location);
    // Save for checkout prefill
    localStorage.setItem(
      "planDetails",
      JSON.stringify({ eventType, serviceCategory: selectedServices.join(","), location: formData.location })
    );
    navigate(`/services?${params.toString()}`);
  };

  // Load event types
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/event-services");
        const list = res.data?.eventTypes || res.data || [];
        setEventTypes(list);
      } catch {
        setEventTypes([]);
      }
    })();
  }, []);

  // Load required/optional services when eventType changes
  useEffect(() => {
    if (!formData.eventType) {
      setRequiredServices([]);
      setOptionalServices([]);
      setSelectedServices([]);
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/api/event-services/${encodeURIComponent(toTitle(formData.eventType))}`);
        const req = res.data?.required || [];
        const opt = res.data?.optional || [];
        setRequiredServices(req);
        setOptionalServices(opt);
        setSelectedServices(req); // preselect required
      } catch {
        setRequiredServices([]);
        setOptionalServices([]);
      }
    })();
  }, [formData.eventType]);

  return (
    <div className="min-h-screen flex flex-col">
      <main
        className="flex-1 py-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Plan Your Perfect Event
              </h1>
              <p className="text-xl text-muted-foreground">
                Tell us about your event and we'll recommend the best vendors
                and packages
              </p>
            </div>

            <Card className="card-luxury">
              <CardHeader>
                <CardTitle className="text-2xl">Event Details</CardTitle>
                <CardDescription>
                  Provide information about your event to get personalized
                  recommendations
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select
                        value={formData.eventType}
                        onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                      >
                        <SelectTrigger className="form-select">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.length
                            ? eventTypes.map((et) => (
                                <SelectItem key={et} value={et}>
                                  {et}
                                </SelectItem>
                              ))
                            : ["Wedding", "Birthday", "Corporate", "Anniversary", "Other"].map((et) => (
                                <SelectItem key={et} value={et}>
                                  {et}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="form-select justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Services selection */}
                  <div className="space-y-2">
                    <Label>Services</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                          disabled={!formData.eventType}
                        >
                          {selectedServices.length > 0
                            ? `${selectedServices.length} selected`
                            : formData.eventType
                            ? "Select services"
                            : "Select event type first"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72">
                        <DropdownMenuLabel>Required</DropdownMenuLabel>
                        {requiredServices.length === 0 && (
                          <DropdownMenuCheckboxItem checked={false} disabled>
                            None
                          </DropdownMenuCheckboxItem>
                        )}
                        {requiredServices.map((name) => (
                          <DropdownMenuCheckboxItem
                            key={`req-${name}`}
                            checked={selectedServices.includes(name)}
                            onCheckedChange={(checked) =>
                              setSelectedServices((prev) =>
                                checked
                                  ? Array.from(new Set([...prev, name]))
                                  : prev.filter((n) => n !== name)
                              )
                            }
                          >
                            {name}
                          </DropdownMenuCheckboxItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Optional</DropdownMenuLabel>
                        {optionalServices.length === 0 && (
                          <DropdownMenuCheckboxItem checked={false} disabled>
                            None
                          </DropdownMenuCheckboxItem>
                        )}
                        {optionalServices.map((name) => (
                          <DropdownMenuCheckboxItem
                            key={`opt-${name}`}
                            checked={selectedServices.includes(name)}
                            onCheckedChange={(checked) =>
                              setSelectedServices((prev) =>
                                checked
                                  ? Array.from(new Set([...prev, name]))
                                  : prev.filter((n) => n !== name)
                              )
                            }
                          >
                            {name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range (LKR)</Label>
                      <div className="relative">
                        <Select
                          value={formData.budget}
                          onValueChange={(value) =>
                            setFormData({ ...formData, budget: value })
                          }
                        >
                          <SelectTrigger className="form-select pl-10">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1000-5000">
                              LKR 1,000 - LKR 5,000
                            </SelectItem>
                            <SelectItem value="5000-10000">
                              LKR 5,000 - LKR 10,000
                            </SelectItem>
                            <SelectItem value="10000-20000">
                              LKR 10,000 - LKR 20,000
                            </SelectItem>
                            <SelectItem value="20000-50000">
                              LKR 20,000 - LKR 50,000
                            </SelectItem>
                            <SelectItem value="50000+">LKR 50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Select
                          value={formData.guests}
                          onValueChange={(value) =>
                            setFormData({ ...formData, guests: value })
                          }
                        >
                          <SelectTrigger className="form-select pl-10">
                            <SelectValue placeholder="Select guest count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-25">1 - 25 guests</SelectItem>
                            <SelectItem value="26-50">
                              26 - 50 guests
                            </SelectItem>
                            <SelectItem value="51-100">
                              51 - 100 guests
                            </SelectItem>
                            <SelectItem value="101-200">
                              101 - 200 guests
                            </SelectItem>
                            <SelectItem value="201-500">
                              201 - 500 guests
                            </SelectItem>
                            <SelectItem value="500+">500+ guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="location"
                        placeholder="Enter city, venue, or area"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="form-select pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">
                      Additional Requirements (Optional)
                    </Label>
                    <textarea
                      id="requirements"
                      placeholder="Tell us about any specific requirements, themes, or preferences..."
                      value={formData.additionalRequirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalRequirements: e.target.value,
                        })
                      }
                      className="form-select min-h-24 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      className="btn-hero px-12 py-3 text-lg"
                    >
                      Get Recommendations
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanEvent;
