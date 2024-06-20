"use client";
import { FunctionComponent } from "react";

interface ContactUsProps {}

const ContactUs: FunctionComponent<ContactUsProps> = () => {
  function sendMail() {
    var link =
      "mailto:contact@llmminds.com" +
      "?subject=" +
      encodeURIComponent("Regarding llmminds UI Generator");
    window.location.href = link;
  }
  return (
    <div className="w-full h-full flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center">
          <img
            src="/suryababu.jpeg"
            alt="Developer Photo"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Suryababu</h2>
          <p className="text-gray-600 mb-2">Email: contact@llmminds.com</p>
          <a
            className="text-blue-500 mb-4"
            href="https://www.linkedin.com/in/suryababu-sakthivel"
            target="_blank"
          >
            LinkedIn
          </a>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendMail}
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
