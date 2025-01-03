/* eslint-disable react/no-unescaped-entities */
// app/components/ContactUsForm.jsx

"use client";

import { useState } from "react";
import { z } from "zod";
import { Client, Databases } from "appwrite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_ID;

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  PhoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  Message: z.string().min(50, "Message must be at least 50 characters"),
});

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    PhoneNo: "",
    Message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    PhoneNo: "",
    Message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const field = contactSchema.shape[name];
    const validation = field.safeParse(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validation.success ? "" : validation.error.issues[0].message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        name: validationErrors.name?._errors[0] || "",
        email: validationErrors.email?._errors[0] || "",
        PhoneNo: validationErrors.PhoneNo?._errors[0] || "",
        Message: validationErrors.Message?._errors[0] || "",
      });
      return;
    }

    setErrors({ name: "", email: "", PhoneNo: "", Message: "" });

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", formData);

      setFormData({ name: "", email: "", PhoneNo: "", Message: "" });
      toast.success("Your message has been Sent Successfully!", {
        hideProgressBar: true,
        closeOnClick: true,
        position: "top-center",
        theme: "dark",
        transition: "Slide",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.", {
        hideProgressBar: true,
        closeOnClick: true,
        position: "top-center",
        theme: "dark",
      });
    }
  };

  return (
    <div className="mx-auto grid max-w-xl items-start gap-8 p-4 font-[sans-serif]">
      <div className="sm:col-span-1">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full rounded-md border border-[#ccc] bg-[#f4f4f4] p-3 text-neutral-600"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full rounded-md border border-[#ccc] bg-[#f4f4f4] p-3 text-neutral-600"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="PhoneNo"
              value={formData.PhoneNo}
              onChange={handleChange}
              placeholder="Phone No."
              className="w-full rounded-md border border-[#ccc] bg-[#f4f4f4] p-3 text-neutral-600 shadow-lg"
            />
            {errors.PhoneNo && <p className="text-sm text-red-500">{errors.PhoneNo}</p>}
          </div>
          <div className="mb-4">
            <textarea
              name="Message"
              value={formData.Message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full rounded-md border border-[#ccc] bg-[#f4f4f4] p-3 text-neutral-600"
              rows="4"
            ></textarea>
            {errors.Message && <p className="text-sm text-red-500">{errors.Message}</p>}
          </div>
          <button
            type="submit"
            className="w-3/4 rounded-md bg-neutral-800 p-3 font-semibold text-white"
          >
            Send Message
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactUsForm;
