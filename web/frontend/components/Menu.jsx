import { Icon, Navigation } from "@shopify/polaris";
import {
  CheckoutMajor,
  ExternalMinor,
  HomeMajor,
  QuestionMarkMajor,
  ThemesMajor,
  BillingStatementDollarMajor,
  NoteMajor,
  SettingsMinor,
  LiveViewMajor,
  PlayCircleMajor
} from "@shopify/polaris-icons";
import { useRouter } from "next/router";

export default function MenuHeader({shop}) {
  const router = useRouter();
  const shopValue = typeof window !== "undefined" && localStorage.getItem("shop") || shop;

  return (
    <Navigation location={router.pathname}>
      <Navigation.Section
        title="Welcome! 👋"
        items={[
          {
            url: "/",
            label: "FAQs",
            icon: QuestionMarkMajor,
            exactMatch: true,
          },
          {
            url: "/faq-page-settings",
            label: "FAQ Page",
            icon: NoteMajor,
            exactMatch: true,
          },
          {
            url: "/widgets",
            label: "Accordions",
            icon: ThemesMajor,
            exactMatch: true,
          },
          {
            url: "/checkout-success",
            label: "Checkout Success FAQs",
            icon: CheckoutMajor,
            exactMatch: true,
          },
          {
            url: "/plan",
            label: "Plan",
            icon: BillingStatementDollarMajor,
            exactMatch: true,
          },
          // {
          //   url: "/settings",
          //   label: "Settings",
          //   icon: SettingsMinor,
          //   exactMatch: true,
          // },
        ]}
      />

      <Navigation.Section
        title="Support"
        items={[
          // {
          //   url: "https://simesy-agency.freshdesk.com/support/solutions/folders/73000562158",
          //   label: "Video Tutorial",
          //   icon: PlayCircleMajor,
          //   badge: <Icon source={ExternalMinor} color="base" />,
          // },
          {
            url: "https://docs.simesy.com/collection/1-faq-page-product-faq",
            label: "Documentation",
            icon: QuestionMarkMajor,
            badge: <Icon source={ExternalMinor} color="base" />,
          },
        ]}
      />

      {shop &&
        <Navigation.Section
          title="Preview"
          items={[
            {
              url: `https://${shop}/a/faq`,
              label: "Preview FAQ Page",
              icon: LiveViewMajor,
              badge: <Icon source={ExternalMinor} color="base" />,
            },
          ]}
        />
      }
    </Navigation>
  );
}
