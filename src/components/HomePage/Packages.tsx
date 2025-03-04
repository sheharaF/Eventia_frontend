import wedding from "../../assets/wedding.jpg";
import birthday from "../../assets/bday.jpg";
import corporate from "../../assets/corporate.jpg";

const Packages = () => {
  const packages = [
    { title: "Weddings", image: wedding },
    { title: "Birthday Parties", image: birthday },
    { title: "Corporate Events", image: corporate },
  ];

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
            <h3 className="mt-2 font-bold">{pkg.title}</h3>
            <button className="mt-4 mb-6 bg-yellow-500 px-4 py-2 rounded-lg">
              See Vendors
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;
