// ** Essential imports
import Stripe from "stripe";

const stripePayment = (app) => {
  app.post("/api/stripe", async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const customerDetails = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phoneNumber,
      address: {
        line1: req.body.address.address1,
        line2: req.body.address.address2,
        city: req.body.address.city,
        state: req.body.address.state,
        country: "IN", // Stripe default country
        postal_code: req.body.address.postal_code,
      },
    };

    let stripeCusId = req.body.stripeCusId;
    let paymentIntent_Id = req.body.paymentIntentId;

    try {
      let paymentIntent;

      //  Create only when stripeCusId not present
      if (!stripeCusId) {
        const customerData = await stripe.customers.create(customerDetails);
        stripeCusId = customerData.id;
      }

      if (paymentIntent_Id) {
        paymentIntent = await stripe.paymentIntents.update(paymentIntent_Id, {
          amount: parseInt(req.body.amount) * 100,
        });
      } else {
        paymentIntent = await stripe.paymentIntents.create({
          customer: stripeCusId,
          amount: parseInt(req.body.amount) * 100,
          currency: "inr", // Stripe default currency
          automatic_payment_methods: {
            enabled: true,
          },
        });
      }

      const clientSecret = paymentIntent.client_secret;

      const paymentIntentId = paymentIntent.id;

      res.send({
        status: 200,
        message: "Created client secret successfully",
        stripeCusId,
        clientSecret,
        paymentIntentId,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post("/api/stripe/customer", async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const customerDetails = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phoneNumber,
      address: {
        line1: req.body.address.address1,
        line2: req.body.address.address2,
        city: req.body.address.city,
        state: req.body.address.state,
        country: "IN", // Stripe default country
        postal_code: req.body.address.postal_code,
      },
    };

    let stripeCusId = req.body.stripeCusId;

    //  Create only when stripeCusId not present
    if (!stripeCusId) {
      const customerData = await stripe.customers.create(customerDetails);
      stripeCusId = customerData.id;
    }

    try {
      await stripe.customers.update(stripeCusId, customerDetails);

      res.send({
        status: 200,
        message: "Successfully updated the stripe customer",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};

export default stripePayment;
