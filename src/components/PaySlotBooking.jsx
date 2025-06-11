import React from 'react';
import axios from 'axios';
import { paymentForArt } from '../services/ApiService';
import { showNotification } from "../utilities/Utility"; // ✅ Import showNotification

const CheckoutButton = ({ amount, currency,currencySymbol, email, productname,artId,userId }) => {
  const handleCheckout = async () => {
    try{
    const response = await paymentForArt({
      amount: amount, 
      currency: currency, 
      customerEmail: email,  
      productname:productname,
      artId :artId,
      userId : userId,
      currencySymbol:currencySymbol
    });
   
         
    
    console.log("payment info",response)
    // Redirect the user to Stripe Checkout session URL
    window.location.href = response.data.url;
} catch(err){
    console.error(err);
    showNotification({
        title: "Payment Error",
        message: err.message,
        type: "danger",
      });
}
  };

  return (
    <button onClick={handleCheckout}>Checkout</button>
  );
};

export default CheckoutButton;
