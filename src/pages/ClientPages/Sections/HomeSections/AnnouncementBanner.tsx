import { Megaphone } from "lucide-react";
import { useGetActiveAnnouncementQuery } from "../../../../features/auth/announcementApi";

export default function AnnouncementBanner() {
  // const [closed, setClosed] = useState(false);

  const { data, isLoading, error } = useGetActiveAnnouncementQuery();

  if (isLoading || error || !data) {
    return null;
  }

  return (
    <div className="sticky top-17 z-20 overflow-hidden border-b border-blue-400/20 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg backdrop-blur">
      <div className="relative flex items-center h-12">
        {/* LEFT LABEL */}
        <div className="flex items-center gap-2 px-4 md:px-6 h-full bg-black/10 border-r border-white/10 shrink-0 z-10">
          {/* PULSE DOT */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>

            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>

          <Megaphone size={16} />

          <span className="font-semibold text-xs md:text-sm uppercase tracking-wide">
            Announcement
          </span>
        </div>

        {/* SCROLLING TEXT */}
        <div className="flex-1 overflow-hidden relative">
          <div className="announcement-marquee whitespace-nowrap px-6">
            <span className="font-medium text-sm md:text-base mr-8">
              {data.title} —
            </span>

            <span className="text-blue-100 text-sm md:text-base">
              {data.message}
            </span>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        {/* <button
          onClick={() => setClosed(true)}
          className="h-full px-4 flex items-center justify-center hover:bg-white/10 transition shrink-0"
        >
          <X size={16} />
        </button> */}
      </div>
    </div>
  );
}
