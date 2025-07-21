import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does KirayaWale's peer-to-peer rental platform work in India?",
    answer: "KirayaWale is a P2P rental platform. Simply browse our rental listings for electronics, bikes, furniture, tools and more, or fill out our requirement form. We'll connect you directly with item owners across India through WhatsApp for easy communication and rental arrangements."
  },
  {
    question: "Is my information secure on the rental platform?",
    answer: "Yes, KirayaWale takes privacy seriously. Your information is only shared with relevant parties when you submit a rental request on our platform, and all communication happens through secure WhatsApp channels across India."
  },
  {
    question: "What types of items can I rent or lend on KirayaWale?",
    answer: "Almost anything! Electronics like cameras and laptops, bikes and vehicles, furniture for homes, tools for construction, musical instruments and more. Our peer-to-peer rental platform supports a wide variety of categories to meet diverse rental needs across India."
  },
  {
    question: "How are rental prices determined on the P2P platform?",
    answer: "Rental prices on KirayaWale are set by item owners based on market rates in India, item value, and rental duration. Our platform facilitates the connection between renters and lenders - pricing is negotiated between users."
  },
  {
    question: "What if there's a problem with a rental transaction in India?",
    answer: "We encourage clear communication between renters and lenders on our platform. For any disputes related to electronics, bikes, furniture, or tool rentals, you can contact KirayaWale's support team through WhatsApp, and we'll help mediate the situation."
  },
  {
    question: "How do I get started with the rental platform by Aryan Jha?",
    answer: "Getting started with KirayaWale is simple! Fill out our requirement form with your rental needs (electronics, bikes, furniture, tools, etc.) or items you'd like to lend across India. We'll connect you with interested parties through WhatsApp within 24 hours."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span> About the Rental Platform
            </h2>
            <p className="text-xl text-gray-600">
              Got questions about KirayaWale? Here are the most common questions about our peer-to-peer rental platform for electronics, bikes, furniture, and tools.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <article 
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div id={`faq-answer-${index}`} className="px-8 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;