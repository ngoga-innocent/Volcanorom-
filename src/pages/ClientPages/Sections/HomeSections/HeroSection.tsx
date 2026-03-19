import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import img1 from "../../../../assets/softwares.webp";
import img2 from "../../../../assets/softwares.webp"; // replace with real images
import img3 from "../../../../assets/softwares.webp";
import { useGetHeroCarouselQuery } from "../../../../features/heroapi";

const Hero = () => {
  const images = [img1, img2, img3];
  const { data: slides = [] } = useGetHeroCarouselQuery();
  const [index, setIndex] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div>
          <span className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm">
            Trusted Software Marketplace
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-6">
            Discover & Download
            <span className="text-blue-400"> Powerful Software Tools</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Access premium developer tools, automation software, and productivity
            utilities. Purchase credits, unlock powerful software, and download
            instantly from a secure marketplace built for developers and tech teams.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/store"
              className="bg-blue-500 hover:bg-blue-600 transition px-7 py-3 rounded-lg font-semibold shadow-lg"
            >
              Browse Software
            </Link>

            <Link
              to="/deposit"
              className="border border-white/40 hover:bg-white hover:text-black transition px-7 py-3 rounded-lg"
            >
              Purchase Credits
            </Link>
          </div>

          {/* STATS */}
          <div className="flex gap-10 mt-12 text-gray-300 text-sm">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p>Software Tools</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">10k+</p>
              <p>Developers</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">Secure</p>
              <p>Downloads</p>
            </div>
          </div>
        </div>

        {/* RIGHT CAROUSEL */}
        <div className="relative w-full max-w-lg mx-auto">

          {/* BACKGROUND GLOW */}
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>

          {/* IMAGES */}
          <div className="relative h-[60vh] overflow-hidden rounded-xl">
            {slides.map((img, i) => (
              <img
                key={i}
                src={img.image}
                alt="carousel"
                className={`absolute w-full h-full object-cover rounded-xl transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === index ? "bg-blue-500" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;