import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetSoftwareQuery } from "../../features/softwareApi";
import { useCreateOrderMutation } from "../../features/orderApi";
import { toast } from "react-toastify";
import {
  FiShoppingCart,
  FiClock,
  FiServer,
  FiSmartphone,
  FiUpload,
} from "react-icons/fi";

type ClientField = {
  name: string;
  type: "text" | "image";
};

const SoftwareDetails = () => {
  const { id } = useParams();
  const { data: software, isLoading } = useGetSoftwareQuery(id);
  const [createOrder, { isLoading: ordering }] = useCreateOrderMutation();
  console.log('tools',software);
  
  const [previewImage, setPreviewImage] = useState("");
  const [clientData, setClientData] = useState<any>({});
  const [clientFiles, setClientFiles] = useState<any>({});
  const [filePreview, setFilePreview] = useState<any>({}); // ✅ NEW

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  const images = [
    software.thumbnail,
    ...(software.images?.map((img: any) => img.image) || []),
  ];

  const currentPreview = previewImage || images[0];

  const handleTextChange = (field: string, value: string) => {
    setClientData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setClientFiles((prev: any) => ({ ...prev, [field]: file }));

    // ✅ CREATE PREVIEW
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreview((prev: any) => ({ ...prev, [field]: url }));
    }
  };

  const handleOrder = async () => {
    if (software.type === "tools") {
      for (const field of software.client_fields || []) {
        if (field.type === "text" && !clientData[field.name]) {
          toast.error(`Please enter ${field.name}`);
          return;
        }

        if (field.type === "image" && !clientFiles[field.name]) {
          toast.error(`Please upload ${field.name}`);
          return;
        }
      }
    }

    try {
      const formData = new FormData();

      formData.append("software", id as string);
      formData.append("price_paid", software.price_in_credits);

      Object.keys(clientData).forEach((key) => {
        formData.append(key, clientData[key]);
      });

      Object.keys(clientFiles).forEach((key) => {
        formData.append(key, clientFiles[key]);
      });

      await createOrder(formData).unwrap();
      toast.success("Order placed successfully");
    } catch (error: any) {
      // console.log(error);
      if (error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to place order");
      }
    }
  };

  const serviceIcon = () => {
    if (software.service === "imei") return <FiSmartphone />;
    if (software.service === "server") return <FiServer />;
    return <FiClock />;
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <img src={currentPreview} className="w-full rounded-lg" />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setPreviewImage(img)}
                  className="cursor-pointer rounded-lg border border-slate-700 hover:border-blue-500"
                />
              ))}
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-slate-400">{software.description}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
              <h1 className="text-2xl font-bold">{software.name}</h1>

              <div className="text-3xl font-bold text-blue-400">
                {software.price_in_credits} Credits
              </div>

              {software.type === "services" && (
                <>
                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
                    {serviceIcon()}
                    <span>{software.service} Service</span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
                    <FiClock />
                    <span>{software.duration}</span>
                  </div>
                </>
              )}
              

              {/* CLIENT FIELDS */}
              {(software.type === "tools" || software.type === "services") &&
                software.client_fields?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Required Information</h3>

                    {software.client_fields.map((field: ClientField) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm text-slate-400">
                          {field.name}
                        </label>
                        
                        {field.type === "text" && (
                          <input
                            placeholder={`Enter ${field.name}`}
                           
                            onChange={(e) =>
                              handleTextChange(field.name, e.target.value)
                            }
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:border-blue-500 outline-none"
                          />
                        )}

                        {field.type === "image" && (
                          <div className="space-y-2">
                            {/* PREVIEW */}
                            {filePreview[field.name] && (
                              <img
                                src={filePreview[field.name]}
                                className="w-full h-40 object-cover rounded-lg border border-slate-700"
                              />
                            )}

                            <div className="border border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-blue-500 transition">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(
                                    field.name,
                                    e.target.files?.[0] || null,
                                  )
                                }
                                className="hidden"
                                id={field.name}
                              />

                              <label
                                htmlFor={field.name}
                                className="cursor-pointer flex flex-col items-center gap-2"
                              >
                                <FiUpload size={20} />
                                <span className="text-sm">
                                  Upload {field.name}
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              <button
                onClick={handleOrder}
                disabled={ordering}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg flex justify-center gap-3 font-semibold"
              >
                <FiShoppingCart />
                {ordering ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareDetails;
