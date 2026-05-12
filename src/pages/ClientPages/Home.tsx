import SoftwareStore from "./Sections/HomeSections/SoftwareListing";
// import HowItWorks from "./Sections/HomeSections/HowItWorks";
// import WhyChooseUs from "./Sections/HomeSections/WhyChooseUs";
import CTA from "./Sections/HomeSections/CTA";
import Hero from "./Sections/HomeSections/HeroSection";
import AnnouncementBanner from "./Sections/HomeSections/AnnouncementBanner";
import { useEffect, useState } from "react";
import NotificationModal from "./Sections/HomeSections/AnnouncementsModal";
import { useGetAnnouncementsQuery } from "../../features/auth/announcementApi";
// import Stats from "./Sections/HomeSections/Stats";
// import FeaturedTools from "./Sections/HomeSections/FeaturedTool";

const Home = () => {
  const [openNotifications, setOpenNotifications] = useState(false);
  useEffect(() => {
    const alreadyOpened = sessionStorage.getItem("notification_modal_opened");

    if (!alreadyOpened) {
      setOpenNotifications(true);

      sessionStorage.setItem("notification_modal_opened", "true");
    }
  }, []);
  const { data: notifications, isLoading, error } = useGetAnnouncementsQuery();
  return (
    <div className="bg-gray-50 text-black">
      <AnnouncementBanner />
      <button
        onClick={() => setOpenNotifications(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl shadow-xl"
      >
        🔔 Notifications
      </button>

      {/* Modal */}
      <NotificationModal
        isOpen={openNotifications}
        onClose={() => setOpenNotifications(false)}
        isLoading={isLoading}
        error={error}
        notifications={notifications}
      />
      <Hero />

      {/* <Stats /> */}

      {/* <FeaturedTools /> */}

      <SoftwareStore />

      {/* <HowItWorks /> */}

      {/* <WhyChooseUs /> */}

      <CTA />
    </div>
  );
};

export default Home;
