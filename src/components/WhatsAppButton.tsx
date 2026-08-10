import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  /** Phone number in international format without '+' or spaces (e.g., "15551234567") */
  phoneNumber?: string;
  /** Pre-filled text message */
  message?: string;
  /** Text shown inside the button */
  buttonText?: string;
  /** Optional hover tooltip text displayed above the button */
  tooltipText?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '919216401935',
  message = 'Hello, I have an enquiry',
  buttonText = 'Chat Now',
  tooltipText = 'Chat with us',
}) => {
  const formattedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Hover Tooltip */}
      {tooltipText && (
        <span className="absolute right-0 -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-md">
          {tooltipText}
        </span>
      )}

      {/* Button with Icon + Text */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-[#25D366] group-hover:stroke-[#128C7E] transition-colors duration-300" />
        <span className="text-sm font-semibold tracking-wide">{buttonText}</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;