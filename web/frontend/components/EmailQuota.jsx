import { Button, Card, ProgressBar, TextContainer } from "@shopify/polaris";
import axios from "axios";
import { useState } from "react";

export default function EmailQuota({ totalViewWidgets = 0 }) {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalViewWidget, setTotalViewWidget] = useState(totalViewWidgets);
  const shop = typeof window !== "undefined" && localStorage.getItem("shop");
  const accessToken =
    (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
    null;

  const onClickUpgrade = async () => {
    setLoading(true);
    try {
      let response = await axios.post(
        "/api/change_plan",
        { shop, plan: "PREMIUM" },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );
      // setPlan("PREMIUM");
      if (response.data.data.subscriptionUrl) {
        let redirectUrl = response.data.data.subscriptionUrl;
        window.open(redirectUrl);
        /*redirect*/
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getShopPlan = async () => {
    let config = {
      headers: {
        "x-access-token": accessToken,
      },
    };
    let datas = {
      shop: shop,
    };
    const { data } = await axios.post("/api/get_shop_plan", datas, config);
    setPlan(data?.data?.shop?.plan);
  };

  const disabled = (plans) => {
    return plan === plans;
  };

  return (
    <Card sectioned title="Enjoy the free plan">
      <TextContainer>
        <div>
          <p>View quota: {totalViewWidget}/1000</p>
          <div style={{ padding: "4px 0" }}>
            <ProgressBar
              progress={(totalViewWidget / 1000) * 100}
              color="success"
            />
          </div>
          <p style={{ paddingTop: "4px" }}>
            Upgrade to get an unlimited view quota
          </p>
        </div>
        <Button
          disabled={disabled("PREMIUM")}
          loading={loading}
          onClick={onClickUpgrade}
        >
          Increase quota
        </Button>
      </TextContainer>
    </Card>
  );
}
