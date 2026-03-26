import { useState } from "react";
import { useCreateSoftwareMutation } from "../../features/softwareApi";
import {
  FaTools,
  FaPlus,
  FaTrash,
  FaMobileAlt,
  FaImage,
} from "react-icons/fa";

type ClientField = {
  name: string;
  type: "text" | "image";
};

export default function UploadSoftware() {

  const [createSoftware, { isLoading }] = useCreateSoftwareMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const [duration, setDuration] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [service, setService] = useState("");

  const [clientFields, setClientFields] = useState<ClientField[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "image">("text");

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const durations = [
    "2 Hours","4 Hours","6 Hours","12 Hours",
    "24 Hours","48 Hours","1 Week","1 Month",
    "3 Months","6 Months","12 Months",
  ];

  /*
  =========================
  ADD FIELD
  =========================
  */
  const addField = () => {

    if (!fieldName) return;

    setClientFields([
      ...clientFields,
      { name: fieldName, type: fieldType },
    ]);

    setFieldName("");
    setFieldType("text");

  };

  const removeField = (index: number) => {

    const updated = [...clientFields];
    updated.splice(index, 1);
    setClientFields(updated);

  };

  /*
  =========================
  SUBMIT
  =========================
  */
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (type === "tools" && !duration) {
      alert("Please select duration");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price_in_credits", price);
    formData.append("type", type);
    formData.append("service", service);

    if (type === "tools") {
      formData.append("duration", duration);
      formData.append("client_fields", JSON.stringify(clientFields));
    }
    if (type === "services") {
      formData.append("duration", duration);
      formData.append("client_fields", JSON.stringify(clientFields));
    }

    if (type === "mdm_files") {
      formData.append("download_link", downloadLink);
    }

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {

      await createSoftware(formData).unwrap();

      alert("Uploaded successfully");

      setName("");
      setDescription("");
      setPrice("");
      setType("");
      setDuration("");
      setDownloadLink("");
      setService("");
      setClientFields([]);
      setThumbnail(null);

    } catch {

      alert("Upload failed");

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 text-gray-700 p-6 md:p-10">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-8 space-y-6"
        >

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaTools /> Upload Tool / File
          </h1>

          <input
            placeholder="Software Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded w-full"
          />

          <textarea
            placeholder="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded w-full"
          />

          <select
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-3 rounded w-full"
          >
            <option value="">Select Type</option>
            <option value="tools">Tool</option>
            <option value="mdm_files">MDM File</option>
            <option value="services">Services</option>
          </select>

          {/* TOOL OPTIONS */}

          {type === "services" && (
            <>
              <select
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="border p-3 rounded w-full"
              >
                <option value="">Select Service</option>
                <option value="imei">IMEI Service</option>
                <option value="server">Server Service</option>
                <option value="remote">Remote Service</option>
              </select>

              <select
                value={duration}
                required
                onChange={(e) => setDuration(e.target.value)}
                className="border p-3 rounded w-full"
              >
                <option value="">Select Duration</option>
                {durations.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </>
          )}

          {/* PRICE */}

          <input
            type="number"
            placeholder="Price in credits"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded w-full"
          />

          {/* DOWNLOAD LINK */}

          {type === "mdm_files" && (
            <input
              placeholder="Download link"
              required
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
              className="border p-3 rounded w-full"
            />
          )}

          {/* CLIENT FIELDS */}

          {(type === "tools" || type==="services") && (
            <div className="bg-gray-50 border rounded-lg p-4 space-y-4">

              <h3 className="font-semibold flex items-center gap-2">
                <FaMobileAlt /> Client Required Fields
              </h3>

              {/* INPUT */}

              <div className="grid grid-cols-2 gap-2">

                <input
                  placeholder="Field name (IMEI)"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="border p-2 rounded"
                />

                <select
                  value={fieldType}
                  onChange={(e) =>
                    setFieldType(e.target.value as "text" | "image")
                  }
                  className="border p-2 rounded"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </select>

              </div>

              <button
                type="button"
                onClick={addField}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> Add Field
              </button>

              {/* LIST */}

              <div className="space-y-2">

                {clientFields.map((field, index) => (

                  <div
                    key={index}
                    className="flex justify-between items-center bg-white border p-2 rounded"
                  >
                    <div className="flex items-center gap-2">

                      {field.type === "image" ? <FaImage /> : "📝"}

                      <span>
                        {field.name} ({field.type})
                      </span>

                    </div>

                    <button
                      onClick={() => removeField(index)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* THUMBNAIL */}

          <input
            type="file"
            required
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
          />

          <button className="bg-blue-600 text-white py-3 rounded w-full">
            {isLoading ? "Uploading..." : "Upload"}
          </button>

        </form>

        {/* PREVIEW */}

        <div className="bg-white shadow-xl rounded-xl p-8 space-y-4">

          <h2 className="text-xl font-semibold">Preview</h2>

          <p><b>Name:</b> {name}</p>
          <p><b>Type:</b> {type}</p>
          <p><b>Price:</b> {price}</p>

          {(type === "tools" || type==='services') && (
            <>
              <p><b>Duration:</b> {duration}</p>
              <p><b>Service:</b> {service}</p>

              <div>
                <b>Client Fields:</b>

                {clientFields.map((f, i) => (
                  <div key={i}>
                    - {f.name} ({f.type})
                  </div>
                ))}
              </div>
            </>
          )}

          {thumbnail && (
            <img
              src={URL.createObjectURL(thumbnail)}
              className="rounded mt-4"
            />
          )}

        </div>

      </div>

    </div>
  );
}