"use client"

import { useState } from "react"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What agricultural products do you offer?",
      answer:
        "We offer a comprehensive range of agricultural products including high-quality seeds, organic fertilizers, modern farming equipment, pest control solutions, and irrigation systems. Our products are sourced from trusted suppliers and tested for quality.",
    },
    {
      question: "How can I get farming consultation services?",
      answer:
        "Our expert agricultural consultants are available for both on-site and virtual consultations. You can book a consultation through our platform, and our specialists will help you with crop planning, soil analysis, pest management, and sustainable farming practices.",
    },
    {
      question: "Do you provide weather monitoring services?",
      answer:
        "Yes, we offer advanced weather monitoring and forecasting services specifically designed for farmers. Our system provides real-time weather data, rainfall predictions, temperature alerts, and seasonal forecasts to help you make informed farming decisions.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, bank transfers, digital wallets, and we also offer flexible payment plans for bulk purchases. For large orders, we provide installment options to support your farming operations.",
    },
    {
      question: "How do you ensure product quality?",
      answer:
        "All our products undergo rigorous quality testing and certification processes. We work directly with certified manufacturers and conduct regular quality audits. Every product comes with a quality guarantee and our customer support team is available for any concerns.",
    },
    {
      question: "Do you offer delivery services?",
      answer:
        "Yes, we provide nationwide delivery services with tracking capabilities. For bulk orders and heavy equipment, we offer specialized logistics solutions. Delivery times vary by location, but we strive to deliver within 3-7 business days for most products.",
    },
  ]

  return (
    <section className="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-description">
            Find answers to common questions about our agricultural products and services. Can't find what you're
            looking for? Contact our support team.
          </p>
        </div>
        <div className="faq-content">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openFaq === index ? "active" : ""}`}>
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                {openFaq === index ? <LuChevronUp className="faq-icon" /> : <LuChevronDown className="faq-icon" />}
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
