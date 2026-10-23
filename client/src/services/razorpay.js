// Loads Razorpay's checkout script once and opens the payment popup.
let scriptPromise = null;

function loadScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

// Resolves with the Razorpay response on success, rejects if closed or failed.
export async function openRazorpay({ keyId, razorpayOrderId, amount, currency, storeName, prefill }) {
  const loaded = await loadScript();
  if (!loaded) throw new Error('Could not load the payment window. Check your internet connection.');

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: storeName,
      description: 'Order payment',
      order_id: razorpayOrderId,
      prefill,
      theme: { color: '#e11d48' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('Payment was cancelled')) },
    });
    rzp.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed')));
    rzp.open();
  });
}
