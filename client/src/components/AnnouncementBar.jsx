import { siteConfig, FREE_SHIPPING_ABOVE } from '../config/siteConfig';
import { formatPrice } from '../utils/helpers';

// Scrolling announcement strip at the very top of the site.
export default function AnnouncementBar() {
  const messages = [
    `🚚 Free shipping above ${formatPrice(FREE_SHIPPING_ABOVE)}`,
    '💸 Cash on Delivery available',
    '✨ New arrivals every week',
    `💬 Ask price on WhatsApp: ${siteConfig.phoneDisplay}`,
    '🔁 Easy returns',
  ];
  const row = [...messages, ...messages];

  return (
    <div className="overflow-hidden bg-gradient-to-r from-brand-600 via-fuchsia-600 to-brand-600 py-2 text-xs font-medium text-white">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.concat(row).map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}
