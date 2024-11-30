const { Cashfree } = require("cashfree-pg");
const axios = require("axios")
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = process.env.MODE === 'development' ? Cashfree.Environment.SANDBOX : Cashfree.Environment.PRODUCTION;

const BaseUrl = process.env.MODE === 'development' 
  ? "https://sandbox.cashfree.com/pg/orders" 
  : "https://api.cashfree.com/pg/orders";

  
const createOrder = async (req, res) => {
  const { price } = req.body;

  if (!price) {
    return res.status(400).json({ error: "Price is required" });
  }

  const request = {
    order_amount: price,
    order_currency: "INR",
    customer_details: {
      customer_id: "Applicant_123",  
      customer_name: "Job_Applicant", 
      customer_email: "job@gmail.com", 
      customer_phone: "8474090589",   
    },
    order_meta: {
      return_url: process.env.RETURN_URL,
    },
    order_note: "Resume Service Payment", // Optional note
  };

  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    res.status(200).json({
      payment_session_id: response.data.payment_session_id,
      orderId: response.data.order_id,
    });
  } catch (error) {
    console.error('Error setting up order request:', error.response?.data || error.message);
    res.status(400).send("Failed to create order");
  }
};

const craeteSesion = async (req, res) => {
  const { price } = req.body;

  const requestBody = {
    customer_details: {
      customer_id: '12',
      customer_name: "Improve job profile",
      customer_phone: '7845784576',
      customer_email: 'anil@gmail.com',
    },
    order_amount: parseInt(price),
    order_currency: 'INR',
  };

  try {
    const response = await axios.post(BaseUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': ClientId,
        'x-client-secret': ClientSecret,
        'x-api-version': '2023-08-01',
      },
    });

    // console.log(response.data);
    if (response.tx_msg == 'success') {
      res.status(200).json(response.tx_msg)
    }

    res.json({ payment_link: response.data.payment_link });
  } catch (error) {
    console.error('Error creating payment session:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

const verifyPayment = async (req, res) => {

  const { orderId } = req.body;

  Cashfree.PGOrderFetchPayments("2023-08-01", `${orderId}`).then((response) => {
    res.status(200).json(response.data);
    // console.log('Order fetched successfully:', response.data);
  }).catch((error) => {
    console.error('Error:', error.response.data.message);
  });

};

module.exports = {
  createOrder,
  craeteSesion,
  verifyPayment,
};

