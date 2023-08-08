import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

import FaqComponent from "../components/FaqComponent";

export default function HomePage({ shop, authAxios }) {
  console.log("shop", shop);
  return <FaqComponent shop={shop} authAxios={authAxios} />
}
