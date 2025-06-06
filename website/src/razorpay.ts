import Razorpay from "razorpay";

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
  throw Error("Razorpay key id not defined !");
}

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
