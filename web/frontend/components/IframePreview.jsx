import { useCallback, useEffect, useRef, useState } from "react";
import { Liquid } from "liquidjs";
import templateFaq from "../liquid_templates/faq-template.liquid";
import templateFaqSetting from "../liquid_templates/faq-page-template.liquid";

export default function IframePreview({
  formik,
  shop,
  faqGroup,
  isFaq,
}) {
  const iframe = useRef();
  const engine = new Liquid();
  // const app = NODE_ENV === "development" ? null : null;
  const [faqGroups, setFaqGroups] = useState([]);

  const renderGroupSelected = useCallback(async (group, faqGroups) => {
    const newGroup = group?.map((item) => {
      return faqGroups?.find((groups) => groups?.id === item);
    });
    setFaqGroups(newGroup);
  }, []);

  useEffect(() => {
    if (formik?.values?.groups?.length > 0) {
      renderGroupSelected(formik.values.groups, faqGroup);
    }
    if (formik?.values?.faqGroup?.length > 0 && isFaq) {
      renderGroupSelected(formik.values.faqGroup, faqGroup);
    }
  }, [formik.values.groups, faqGroup, formik.values.faqGroup, isFaq]);

  useEffect(() => {
    if (faqGroups) {
      const {
        faqBehavior,
        faqNameTag,
        faqIconPosition,
        faqExtras,
        faqIconSelect,
        faqStyleID,
      } = formik.values;

      render({
        config: {
          ...formik.values,
          faqStyleID: faqStyleID[0],
          faqBehavior: faqBehavior[0],
          faqNameTag: faqNameTag[0],
          faqIconPosition: faqIconPosition[0],
          faqExtras: faqExtras[0],
          faqIconSelect: faqIconSelect[0],
        },
        groups: faqGroups,
      });
    }
  }, [faqGroups, formik.values]);

  const render = async (data) => {
    const document = iframe.current.contentDocument;
    let head = document.getElementsByTagName("head")[0];
    head.innerHTML = "";
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/all.min.css";
    head.appendChild(style);

    let style3 = document.createElement("link");
    style3.rel = "stylesheet";
    style3.type = "text/css";
    style3.href = `https://${HOST}/${
      isFaq ? "faq-preview.css" : "faq-page-preview.css"
    }`;
    // head.appendChild(style3);

    let style4 = document.createElement("link");
    style4.rel = "stylesheet";
    style4.type = "text/css";
    style4.href = `https://${HOST}/iframe.css`;
    head.appendChild(style4);

    let html = await engine.parseAndRender(
      isFaq ? templateFaq : templateFaqSetting,
      data
    );
    document.body.innerHTML = `
      <body><div class="${isFaq ? "faq-preview" : "faq-page-preview"}">${html}</div></body>
    `;
    let jquery = document.createElement("script");
    jquery.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
    head.appendChild(jquery);

    if (!isFaq) {
      let simesyFaqPageData = document.createElement("script");
      simesyFaqPageData.innerHTML = `
        var simesyFaqPageData = ${JSON.stringify(data)};
      `;
      head.appendChild(simesyFaqPageData);
    }

    let script = document.createElement("script");
    script.src = `https://${HOST}/${isFaq ? "faq-preview.js" : "faq-page-preview.js"}`;
    document.body.appendChild(script);
  };

  return <iframe className="iframe-preview" id="iframe" ref={iframe}></iframe>;
}
