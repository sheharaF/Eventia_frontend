const StatsSection = () => {
  const stats = [
    {
      number: "1K+",
      label: "Vendors Available",
    },
    {
      number: "250+",
      label: "Events Planned",
    },
    {
      number: "2K+",
      label: "Trusted Customers",
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Your go-to platform for
              <br />
              <span style={{ color: 'hsl(var(--luxury-dark))' }}>stress-free event planning,</span>
              <br />
              all in one place!
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="stat-number">{stat.number}</div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;