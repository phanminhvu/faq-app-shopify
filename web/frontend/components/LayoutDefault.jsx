import { Banner, Frame, Layout, Link, Page, TopBar } from "@shopify/polaris";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Logo from "../assets/img/logo.png";
import MenuHeader from "./Menu";

export default function LayoutDefault({ children, shop, title }) {
  const refMailQuota = useRef(null);
  const refMailQuotaDropDown = useRef(null);
  const refMailQuotaDropDownOverlay = useRef(null);

  const handleMouseOver = () => refMailQuotaDropDown.current.className = "dropdown-active";
  const handleMouseOut = () => refMailQuotaDropDown.current.className = "header-email-quota";

  useEffect(
    () => {
      const node = refMailQuota.current;
      const node2 = refMailQuotaDropDown.current;
      const node3 = refMailQuotaDropDownOverlay.current;
      if (node && node3 && node2) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseleave", handleMouseOut);
        node3.addEventListener("mouseover", handleMouseOver);
        // node3.addEventListener("mouseout", handleMouseOut);
        node2.addEventListener("mouseover", handleMouseOver);
        node2.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseleave", handleMouseOut);
          node3.removeEventListener("mouseover", handleMouseOver);
          node3.removeEventListener("mouseout", handleMouseOut);
          node2.removeEventListener("mouseover", handleMouseOver);
          node2.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [
      refMailQuota.current,
      refMailQuotaDropDown.current,
      refMailQuotaDropDownOverlay.current,
    ] // Recall only if ref changes
  );

  const userMenuMarkup = (
    <div className="header-right">
      <Link external url={`https://${shop}`}>
        {shop}
      </Link>
    </div>
  );

  const secondaryMenuMarkup = (
    <img src={Logo} alt="Picture of the author"  style={{width: '150px', height: '36px'}} />
  );

  return (
    <Frame>
      {children}
    </Frame>
  );
}
