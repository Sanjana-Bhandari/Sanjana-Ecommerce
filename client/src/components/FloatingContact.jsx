import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { callLink, whatsappLink } from '../utils/helpers';

// Floating WhatsApp + Call buttons (bottom-right) so customers can ask price and talk to you.
export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-center gap-3">
      <motion.a
        href={callLink()}
        aria-label="Call us"
        title="Call us"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.4, type: 'spring' }}
        whileHover={{ scale: 1.12 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-xl text-white shadow-xl shadow-brand-500/40"
      >
        <FaPhoneAlt className="animate-wiggle" />
      </motion.a>
      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.12 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-3xl text-white shadow-xl shadow-[#25D366]/40"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <FaWhatsapp className="relative" />
      </motion.a>
    </div>
  );
}
