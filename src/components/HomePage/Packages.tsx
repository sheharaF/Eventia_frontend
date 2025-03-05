import wedding from "../../assets/wedding.jpg";
import birthday from "../../assets/bday.jpg";
import corporate from "../../assets/corporate.jpg";
import { useNavigate } from "react-router-dom";

const Packages = () => {
  const packages = [
    { title: "Weddings", image: wedding, eventType: "Wedding" },
    { title: "Birthday Parties", image: birthday, eventType: "Birthday Party" },
    {
      title: "Corporate Events",
      image: corporate,
      eventType: "Corporate Event",
    },
  ];

  const navigate = useNavigate();

  // Navigate to package-results with the eventType as a query parameter
  const handleViewPackages = (eventType: string) => {
    navigate(`/package-results?eventType=${eventType}`);
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold">Popular Event Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-10 ml-10 mr-10">
        {packages.map((pkg, index) => (
          <div key={index} className="p-0 bg-white shadow-lg rounded-xl">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="rounded-tl-lg rounded-tr-lg"
            />
            <h3 className="mt-2 py-2 font-bold">{pkg.title}</h3>
            <button
              className="mt-4 mb-6 bg-yellow-500 px-4 py-2 rounded-lg"
              onClick={() => handleViewPackages(pkg.eventType)}
            >
              View Packages
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;
