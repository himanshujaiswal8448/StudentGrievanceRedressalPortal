import client from "../api/client";

export default function PaymentButton() {
  const loadScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const payNow = async () => {
    const loaded = await loadScript();

    if (!loaded) {
      alert("Razorpay SDK Failed");
      return;
    }

    const { data } = await client.post("/payments/create-order", {
      amount: 500,
      paymentType: "College Fee",
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: data.amount,

      currency: data.currency,

      order_id: data.id,

      name: "Student Grievance Portal",

      description: "Dummy Payment",

      handler: async function (response) {
        const verify = await client.post("/payments/verify", {
          ...response,
          amount: 500,
          paymentType: "College Fee",
        });

        alert(verify.data.message);
      },

      theme: {
        color: "#2563eb",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  };

  return (
    <button
      onClick={payNow}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Pay ₹500
    </button>
  );
}
