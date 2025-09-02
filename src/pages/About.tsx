import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            About <span style={{ color: "hsl(var(--primary))" }}>Eventia</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Eventia is your hassle-free event planning hub — connecting you with
            trusted vendors and curated event packages, tailored to your budget
            and style. Whether it’s a wedding, birthday, or corporate gathering,
            we make planning seamless so you can focus on celebrating.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-10">
          <Card
            className="rounded-2xl shadow-lg border-0"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To simplify event planning by offering a one-stop platform where
                users can explore, compare, and book top-rated vendors with
                confidence. We aim to deliver elegance and ease to every
                occasion.
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-2xl shadow-lg border-0"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-semibold">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading luxury event planning platform across the
                globe, bringing together creativity, professionalism, and
                technology to craft unforgettable experiences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20 grid lg:grid-cols-3 gap-8">
          <Card className="rounded-2xl shadow-md border-0 hover:shadow-xl transition">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">Verified Vendors</h3>
              <p className="text-muted-foreground">
                Work only with trusted and verified professionals for your
                events.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-0 hover:shadow-xl transition">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">Tailored Packages</h3>
              <p className="text-muted-foreground">
                Get personalized recommendations and packages that fit your
                budget and style.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-0 hover:shadow-xl transition">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">One-Stop Solution</h3>
              <p className="text-muted-foreground">
                Plan, book, and celebrate — all from a single platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
