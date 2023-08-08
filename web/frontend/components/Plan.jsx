import React, { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  Heading,
  TextContainer,
  Icon,
  Button,
} from "@shopify/polaris";
import { CircleTickMajor } from "@shopify/polaris-icons";
import axios from "axios";
import { Redirect } from "@shopify/app-bridge/actions";

function Plan({ shop, authAxios }) {
  const [loading, setLoading] = useState(false);

  const disabled = (plan) => {
    return props.data.plan === plan;
  };

  const onClickUpgrade = async (plan) => {
    setLoading(true);
    try {
      let response = await authAxios.post("/api/change_plan", { shop, plan });

      if (plan === "PREMIUM" && response.data.data.subscriptionUrl) {
        let redirectUrl = response.data.data.subscriptionUrl;
        app.dispatch(
          Redirect.toRemote({
            url: redirectUrl,
          })
        );
      }

      props.downgradePlan();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section>
              <div className="plan-card">
                <TextContainer>
                  <h3 className="plan-title">Free</h3>
                  <p className="plan-price">$0/month</p>
                  <ul className="plan-features">
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" />{" "}
                      Responsive and mobile friendly.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> 3
                      Pre-designed Ready Themes.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> AutoPlay
                      on/off.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Infinite
                      loop for the slider.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Set a
                      maximum number of products to show to the slider.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Multiple
                      product sliders (supports more than one slider per page).
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" />{" "}
                      Show/hide/customize Product name.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" />{" "}
                      Show/hide/customize Product price.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" />{" "}
                      Show/hide/customize Product add to cart button.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Control
                      number of product columns in different devices.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Many
                      more...
                    </li>
                  </ul>
                  <Button
                    loading={loading}
                    onClick={() => onClickUpgrade("FREE")}
                    size="large"
                    fullWidth
                    primary
                    disabled={disabled("FREE")}
                  >
                    {disabled("FREE") ? "Current plan" : "Downgrade"}
                  </Button>
                </TextContainer>
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section>
              <div className="plan-card">
                <TextContainer>
                  <h3 className="plan-title">Premium</h3>
                  <p className="plan-price">$4.99/month</p>
                  <ul className="plan-features">
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" />{" "}
                      Everything in free plan
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> 2 Unique
                      Layouts (Slider and Grid).
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> 20+
                      Professionally Pre-designed Themes.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> 840+
                      Google Fonts (Advanced Typography options).
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Product
                      image hover effects (Mouse overlay).
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Product
                      name & description word limit options.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Sale and
                      Out of Stock ribbon.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> 8+
                      different navigation position.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> 7
                      different style navigation arrows.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Product
                      Image Flip option.
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Many
                      more...
                    </li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Advanced FAQ accordion customization</li>
                    <li className="plan-feature">
                      <Icon source={CircleTickMajor} color="success" /> Premium FAQ page theme
                    </li>
                  </ul>
                  <Button
                    loading={loading}
                    onClick={() => onClickUpgrade("PREMIUM")}
                    size="large"
                    fullWidth
                    primary
                    disabled={disabled("PREMIUM")}
                  >
                    {disabled("PREMIUM") ? "Current plan" : "Upgrade"}
                  </Button>
                </TextContainer>
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Plan;
