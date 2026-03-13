import { useNavigate, useParams } from "react-router-dom";
import { useGetSoftwareQuery } from "../../features/softwareApi";
import { FiDownload, FiLock } from "react-icons/fi";
import { useGetProfileQuery } from "../../features/auth/authApi";
import url from "../../url";
import { toast } from "react-toastify";
import React from "react";

const SoftwareDetails = () => {
  const { id } = useParams();
  const [downloading,setDownloading]=React.useState(false)
const { data: software, isLoading } = useGetSoftwareQuery(id);
const {data:profileData}=useGetProfileQuery()
  const canDownload = profileData?.balance && profileData.balance >= software?.price_in_credits;
  const navigate=useNavigate()
  const handleDownload=async()=>{
    setDownloading(true)
    const token=localStorage.getItem("access")
    if(!token){
      alert("Login in To download the software")
      setDownloading(false)
      navigate('/login')
    }
    
    else{
      try {
        const res=await fetch(`${url}/api/wallet/checkdownload/`,{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method:"POST",
        body:JSON.stringify({
          'software_id':id
        })
        
      })
      if(!res.ok){
        setDownloading(false)
        if(res.status==402){
          toast.info('Insufficient Credits, please buy more credits to Download this Software')
        }
      }
      else{
        const data=await res.json()
        setDownloading(false)
        window.open(data.download_url, "_blank");
      }
      } catch (error:any) {
        console.log("error",error);
        toast.error('Error',error)
        setDownloading(false)
        
      }
    }

  }
if(isLoading){
  return(
    <div className="flex flex-col items-center justify-center text-white bg-slate-950 min-h-screen">
      Loading .....
    </div>
  )
}
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-14">

        {/* LEFT SIDE */}
        <div>

          <div className="bg-white/5 h-2/3 border border-white/10 rounded-xl p-2 flex items-center justify-center">

            <img
              src={software.thumbnail}
              className="h-full w-full object-cover rounded-xl"
            />

          </div>

          {/* Screenshots */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {software.images?.map(({id,image}:any)=>{
              return(
                <div key={id} className="bg-white/5 h-24 rounded-lg">
                  <img src={image} alt="" className="object-cover rounded-lg" />
                </div>
              )
            })}
            
            

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>

          <h1 className="text-3xl font-bold">
            {software.name}
          </h1>

          <p className="text-slate-400 mt-3">
            {software.description?.slice(0,100)}
          </p>

          {/* PRICE */}
          <div className="mt-6 text-3xl font-bold text-blue-400">
            {software.price_in_credits} Credits
          </div>

          {/* DOWNLOAD */}
          <div className="mt-6">

            {canDownload ? (
              <button disabled={downloading} onClick={()=>handleDownload()} className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700">
                <FiDownload />
                {downloading?"Downloading...":"Download Software"}
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg text-slate-400"
              >
                <FiLock />
                Not Enough Credits
              </button>
            )}

          </div>

          {/* FEATURES */}
          <div className="mt-10">

            <h3 className="font-semibold mb-4">
              Key Features
            </h3>

            <ul className="space-y-3 text-slate-400 text-sm">
              <li>⚡ Lightning fast performance</li>
              <li>🔐 Secure and reliable architecture</li>
              <li>🧠 AI powered automation</li>
              <li>⚙️ Developer friendly API</li>
            </ul>

          </div>

        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="max-w-4xl mx-auto px-6 pb-20">

        <h2 className="text-2xl font-bold mb-4">
          About this software
        </h2>

        <p className="text-slate-400 leading-relaxed">
          {software?.description}
        </p>

      </div>

    </div>
  );
};

export default SoftwareDetails;