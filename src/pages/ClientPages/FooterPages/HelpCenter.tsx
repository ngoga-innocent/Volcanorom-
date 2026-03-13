import { useState } from "react";
import { Search, HelpCircle, CreditCard, Shield, Download } from "lucide-react";

const faqs = [
  {
    question: "How do I download purchased software?",
    answer:
      "After completing a purchase, the download link will be available in your dashboard under the 'My Purchases' section.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Volcanorom supports secure payments via approved payment providers including cryptocurrency and supported payment gateways.",
  },
  {
    question: "What should I do if my download fails?",
    answer:
      "You can retry downloading from your dashboard or contact our support team if the issue persists.",
  },
  {
    question: "How do I reset my account password?",
    answer:
      "Use the 'Forgot Password' option on the login page and follow the instructions sent to your email.",
  },
];

const HelpCenter = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen text-black">

      {/* HERO */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 py-20 text-white text-center">

        <h1 className="text-4xl font-bold mb-4">
          Help Center
        </h1>

        <p className="opacity-90 mb-8">
          Find answers, guides, and support resources for Volcanorom.
        </p>

        <div className="max-w-xl mx-auto flex bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search for help..."
            className="flex-1 p-3 text-black outline-none"
          />

          <button className="bg-blue-600 px-6 flex items-center justify-center">
            <Search />
          </button>
        </div>

      </section>

      {/* HELP CATEGORIES */}

      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-4 gap-8">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <HelpCircle className="mx-auto text-blue-600 mb-4"/>
          <h3 className="font-semibold mb-2">Getting Started</h3>
          <p className="text-gray-500 text-sm">
            Learn how to create an account and start using Volcanorom.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <CreditCard className="mx-auto text-blue-600 mb-4"/>
          <h3 className="font-semibold mb-2">Payments</h3>
          <p className="text-gray-500 text-sm">
            Information about billing, transactions, and payments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <Download className="mx-auto text-blue-600 mb-4"/>
          <h3 className="font-semibold mb-2">Downloads</h3>
          <p className="text-gray-500 text-sm">
            Learn how to access and download purchased software.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <Shield className="mx-auto text-blue-600 mb-4"/>
          <h3 className="font-semibold mb-2">Security</h3>
          <p className="text-gray-500 text-sm">
            Protect your account and keep your data safe.
          </p>
        </div>

      </section>

      {/* POPULAR ARTICLES */}

      <section className="max-w-5xl mx-auto px-6 pb-16">

        <h2 className="text-2xl font-bold mb-6">
          Popular Help Articles
        </h2>

        <div className="space-y-4">

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            How to purchase software on Volcanorom
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            Accessing your downloads after payment
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            Managing your account settings
          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="max-w-4xl mx-auto px-6 pb-20">

        <h2 className="text-2xl font-bold mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">

          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow">

              <button
                className="w-full text-left p-5 font-medium"
                onClick={() => setOpen(open === index ? null : index)}
              >
                {faq.question}
              </button>

              {open === index && (
                <p className="px-5 pb-5 text-gray-600">
                  {faq.answer}
                </p>
              )}

            </div>
          ))}

        </div>

      </section>

      {/* CONTACT SUPPORT */}

      <section className="bg-blue-600 text-white text-center py-16">

        <h2 className="text-3xl font-bold mb-4">
          Still Need Help?
        </h2>

        <p className="opacity-90 mb-6">
          Our support team is available to assist you.
        </p>

        <a
          href="/contact"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium"
        >
          Contact Support
        </a>

      </section>

    </div>
  );
};

export default HelpCenter;