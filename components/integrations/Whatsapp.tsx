import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";

const WhatsAppButton = ({ phoneNumber, message }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if the user is on a mobile device after the component has mounted
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Construct the WhatsApp link based on the device type
  const waLink = isMobile
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 z-10 rounded-full bg-green-500 p-3 text-center font-bold text-white shadow-lg transition-colors duration-200 ease-in-out hover:bg-green-600"
      >
        <Icon icon="mdi:whatsapp" className="h-8 w-8" />
      </button>

      {isModalOpen && (
        <div className="fixed bottom-20 right-4 z-50 translate-y-0 transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-300">
          <div className="mb-4 flex items-center justify-between gap-12">
            <h2 className="text-xl font-semibold">PES Events</h2>
            <button
              onClick={closeModal}
              className="text-gray-700 hover:text-gray-900"
            >
              <Icon icon="lets-icons:close-ring-duotone" className="h-8 w-8 " />
            </button>
          </div>
          <div className="mb-4 rounded-lg bg-gray-100 p-4">
            <p className="text-gray-800">
              Hello 👋
              <br />
              How can we help you today?
            </p>
          </div>
          <a
            href={waLink}
            className="inline-flex items-center gap-4 rounded-lg bg-slate-200 px-4 py-2 text-green-500 no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Start Chat
            <Icon icon="mdi:send" className="h-8 w-8" />
          </a>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
