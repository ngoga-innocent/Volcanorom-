
import SoftwareStore from "./Sections/HomeSections/SoftwareListing";
// import HowItWorks from "./Sections/HomeSections/HowItWorks";
// import WhyChooseUs from "./Sections/HomeSections/WhyChooseUs";
import CTA from "./Sections/HomeSections/CTA";
import Hero from "./Sections/HomeSections/HeroSection";
// import Stats from "./Sections/HomeSections/Stats";
// import FeaturedTools from "./Sections/HomeSections/FeaturedTool";

const Home = () => {
  return (
    <div className="bg-gray-50 text-black">

      <Hero />

      {/* <Stats /> */}

      {/* <FeaturedTools /> */}

      <SoftwareStore  />

      {/* <HowItWorks /> */}

      {/* <WhyChooseUs /> */}

      <CTA />

    </div>
  );
};

export default Home;