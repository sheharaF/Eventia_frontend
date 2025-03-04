const Features = () => {
  const features = [
    {
      icon: "ri-file-list-2-fill",
      title: "Expert Planning",
      description: "Tailored recommendations to fit your vision.",
    },
    {
      icon: "ri-verified-badge-fill",
      title: "Verified Vendors",
      description: "Only top-rated, trusted professionals.",
    },
    {
      icon: "ri-money-dollar-circle-fill",
      title: "Budget-Friendly",
      description: "Plans that fit your budget, big or small.",
    },
    {
      icon: "ri-calendar-check-fill",
      title: "Seamless Booking",
      description: "One-click event management, stress-free.",
    },
  ];

  return (
    <div className="py-12">
      <h2 className="text-center text-3xl font-bold mb-10">
        Why Choose Eventia
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 ml-8 mr-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 bg-[#3F2E20] text-white shadow-lg rounded-xl transition-transform transform hover:scale-105"
          >
            <i className={feature.icon + " text-5xl mt-3 mb-3"}></i>
            <h3 className="font-bold mt-3 mb-3">{feature.title}</h3>
            <p className="text-sm mt-3 mb-3">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
