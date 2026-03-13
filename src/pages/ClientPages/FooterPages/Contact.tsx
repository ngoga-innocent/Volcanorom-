import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useLoader } from "../../../app/LoaderContext";
import { toast } from "react-toastify";
import url from "../../../url";

const Contact = () => {
    const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [subject, setSubject] = useState("")
const [content, setContent] = useState("")
// const [message,setMessage]=useState("")
const { showLoader, hideLoader } = useLoader()

const SendEmail = async () => {

    if (!name || !email || !subject || !content) {
        toast.info("All fields are required!")
        return
    }

    try {

        showLoader()

        const res = await fetch(`${url}/api/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: content
            })
        })

        const data = await res.json()
        console.log(data)
        if (res.ok) {
            toast.success("Message sent successfully!")

            setName("")
            setEmail("")
            setSubject("")
            setContent("")
        } else {
            toast.error(data.error || "Something went wrong")
        }

    } catch (error) {
        toast.error("Network error. Please try again.")
    } finally {
        hideLoader()
    }
}
  return (
    <div className="bg-gray-50 min-h-screen text-black">

      {/* HERO */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Contact Volcanorom
        </h1>

        <p className="opacity-90 max-w-2xl mx-auto">
          Our team is here to help. Reach out for support, partnerships,
          or general inquiries.
        </p>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
          <Mail className="mx-auto mb-4 text-blue-600" size={32}/>
          <h3 className="font-semibold text-lg mb-2">Email Support</h3>
          <p className="text-gray-500 text-sm mb-3">
            For technical help and account issues
          </p>
          <p className="font-medium">support@volcanorom.com</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
          <Phone className="mx-auto mb-4 text-blue-600" size={32}/>
          <h3 className="font-semibold text-lg mb-2">Sales</h3>
          <p className="text-gray-500 text-sm mb-3">
            For business partnerships
          </p>
          <p className="font-medium">info@volcanorom.com</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center">
          <MapPin className="mx-auto mb-4 text-blue-600" size={32}/>
          <h3 className="font-semibold text-lg mb-2">Office</h3>
          <p className="text-gray-500 text-sm">
            Bujumbura Innovation City
          </p>
          <p className="font-medium">Burundi, Bujumbura</p>
        </div>

      </section>

      {/* CONTACT FORM */}
      <section className="max-w-3xl mx-auto px-6 pb-20">

        <div className="bg-white p-10 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-6">
            Send us a message
          </h2>

          <form className="space-y-5">

            <input
              type="text"
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              required
              value={subject}
              onChange={(e)=>setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              rows={5}
              required
              placeholder="Message"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <button onClick={()=>SendEmail()} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Send Message
            </button>

          </form>

        </div>

      </section>

    </div>
  );
};

export default Contact;