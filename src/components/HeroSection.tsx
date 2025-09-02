import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/api/axios";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeroSection = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<string>("");
  const [serviceCategory, setServiceCategory] = useState<string>("");
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  // Removed sign-in CTA; always show Plan Your Event
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [requiredServices, setRequiredServices] = useState<string[]>([]);
  const [optionalServices, setOptionalServices] = useState<string[]>([]);

  // no-op

  // Load event types
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/event-services");
        const list = res.data?.eventTypes || res.data || [];
        setEventTypes(list);
      } catch (e) {
        setEventTypes([]);
      }
    })();
  }, []);

  // Load required/optional services when eventType changes
  useEffect(() => {
    if (!eventType) {
      setRequiredServices([]);
      setOptionalServices([]);
      setServiceCategories([]);
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/api/event-services/${encodeURIComponent(eventType)}`);
        const req = res.data?.required || [];
        const opt = res.data?.optional || [];
        setRequiredServices(req);
        setOptionalServices(opt);
        // Preselect required, user can uncheck later
        setServiceCategories(req);
      } catch (e) {
        setRequiredServices([]);
        setOptionalServices([]);
      }
    })();
  }, [eventType]);

  const toTitle = (s: string) =>
    s
      ? s
          .split(/\s|-/)
          .filter(Boolean)
          .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : s;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (eventType) params.set("eventType", toTitle(eventType));
    const categories = serviceCategories.length
      ? serviceCategories
      : serviceCategory
      ? [serviceCategory]
      : [];
    if (categories.length) params.set("serviceCategory", categories.join(","));
    if (location) params.set("location", location);

    // Persist for checkout autofill
    const planDetails = {
      eventType: toTitle(eventType) || undefined,
      serviceCategory: categories.join(",") || undefined,
      location: location || undefined,
    };
    localStorage.setItem("planDetails", JSON.stringify(planDetails));

    navigate(`/services?${params.toString()}`);
  };

  return (
    <section
      className="relative py-20 lg:py-32"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Plan. Book.
                <br />
                <span style={{ color: "hsl(var(--primary))" }}>Celebrate.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Your hassle-free event planning hub, tailored to your budget and
                style!
              </p>
            </div>

            <Button
              className="btn-hero text-lg px-8 py-4"
              onClick={() => navigate("/plan-event")}
            >
              Plan Your Event
            </Button>

            {/* Search form moved below image */}
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ boxShadow: "var(--shadow-luxury)" }}
            >
              <img
                src="/assets/hero.jpg"
                alt="Elegant wedding celebration with sparklers and dancing"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Search Section below image */}
      <div className="w-full mt-8">
        <div
          className="bg-card rounded-none md:rounded-2xl p-6 shadow-lg border-0 mx-auto max-w-7xl"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="grid md:grid-cols-4 gap-4 items-start">
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.length
                  ? eventTypes.map((et) => (
                      <SelectItem key={et} value={et}>
                        {et}
                      </SelectItem>
                    ))
                  : ["Wedding", "Birthday", "Corporate", "Anniversary", "Other"].map(
                      (et) => (
                        <SelectItem key={et} value={et}>
                          {et}
                        </SelectItem>
                      )
                    )}
              </SelectContent>
            </Select>

            {/* Services multi-select dropdown with required/optional */}
            <div className="col-span-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {serviceCategories.length > 0
                      ? `${serviceCategories.length} service(s) selected`
                      : "Select Services"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Required</DropdownMenuLabel>
                  {requiredServices.length === 0 && (
                    <DropdownMenuCheckboxItem checked={false} disabled>
                      None
                    </DropdownMenuCheckboxItem>
                  )}
                  {requiredServices.map((name) => (
                    <DropdownMenuCheckboxItem
                      key={`req-${name}`}
                      checked={serviceCategories.includes(name)}
                      onCheckedChange={(checked) => {
                        setServiceCategories((prev) =>
                          checked
                            ? Array.from(new Set([...prev, name]))
                            : prev.filter((n) => n !== name)
                        );
                      }}
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
                      checked={serviceCategories.includes(name)}
                      onCheckedChange={(checked) => {
                        setServiceCategories((prev) =>
                          checked
                            ? Array.from(new Set([...prev, name]))
                            : prev.filter((n) => n !== name)
                        );
                      }}
                    >
                      {name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Enter Location"
                className="form-select pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="btn-hero" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
