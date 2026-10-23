import { useState } from 'react';
import { categories } from '../config/constants';

// Shows the product photo; if there is no photo (or it fails to load) shows a colourful emoji tile.
export default function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false);
  const cat = categories.find((c) => c.name === product.category) || categories[0];

  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cat.gradient} ${className}`}>
      <span className="animate-float text-6xl drop-shadow-lg">{cat.emoji}</span>
    </div>
  );
}
