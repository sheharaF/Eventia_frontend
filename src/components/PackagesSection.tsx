import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PackagesSection = () => {
  const navigate = useNavigate();

  const packages = [
    {
      title: "Weddings",
      eventType: "Wedding",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      description: "Create your perfect day with our comprehensive wedding packages",
    },
    {
      title: "Birthday Parties",
      eventType: "Birthday",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      description: "Celebrate in style with memorable birthday party arrangements",
    },
    {
      title: "Corporate Events",
      eventType: "Corporate",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      description: "Professional corporate events that leave lasting impressions",
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-12">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Popular Event Packages
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="card-luxury text-center space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold">{pkg.title}</h3>
                <p className="text-muted-foreground">{pkg.description}</p>
                <Button
                  className="btn-hero w-full"
                  onClick={() => navigate(`/packages?eventType=${encodeURIComponent(pkg.eventType)}`)}
                >
                  View Packages
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
