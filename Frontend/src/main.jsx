
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RQCvyDlBjJfanX349HxCl7sS7LSlo8gwdP66DHiwK8T0SSIbhBAO00BjXOJkUSumPtsF4hzAA857n08jSthVH9h00gRSssIDZ"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
