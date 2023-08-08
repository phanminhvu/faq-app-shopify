import { useCallback, useEffect, useRef, useState } from "react";
import { Liquid } from "liquidjs";
import templateFaq from "../liquid_templates/faq-template.liquid";
import templateFaqSetting from "../liquid_templates/faq-page-template.liquid";

export default function IframePreviewCheckoutSuccess({
  formik,
  shop,
  accessToken,
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
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
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
    // style4.href = `https://${HOST}/iframe.css`;
    head.appendChild(style4);

    let style5 = document.createElement("link");
    style5.rel = "stylesheet";
    style5.type = "text/css";
    style5.href = `https://${HOST}/checkout-iframe.css`;
    head.appendChild(style5);

    let html = await engine.parseAndRender(
      isFaq ? templateFaq : templateFaqSetting,
      data
    );
    document.body.innerHTML = `
      <body style="--p-background:rgba(246, 246, 247, 1); --p-background-hovered:rgba(241, 242, 243, 1); --p-background-pressed:rgba(237, 238, 239, 1); --p-background-selected:rgba(237, 238, 239, 1); --p-surface:rgba(255, 255, 255, 1); --p-surface-neutral:rgba(228, 229, 231, 1); --p-surface-neutral-hovered:rgba(219, 221, 223, 1); --p-surface-neutral-pressed:rgba(201, 204, 208, 1); --p-surface-neutral-disabled:rgba(241, 242, 243, 1); --p-surface-neutral-subdued:rgba(246, 246, 247, 1); --p-surface-subdued:rgba(250, 251, 251, 1); --p-surface-disabled:rgba(250, 251, 251, 1); --p-surface-hovered:rgba(246, 246, 247, 1); --p-surface-pressed:rgba(241, 242, 243, 1); --p-surface-depressed:rgba(237, 238, 239, 1); --p-backdrop:rgba(0, 0, 0, 0.5); --p-overlay:rgba(255, 255, 255, 0.5); --p-shadow-from-dim-light:rgba(0, 0, 0, 0.2); --p-shadow-from-ambient-light:rgba(23, 24, 24, 0.05); --p-shadow-from-direct-light:rgba(0, 0, 0, 0.15); --p-hint-from-direct-light:rgba(0, 0, 0, 0.15); --p-on-surface-background:rgba(241, 242, 243, 1); --p-border:rgba(140, 145, 150, 1); --p-border-neutral-subdued:rgba(186, 191, 195, 1); --p-border-hovered:rgba(153, 158, 164, 1); --p-border-disabled:rgba(210, 213, 216, 1); --p-border-subdued:rgba(201, 204, 207, 1); --p-border-depressed:rgba(87, 89, 89, 1); --p-border-shadow:rgba(174, 180, 185, 1); --p-border-shadow-subdued:rgba(186, 191, 196, 1); --p-divider:rgba(225, 227, 229, 1); --p-icon:rgba(92, 95, 98, 1); --p-icon-hovered:rgba(26, 28, 29, 1); --p-icon-pressed:rgba(68, 71, 74, 1); --p-icon-disabled:rgba(186, 190, 195, 1); --p-icon-subdued:rgba(140, 145, 150, 1); --p-text:rgba(32, 34, 35, 1); --p-text-disabled:rgba(140, 145, 150, 1); --p-text-subdued:rgba(109, 113, 117, 1); --p-interactive:rgba(44, 110, 203, 1); --p-interactive-disabled:rgba(189, 193, 204, 1); --p-interactive-hovered:rgba(31, 81, 153, 1); --p-interactive-pressed:rgba(16, 50, 98, 1); --p-focused:rgba(69, 143, 255, 1); --p-surface-selected:rgba(242, 247, 254, 1); --p-surface-selected-hovered:rgba(237, 244, 254, 1); --p-surface-selected-pressed:rgba(229, 239, 253, 1); --p-icon-on-interactive:rgba(255, 255, 255, 1); --p-text-on-interactive:rgba(255, 255, 255, 1); --p-action-secondary:rgba(255, 255, 255, 1); --p-action-secondary-disabled:rgba(255, 255, 255, 1); --p-action-secondary-hovered:rgba(246, 246, 247, 1); --p-action-secondary-pressed:rgba(241, 242, 243, 1); --p-action-secondary-depressed:rgba(109, 113, 117, 1); --p-action-primary:rgba(0, 128, 96, 1); --p-action-primary-disabled:rgba(241, 241, 241, 1); --p-action-primary-hovered:rgba(0, 110, 82, 1); --p-action-primary-pressed:rgba(0, 94, 70, 1); --p-action-primary-depressed:rgba(0, 61, 44, 1); --p-icon-on-primary:rgba(255, 255, 255, 1); --p-text-on-primary:rgba(255, 255, 255, 1); --p-text-primary:rgba(0, 123, 92, 1); --p-text-primary-hovered:rgba(0, 108, 80, 1); --p-text-primary-pressed:rgba(0, 92, 68, 1); --p-surface-primary-selected:rgba(241, 248, 245, 1); --p-surface-primary-selected-hovered:rgba(179, 208, 195, 1); --p-surface-primary-selected-pressed:rgba(162, 188, 176, 1); --p-border-critical:rgba(253, 87, 73, 1); --p-border-critical-subdued:rgba(224, 179, 178, 1); --p-border-critical-disabled:rgba(255, 167, 163, 1); --p-icon-critical:rgba(215, 44, 13, 1); --p-surface-critical:rgba(254, 211, 209, 1); --p-surface-critical-subdued:rgba(255, 244, 244, 1); --p-surface-critical-subdued-hovered:rgba(255, 240, 240, 1); --p-surface-critical-subdued-pressed:rgba(255, 233, 232, 1); --p-surface-critical-subdued-depressed:rgba(254, 188, 185, 1); --p-text-critical:rgba(215, 44, 13, 1); --p-action-critical:rgba(216, 44, 13, 1); --p-action-critical-disabled:rgba(241, 241, 241, 1); --p-action-critical-hovered:rgba(188, 34, 0, 1); --p-action-critical-pressed:rgba(162, 27, 0, 1); --p-action-critical-depressed:rgba(108, 15, 0, 1); --p-icon-on-critical:rgba(255, 255, 255, 1); --p-text-on-critical:rgba(255, 255, 255, 1); --p-interactive-critical:rgba(216, 44, 13, 1); --p-interactive-critical-disabled:rgba(253, 147, 141, 1); --p-interactive-critical-hovered:rgba(205, 41, 12, 1); --p-interactive-critical-pressed:rgba(103, 15, 3, 1); --p-border-warning:rgba(185, 137, 0, 1); --p-border-warning-subdued:rgba(225, 184, 120, 1); --p-icon-warning:rgba(185, 137, 0, 1); --p-surface-warning:rgba(255, 215, 157, 1); --p-surface-warning-subdued:rgba(255, 245, 234, 1); --p-surface-warning-subdued-hovered:rgba(255, 242, 226, 1); --p-surface-warning-subdued-pressed:rgba(255, 235, 211, 1); --p-text-warning:rgba(145, 106, 0, 1); --p-border-highlight:rgba(68, 157, 167, 1); --p-border-highlight-subdued:rgba(152, 198, 205, 1); --p-icon-highlight:rgba(0, 160, 172, 1); --p-surface-highlight:rgba(164, 232, 242, 1); --p-surface-highlight-subdued:rgba(235, 249, 252, 1); --p-surface-highlight-subdued-hovered:rgba(228, 247, 250, 1); --p-surface-highlight-subdued-pressed:rgba(213, 243, 248, 1); --p-text-highlight:rgba(52, 124, 132, 1); --p-border-success:rgba(0, 164, 124, 1); --p-border-success-subdued:rgba(149, 201, 180, 1); --p-icon-success:rgba(0, 127, 95, 1); --p-surface-success:rgba(174, 233, 209, 1); --p-surface-success-subdued:rgba(241, 248, 245, 1); --p-surface-success-subdued-hovered:rgba(236, 246, 241, 1); --p-surface-success-subdued-pressed:rgba(226, 241, 234, 1); --p-text-success:rgba(0, 128, 96, 1); --p-decorative-one-icon:rgba(126, 87, 0, 1); --p-decorative-one-surface:rgba(255, 201, 107, 1); --p-decorative-one-text:rgba(61, 40, 0, 1); --p-decorative-two-icon:rgba(175, 41, 78, 1); --p-decorative-two-surface:rgba(255, 196, 176, 1); --p-decorative-two-text:rgba(73, 11, 28, 1); --p-decorative-three-icon:rgba(0, 109, 65, 1); --p-decorative-three-surface:rgba(146, 230, 181, 1); --p-decorative-three-text:rgba(0, 47, 25, 1); --p-decorative-four-icon:rgba(0, 106, 104, 1); --p-decorative-four-surface:rgba(145, 224, 214, 1); --p-decorative-four-text:rgba(0, 45, 45, 1); --p-decorative-five-icon:rgba(174, 43, 76, 1); --p-decorative-five-surface:rgba(253, 201, 208, 1); --p-decorative-five-text:rgba(79, 14, 31, 1); --p-border-radius-base:0.4rem; --p-border-radius-wide:0.8rem; --p-border-radius-full:50%; --p-card-shadow:0px 0px 5px var(--p-shadow-from-ambient-light), 0px 1px 2px var(--p-shadow-from-direct-light); --p-popover-shadow:-1px 0px 20px var(--p-shadow-from-ambient-light), 0px 1px 5px var(--p-shadow-from-direct-light); --p-modal-shadow:0px 26px 80px var(--p-shadow-from-dim-light), 0px 0px 1px var(--p-shadow-from-dim-light); --p-top-bar-shadow:0 2px 2px -1px var(--p-shadow-from-direct-light); --p-button-drop-shadow:0 1px 0 rgba(0, 0, 0, 0.05); --p-button-inner-shadow:inset 0 -1px 0 rgba(0, 0, 0, 0.2); --p-button-pressed-inner-shadow:inset 0 1px 0 rgba(0, 0, 0, 0.15); --p-override-none:none; --p-override-transparent:transparent; --p-override-one:1; --p-override-visible:visible; --p-override-zero:0; --p-override-loading-z-index:514; --p-button-font-weight:500; --p-non-null-content:''; --p-choice-size:2rem; --p-icon-size:1rem; --p-choice-margin:0.1rem; --p-control-border-width:0.2rem; --p-banner-border-default:inset 0 0.1rem 0 0 var(--p-border-neutral-subdued), inset 0 0 0 0.1rem var(--p-border-neutral-subdued); --p-banner-border-success:inset 0 0.1rem 0 0 var(--p-border-success-subdued), inset 0 0 0 0.1rem var(--p-border-success-subdued); --p-banner-border-highlight:inset 0 0.1rem 0 0 var(--p-border-highlight-subdued), inset 0 0 0 0.1rem var(--p-border-highlight-subdued); --p-banner-border-warning:inset 0 0.1rem 0 0 var(--p-border-warning-subdued), inset 0 0 0 0.1rem var(--p-border-warning-subdued); --p-banner-border-critical:inset 0 0.1rem 0 0 var(--p-border-critical-subdued), inset 0 0 0 0.1rem var(--p-border-critical-subdued); --p-badge-mix-blend-mode:luminosity; --p-thin-border-subdued:0.1rem solid var(--p-border-subdued); --p-text-field-spinner-offset:0.2rem; --p-text-field-focus-ring-offset:-0.4rem; --p-text-field-focus-ring-border-radius:0.7rem; --p-button-group-item-spacing:-0.1rem; --p-duration-1-0-0:100ms; --p-duration-1-5-0:150ms; --p-ease-in:cubic-bezier(0.5, 0.1, 1, 1); --p-ease:cubic-bezier(0.4, 0.22, 0.28, 1); --p-range-slider-thumb-size-base:1.6rem; --p-range-slider-thumb-size-active:2.4rem; --p-range-slider-thumb-scale:1.5; --p-badge-font-weight:400; --p-frame-offset:0px;">
        <header class="banner" data-header="" role="banner">
            <div class="wrap">
                <button class="logo logo--left" type="button"><span class="logo__text heading-1">Logo</span></button>
                <h1 class="visually-hidden">Thank you for your purchase!</h1>
            </div>
        </header>
        <aside role="complementary">
            <button class="order-summary-toggle shown-if-js order-summary-toggle--show" aria-expanded="false" aria-controls="order-summary" data-drawer-toggle="[data-order-summary]">
                <span class="wrap">
                    <span class="order-summary-toggle__inner">
                        <span class="order-summary-toggle__icon-wrapper">
                            <svg width="20" height="19" xmlns="http://www.w3.org/2000/svg" class="order-summary-toggle__icon"><path d="M17.178 13.088H5.453c-.454 0-.91-.364-.91-.818L3.727 1.818H0V0h4.544c.455 0 .91.364.91.818l.09 1.272h13.45c.274 0 .547.09.73.364.18.182.27.454.18.727l-1.817 9.18c-.09.455-.455.728-.91.728zM6.27 11.27h10.09l1.454-7.362H5.634l.637 7.362zm.092 7.715c1.004 0 1.818-.813 1.818-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817zm9.18 0c1.004 0 1.817-.813 1.817-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817z"></path></svg>
                        </span>
                        <span class="order-summary-toggle__text order-summary-toggle__text--show">
                            <span>Show order summary</span>
                            <svg width="11" height="6" xmlns="http://www.w3.org/2000/svg" class="order-summary-toggle__dropdown" fill="#000"><path d="M.504 1.813l4.358 3.845.496.438.496-.438 4.642-4.096L9.504.438 4.862 4.534h.992L1.496.69.504 1.812z"></path></svg>
                        </span>
                        <span class="order-summary-toggle__text order-summary-toggle__text--hide">
                            <span>Hide order summary</span>
                            <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg" class="order-summary-toggle__dropdown" fill="#000"><path d="M6.138.876L5.642.438l-.496.438L.504 4.972l.992 1.124L6.138 2l-.496.436 3.862 3.408.992-1.122L6.138.876z"></path></svg>
                        </span>
                        <dl class="order-summary-toggle__total-recap total-recap" data-order-summary-section="toggle-total-recap">
                            <dt class="visually-hidden"><span>Sale price</span></dt>
                            <dd>
                                <span class="order-summary__emphasis total-recap__final-price skeleton-while-loading" data-checkout-payment-due-target="12000">$120.00</span>
                            </dd>
                        </dl>
                    </span>
                </span>
            </button>
        </aside>
        <div class="content" data-content="">
            <div class="wrap">
                <div class="main">
                    <header class="main__header" role="banner">
                        <button class="logo logo--left" type="button"><span class="logo__text heading-1">Logo</span></button>
                        <h1 class="visually-hidden">Thank you for your purchase!</h1>
                        <div class="shown-if-js" data-alternative-payments=""></div>
                    </header>
                    <main class="main__content" role="main">
                        <div class="step" data-step="thank_you">
                            <div class="step__sections">
                                <div class="section" data-order-update-options="[]">
                                    <div class="section__header os-header">
                                        <svg class="icon-svg icon-svg--color-accent icon-svg--size-48 os-header__hanging-icon" aria-hidden="true" focusable="false"><use xlink:href="#checkmark"></use></svg>
                                        <div class="os-header__heading">
                                            <span class="os-order-number">Order #1001</span>
                                            <h2 class="os-header__title" id="main-header" tabindex="-1">Thank you!</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="section">
                                    <div class="section__content">
                                        <div class="content-box">
                                            <div class="content-box__row text-container">
                                                <h2 class="heading-2 os-step__title">Your order is confirmed</h2>
                                                <div class="os-step__special-description">
                                                    <p class="os-step__description">You’ll receive an email when your order is ready.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="content-box">
                                            <div class="content-box__row content-box__row--no-border">
                                                <h2>Customer information</h2>
                                            </div>
                                            <div class="content-box__row">
                                                <div class="section__content">
                                                    <div class="section__content__column section__content__column--half">
                                                        <div class="text-container">
                                                            <h3 class="heading-3">Contact information</h3>
                                                            <p><bdo dir="ltr">hello@yourstore.com</bdo></p>
                                                            <h3 class="heading-3">Shipping address</h3>
                                                            <address class="address">John Doe<br>777 Brockton Avenue<br>Abington MA 2351<br>United States</address>
                                                            <h3 class="heading-3">Shipping method</h3>
                                                            <p>Standard</p>
                                                        </div>
                                                    </div>
                                                    <div class="section__content__column section__content__column--half">
                                                        <div class="text-container">
                                                            <h3 class="heading-3">Payment method</h3>
                                                            <ul class="payment-method-list" role="list">
                                                                <li class="payment-method-list__item">
                                                                    <i class="payment-icon payment-icon--bogus payment-method-list__item-icon"><span class="visually-hidden">Bogus</span></i>
                                                                    <span class="payment-method-list__item__info">ending with 1</span>
                                                                    <span class="payment-method-list__item__amount emphasis"> - $120.00</span>
                                                                </li>
                                                            </ul>
                                                            <h3 class="heading-3">Billing address</h3>
                                                            <address class="address">John Doe<br>777 Brockton Avenue<br>Abington MA 2351<br>United States</address>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="step__footer">
                                <button type="button" data-osp-continue-button=""
                                    class="step__footer__continue-btn btn">
                                    <span class="btn__content">Continue shopping</span>
                                    <svg class="icon-svg icon-svg--size-18 btn__spinner icon-svg--spinner-button" aria-hidden="true" focusable="false"><use xlink:href="#spinner-button"></use></svg>
                                </button>
                                <p class="step__footer__info">Need help? <button class="link" type="button">Contact us</button></p>
                            </div>
                        </div>
                    </main>
                </div>
                <aside class="sidebar" role="complementary">
                    <div class="sidebar__content">
                        <div class="order-summary order-summary--is-collapsed" data-order-summary="">
                            <h2 class="visually-hidden">Order summary</h2>
                            <div class="order-summary__sections">
                                <div class="order-summary__section order-summary__section--product-list">
                                    <div class="order-summary__section__content">
                                        <table class="product-table">
                                            <caption class="visually-hidden">Shopping cart</caption>
                                            <thead class="product-table__header">
                                                <tr>
                                                    <th scope="col"><span class="visually-hidden">Product image</span></th>
                                                    <th scope="col"><span class="visually-hidden">Description</span></th>
                                                    <th scope="col"><span class="visually-hidden">Quantity</span></th>
                                                    <th scope="col"><span class="visually-hidden">Price</span></th>
                                                </tr>
                                            </thead>
                                            <tbody data-order-summary-section="line-items">
                                                <tr class="product" data-product-id="4377922306092"
                                                    data-variant-id="31334628393004" data-product-type=""
                                                    data-customer-ready-visible="">
                                                    <td class="product__image">
                                                        <div class="product-thumbnail ">
                                                            <div class="product-thumbnail__wrapper">
                                                                <img alt="Aviator Jacket in Faux Suede - S / Jet Stream" class="product-thumbnail__image" src="//cdn.shopify.com/s/files/1/0271/0965/4572/products/6950715-1-mint_small.jpg?v=1576642849"></div>
                                                            <span class="product-thumbnail__quantity" aria-hidden="true">1</span>
                                                        </div>

                                                    </td>
                                                    <th class="product__description" scope="row">
                                                        <span class="product__description__name order-summary__emphasis">Aviator Jacket in Faux Suede</span>
                                                        <span class="product__description__variant order-summary__small-text">S / Jet Stream</span>
                                                    </th>
                                                    <td class="product__quantity">
                                                        <span class="visually-hidden">1</span>
                                                    </td>
                                                    <td class="product__price">
                                                        <span class="order-summary__emphasis skeleton-while-loading">$100.00</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div class="order-summary__scroll-indicator" aria-hidden="true" tabindex="-1">
                                            Scroll for more items
                                            <svg aria-hidden="true" focusable="false" class="icon-svg icon-svg--size-12"><use xlink:href="#down-arrow"></use></svg>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-summary__section order-summary__section--total-lines"
                                    data-order-summary-section="payment-lines">
                                    <table class="total-line-table">
                                        <caption class="visually-hidden">Cost summary</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col"><span class="visually-hidden">Description</span></th>
                                                <th scope="col"><span class="visually-hidden">Price</span></th>
                                            </tr>
                                        </thead>
                                        <tbody class="total-line-table__tbody">
                                            <tr class="total-line total-line--subtotal">
                                                <th class="total-line__name" scope="row">Subtotal</th>
                                                <td class="total-line__price">
                                                    <span class="order-summary__emphasis skeleton-while-loading" data-checkout-subtotal-price-target="10000">$100.00</span>
                                                </td>
                                            </tr>
                                            <tr class="total-line total-line--shipping">
                                                <th class="total-line__name" scope="row">
                                                    <span>Shipping</span>
                                                </th>
                                                <td class="total-line__price">
                                                    <span class="skeleton-while-loading order-summary__emphasis" data-checkout-total-shipping-target="0">Free</span>
                                                </td>
                                            </tr>
                                            <tr class="total-line total-line--taxes " data-checkout-taxes="">
                                                <th class="total-line__name" scope="row">Taxes</th>
                                                <td class="total-line__price">
                                                    <span class="order-summary__emphasis skeleton-while-loading" data-checkout-total-taxes-target="2000">$20.00</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot class="total-line-table__footer">
                                            <tr class="total-line">
                                                <th class="total-line__name payment-due-label" scope="row">
                                                    <span class="payment-due-label__total">Total</span>
                                                </th>
                                                <td class="total-line__price payment-due" data-presentment-currency="USD">
                                                    <span class="payment-due__currency remove-while-loading">USD</span>
                                                    <span class="payment-due__price skeleton-while-loading--lg" data-checkout-payment-due-target="12000">$120.00</span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                ${(data.config.activate) ? `<div class="${isFaq ? "" : ""}">${html}</div>` : ""}
                            </div>
                        </div>
                        <div id="partial-icon-symbols" class="icon-symbols" data-tg-refresh="partial-icon-symbols" data-tg-refresh-always="true">
                            <svg xmlns="http://www.w3.org/2000/svg">
                                <symbol id="down-arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M10.817 7.624l-4.375 4.2c-.245.235-.64.235-.884 0l-4.375-4.2c-.244-.234-.244-.614 0-.848.245-.235.64-.235.884 0L5.375 9.95V.6c0-.332.28-.6.625-.6s.625.268.625.6v9.35l3.308-3.174c.122-.117.282-.176.442-.176.16 0 .32.06.442.176.244.234.244.614 0 .848"></path></svg></symbol>
                                <symbol id="checkmark"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="none" stroke-width="2" class="checkmark"><path class="checkmark__circle" d="M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z"></path><path class="checkmark__check" d="M15 24.51l7.307 7.308L35.125 19"></path></svg></symbol>
                                <symbol id="spinner-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0v2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8h2z"></path></svg></symbol>
                            </svg>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
        <script src="https://haloroar.com/js/survey/survey.min.js?v=2.2.20-1.2.0"></script>
      </body>
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
