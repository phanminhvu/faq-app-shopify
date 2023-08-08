// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import dotenv from "dotenv";
import _ from "lodash";

import Checkout from "./models/checkout-success.model.js";
import FaqSetting from "./models/faq-setting.model.js";
import Setting from "./models/setting.js";
import Faq from "./models/faq.model.js";
import Shop from "./models/shop.model.js";
import Widget from "./models/widget.model.js";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Connected to %s", process.env.MONGODB_URL);
  }
});

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    const { shop, accessToken } = res.locals.shopify.session;
    await Shop.findOneAndUpdate(
      { shop: shop },
      {
        shop: shop,
        token: accessToken,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    next(); 
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.post("/api/faq/import-demo", async (_req, res) => {
  let { shop } = _req.body;

  try {
    let data = [
      {
        name: "General questions",
        faqs: [
          {
            question: "What is the status of my order?",
            answer:
              '<p>Once you have placed your order, we will send you a confirmation email to track the status of your order.</p><p>Once your order is shipped we will send you another email to confirm you the expected delivery date as well as the link to track your order (when the delivery method allows it).</p><p>Additionally, you can track the status of your order from your "order history" section on your account page on the website.</p>',
          },
          {
            question: "Can I change my order?",
            answer:
              '<p>We can only change orders that have not been processed for shipping yet.</p><p>Once your order is under the status "preparing for shipping", "shipping" or "delivered", then we cannot accept any edits to your order.</p><p>To make changes to your order, please reach out to support through the helpdesk.</p>',
          },
          {
            question: "Where do you ship?",
            answer:
              "<p>We currently ship in the United-States, Canada, Australia, France, the UK and Germany.</p><p>For shipping outside of these countries, please reach out to our support through our helpdesk.</p>",
          }
        ],
      },
      {
        name: "Payment",
        faqs: [
          {
            question: "What payment methods do you accept?",
            answer:
              "<p>You can purchase on our website using a debit or credit card.</p><p>We additionnaly offer support for Paypal, Amazon Pay, Apple Pay, and Google Pay.</p><p>You can chose these payment methods at checkout.</p>",
          },
          {
            question: "Which currency will I be charged in?",
            answer:
              "<p>We currently only support the following currencies for charging our customers in their local currencies: USD, CAD and EUR. </p><p>If your credit or debit card use another currency, then you will be charged in USD, CAD or EUR, depending on the website you are on. Your bank will apply the corresponding &nbsp;conversation rate of the currency you choose.</p>",
          }
        ],
      },
      {
        name: "Shipping",
        faqs: [
          {
            question: "Where do you ship?",
            answer:
              "<p>We currently ship in the United-States, Canada, Australia, France, the UK and Germany.</p><p>For shipping outside of these countries, please reach out to our support through our helpdesk.</p>",
          },
          {
            question: "How long does it take to ship my order?",
            answer:
              "<p>Once you've placed your order, it usually takes 24 to 48 hours to process it for delivery.</p><p>Standard shipping time for the countries covered by our delivery partners are presented below. You can find them when choosing for a delivery method before confirming your order:</p><p>- United-States: 1-2 days <br>- Canada: 1-1 days <br>- Australia: 2-3 days <br>- France: 2-3 days <br>- UK: 2-3 days <br>- Germany: 2-3 days </p>",
          }
        ],
      },
    ];
    let groups = data.map((group) => {
      let faqs = group.faqs.map((faq) => {
        return {
          id: Math.random().toString(36).slice(2),
          ...faq
        }
      });
      return {
        ...group,
        faqs
      }
    });
    let insert = groups.map((group) => {
      return {
        shop,
        config: group
      }
    })
    let faq = await Faq.insertMany(insert, {return: true});
    res.status(200).send({
      success: true,
      data: {
        faq,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.post("/api/faq", async (_req, res) => {
  let { shop } = _req.body;

  try {
    let faq = await Faq.find({ shop }).sort({ createdAt: 1 });
    res.status(200).send({
      success: true,
      data: {
        faq,
      }
    })
  } catch (error) {
    res.status(400).send({
      success: false,
    })
  }
});

app.post("/api/faq-group/new", async (_req, res) => {
  let { shop, config } = _req.body;
  const shopData = await Shop.findOne({ shop });
  let arrayGroup = [];
  for (let i = 1; i <= 1000; i++) {
    arrayGroup.push(i);
  }
  const indexGroup = _.difference(arrayGroup, shopData.groupFaq);
  try {
    const newGroupFaqNumber = [...shopData.groupFaq, ...[indexGroup[0]]];
    await Shop.updateOne({ shop }, { groupFaq: newGroupFaqNumber });
    let faq = new Faq({
      shop,
      config: {
        ...config,
        name: `${config.name}`,
      },
    });
    await faq.save();
    res.status(200).send({
      success: true,
      data: {
        faq,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.put("/api/faq/new", async (_req, res) => {
  let { shop, config, id } = _req.body;
  try {
    let faq = await Faq.findByIdAndUpdate(
      id,
      { $set: { config: config } },
      { new: true }
    );
    res.status(200).send({
      success: true,
      data: {
        faq,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.put("/api/faq-group/:id", async (_req, res) => {
  let { shop, config, nameOld } = _req.body;
  let { id } = _req.params;
  const shopData = await Shop.findOne({ shop });
  let newGroup = shopData?.groupFaq;
  try {
    if (nameOld !== config.name && nameOld?.includes("New Group ")) {
      const nameReplace = nameOld?.replace("New Group ", "");
      if (shopData?.groupFaq?.includes(Number(nameReplace))) {
        newGroup = newGroup?.filter((item) => item !== Number(nameReplace));
        await Shop.updateOne({ shop }, { groupFaq: newGroup });
      } else if (
        !newGroup?.includes(Number(nameReplace)) &&
        Number(nameReplace) > 0
      ) {
        const newGroupFaqNumber = [
          ...shopData.groupFaq,
          ...[Number(nameReplace)],
        ];
        await Shop.updateOne({ shop }, { groupFaq: newGroupFaqNumber });
      }
    }

    if (config?.name.includes("New Group ")) {
      const nameReplace = config?.name?.replace("New Group ", "");
      if (
        !newGroup?.includes(Number(nameReplace)) &&
        Number(nameReplace) > 0
      ) {
        const newGroupFaqNumber = [...newGroup, ...[Number(nameReplace)]];
        await Shop.updateOne({ shop }, { groupFaq: newGroupFaqNumber });
      }
    }
    let faq = await Faq.findByIdAndUpdate(
      id,
      { $set: { config: config } },
      { new: true }
    );
    res.status(200).send({
      success: true,
      data: {
        faq,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.delete("/api/faq-group/:id", async (_req, res) => {
  let { id } = _req.params;
  const faqGroup = await Faq.findOne({ _id: id });
  const shopData = await Shop.findOne({ shop: faqGroup?.shop });
  const name = faqGroup?.config?.name;
  try {
    if (name.includes("New Group ")) {
      const nameReplace = name?.replace("New Group ", "");
      if (!shopData?.groupFaq?.includes(Number(nameReplace))) {
        const newGroupFaqNumber = [
          ...shopData.groupFaq,
          ...[Number(nameReplace)],
        ];
        await Shop.updateOne(
          { shop: faqGroup?.shop },
          { groupFaq: newGroupFaqNumber }
        );
      } else {
        await Shop.updateOne(
          { shop: faqGroup?.shop },
          {
            groupFaq: shopData?.groupFaq?.filter(
              (item) => item !== Number(nameReplace)
            ),
          }
        );
      }
    }
    await Faq.deleteOne({ _id: id });
    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
    });
  }
});

app.post("/api/faq-translation", async (_req, res) => {
  let { shop } = _req.body;

  try {
    let shopData = await Shop.findOne({ shop });
    const clientQuery = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session
    });
    const data = await clientQuery.query({
      data: `{
        shopLocales {
          locale
          primary
          published
          name
        }
      }`,
    });
    const shopLocales = data?.body?.data?.shopLocales;
    res.status(200).send({
      success: true,
      data: shopLocales,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
    });
  }
});

app.post("/api/get_shop_plan", async (_req, res) => {
  let { shop } = _req.body;

  try {
    let shopData = await Shop.findOne({ shop });
    res.status(200).send({
      success: true,
      data: {
        shop: {
          url: shopData.shop,
          plan: shopData.plan, // FREE | PREMIUM,
        },
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
    });
  }
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
