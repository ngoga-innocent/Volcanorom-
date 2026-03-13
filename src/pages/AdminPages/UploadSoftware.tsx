import { useState } from "react";
// import { useDropzone } from "react-dropzone";
import { useCreateSoftwareMutation } from "../../features/softwareApi";

// interface UploadFile {
//   file: File;
//   progress: number;
// }

export default function UploadSoftware() {
  const [createSoftware, { isLoading }] = useCreateSoftwareMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [softwareFile, setSoftwareFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [type, setType] = useState("");
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {
      setSoftwareFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSoftwareFile(file);
    }
  };
  const removeFile = () => {
    setSoftwareFile(null);
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("price_in_credits", price);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    // ⭐ MAIN SOFTWARE FILE
    if (softwareFile) {
      formData.append("file", softwareFile);
    }

    try {
      await createSoftware(formData).unwrap();

      alert("Software uploaded successfully");
      window.location.reload();
      setName("");
      setDescription("");
      setPrice("");
      setType("");
      //   setFiles([]);
      setThumbnail(null);
      setSoftwareFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };
  return (
    <div className="p-10 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Upload Software</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div>
          {/* Drag area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 p-10 text-center rounded-lg"
          >
            <p className="text-gray-500">
              Drag and drop your software file here
            </p>

            <p className="text-sm text-gray-400 mt-2">.exe .zip .rar</p>

            <input
              type="file"
              id="softwareUpload"
              className="hidden"
              onChange={handleFileSelect}
            />

            <label
              htmlFor="softwareUpload"
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 inline-block cursor-pointer"
            >
              Browse Files
            </label>
          </div>
          {/* Software File */}
          <div className="mt-6">
            {/* <label className="block font-semibold mb-2">
              Software File (.exe, .zip, .rar)
            </label> */}

            {/* <input
              type="file"
              onChange={(e) => setSoftwareFile(e.target.files?.[0] || null)}
              className="border p-2 rounded-lg w-full"
            /> */}

            {softwareFile && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {softwareFile.name}
              </p>
            )}
          </div>
          {/* Thumbnail */}
          <div className="mt-6">
            <label className="block font-semibold mb-2">Thumbnail</label>

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* Form inputs */}
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Software name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg w-full "
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="tools">Tool</option>
              <option value="mdm files">Mdm File</option>
            </select>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 w-full rounded-lg"
            />

            <input
              type="number"
              placeholder="Price in credits"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 w-full rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {isLoading ? "Uploading..." : "Upload Software"}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Uploaded File</h2>

          {!softwareFile && <p className="text-gray-400">No file uploaded</p>}

          {softwareFile && (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{softwareFile.name}</p>

                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="w-full bg-gray-200 h-2 mt-3 rounded">
                {softwareFile && (
                  <div
                    className="bg-green-500 h-2 rounded transition-all"
                    style={{ width: `100%` }}
                  />
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">100%</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
