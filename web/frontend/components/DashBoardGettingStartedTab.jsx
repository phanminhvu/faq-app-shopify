import { useCallback, useState } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { MdOpenInNew } from "react-icons/md";
import {
  Button,
  FormLayout,
  Icon,
  Link,
  List,
  TextStyle,
} from "@shopify/polaris";
import {
  CircleTickMajor,
  ChatMajor,
  ThemesMajor,
} from "@shopify/polaris-icons";

export default function DashboardGettingStartedTab(
  totalWidget,
  totalTestimonial,
  handleRedirectTestimonials,
  handleRedirectWidgets
) {
  const [selected, setSelected] = useState(1);

  const tabOption = [
    { label: "Connect Store", key: 1, verify: true },
    { label: "Add faqs", key: 2, verify: !!totalTestimonial > 0 },
    { label: "Add widget", key: 3, verify: !!totalWidget > 0 },
  ];

  const handleSelectTab = useCallback((key) => {
    setSelected(key);
  }, []);

  return (
    <div className="tab-step-started">
      <div className="tab-left">
        {tabOption?.map((item, index) => (
          <div
            onClick={() => handleSelectTab(item.key)}
            className={`tab-item ${item.key === selected && "tab-item-active"}`}
            key={index}
          >
            {item?.verify ? (
              <Icon source={CircleTickMajor} color={"success"} />
            ) : // <div className="not-verify" />
            item.key === 2 ? (
              <Icon source={ChatMajor} color={"base"} />
            ) : (
              <Icon source={ThemesMajor} color={"base"} />
            )}{" "}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="tab-right">
        {selected === 1 && (
          <div>
            <FormLayout>
              <TextStyle variation="strong">
                Store connected successfully
              </TextStyle>
              <div>
                If you have any issues on store connection, please reach out to
                our support team at help@simesy.com.
              </div>
            </FormLayout>
          </div>
        )}
        {selected === 2 && (
          <div>
            <FormLayout>
              <TextStyle variation="strong">Add faqs</TextStyle>
              <div>
                Add unlimited faqs to showcase it on your online store
              </div>
              <Button primary onClick={handleRedirectTestimonials}>
                Add faqs
              </Button>
            </FormLayout>
          </div>
        )}
        {selected === 3 && (
          <div>
            <FormLayout>
              <TextStyle variation="strong">Add widget</TextStyle>
              <div>Showcase the best faqs in the best way</div>
              <Button onClick={handleRedirectWidgets} primary>
                Add widget
              </Button>
            </FormLayout>
          </div>
        )}
      </div>
    </div>
  );
}
