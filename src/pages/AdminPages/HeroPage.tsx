import { useState } from "react";

import { toast } from "react-toastify";
import { useCreateHeroCarouselMutation, useDeleteHeroCarouselMutation, useGetAdminHeroCarouselQuery, useUpdateHeroCarouselMutation } from "../../features/heroapi";

const HeroAdmin = () => {
  const { data: slides = [], isLoading } =
    useGetAdminHeroCarouselQuery();

  const [createSlide, { isLoading: uploading }] =
    useCreateHeroCarouselMutation();

  const [deleteSlide, { isLoading: deleting }] =
    useDeleteHeroCarouselMutation();

  const [updateSlide] = useUpdateHeroCarouselMutation();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* IMAGE SELECT */
  const handleSelect = (file: File | null) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* UPLOAD */
  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("is_active", "true");

    try {
      await createSlide(formData).unwrap();
      toast.success("Slide uploaded successfully 🚀");
      setImage(null);
      setPreview(null);
    } catch (err) {
      toast.error("Upload failed ❌");
    }
  };

  /* TOGGLE */
  const toggleActive = async (slide: any) => {
    try {
      await updateSlide({
        id: slide.id,
        is_active: !slide.is_active,
      }).unwrap();

      toast.success("Slide updated");
    } catch {
      toast.error("Update failed");
    }
  };

  /* DELETE */
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this slide?")) return;

    try {
      await deleteSlide(id).unwrap();
      toast.success("Slide deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* LOADING STATE */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        <div className="animate-pulse grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Hero Carousel Manager
        </h1>

        <span className="text-sm text-slate-400">
          {slides.length} Slides
        </span>
      </div>

      {/* UPLOAD CARD */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mb-10">
        <h2 className="text-lg mb-4 font-semibold">
          Upload New Slide
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-center">

          {/* PREVIEW */}
          <div className="w-40 h-28 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">
                Preview
              </span>
            )}
          </div>

          {/* INPUT */}
          <div className="flex flex-col gap-3">
            <input
              type="file"
              onChange={(e) =>
                handleSelect(e.target.files?.[0] || null)
              }
              className="text-sm"
            />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Slide"}
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {slides.length === 0 && (
        <div className="text-center text-slate-400 py-20">
          No slides yet. Upload your first one 🚀
        </div>
      )}

      {/* SLIDES GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {slides.map((slide: any) => (
          <div
            key={slide.id}
            className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500 transition group"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={slide.image}
                className="w-full h-48 object-cover"
              />

              {/* STATUS */}
              <span
                className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full ${
                  slide.is_active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {slide.is_active ? "Active" : "Hidden"}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="p-4 flex justify-between items-center">
              <button
                onClick={() => toggleActive(slide)}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
              >
                {slide.is_active ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => handleDelete(slide.id)}
                disabled={deleting}
                className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAdmin;