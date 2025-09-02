import { FileText, CheckCircle, DollarSign, Calendar } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Expert Planning",
      description: "Tailored recommendations to fit your vision.",
    },
    {
      icon: CheckCircle,
      title: "Verified Vendors",
      description: "Only top-rated, trusted professionals.",
    },
    {
      icon: DollarSign,
      title: "Budget-Friendly",
      description: "Plans that fit your budget, big or small.",
    },
    {
      icon: Calendar,
      title: "Seamless Booking",
      description: "One-click event management, stress-free.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-12">
          <h2 className="text-4xl lg:text-5xl font-bold">Why Choose Eventia</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center space-y-4">
                <div className="flex justify-center">
                  <feature.icon
                    className="w-12 h-12"
                    style={{ color: "hsl(var(--primary))" }}
                  />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
