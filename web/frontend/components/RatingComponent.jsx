import { Icon } from "@shopify/polaris";
import { FavoriteMajor, StarOutlineMinor } from "@shopify/polaris-icons";
import React, { useCallback, useState } from "react";
import ModalNoticeRating from "./ModalNoticeRating";


const RatingComponent = ({Rating}) => {
  const [isOpenModalNoticeRating, setIsOpenModalNoticeRating] = useState(false);

  const styles = {
    max: 5,
    counterPosition: "left",
    clearRating: false,
    textPosition: "right",
    tooltipContent: ["Very Bad", "Meh", "Ok", "Good", "Awesome!"],
    ratingValue: ["Very Bad", "Meh", "Ok", "Good", "Awesome!"],
    starStyle: {
      height: "28px",
      backgroundColor: "#F2F2F2",
      paddingLeft: "2px",
      paddingRight: "2px",
      color: "#F58220",
      lineHeight: "28px",
      marginLeft: "5px",
      marginRight: "5px",
    },
    styleConfig: {
      counterStyle: {
        height: "28px",
        backgroundColor: "#F58220",
        paddingLeft: "12px",
        paddingRight: "12px",
        color: "#FFF",
        lineHeight: "28px",
        display: "none",
      },
      starContainer: {
        fontSize: "24px",
        backgroundColor: "transparent",
        height: "28px",
      },
      statusStyle: {
        height: "28px",
        backgroundColor: "#F58220",
        paddingLeft: "12px",
        paddingRight: "12px",
        color: "#FFF",
        lineHeight: "28px",
        minWidth: "100px",
        fontSize: "18px",
        textAlign: "center",
        display: "none",
      },
      tooltipStyle: {
        fontSize: "14px",
        padding: "5px",
      },
    },
  };

  const handleChange = (RatingIndex, RatingValue) => {
    if (RatingIndex > 0 && RatingIndex <= 4) {
      window.open("https://simesy-agency.freshdesk.com/support/tickets/new");
      return;
    }
    if (RatingIndex === 5) {
      setIsOpenModalNoticeRating(true);
    }
  };

  const renderRating = useCallback(() => {
    return (
      Rating ? (
        <div>
          <Rating
            max={styles.max}
            defaultRating={1}
            disabled={false}
            styleConfig={styles.styleConfig}
            counterPosition={styles.counterPosition}
            clearRating={styles.clearRating}
            textPosition={styles.textPosition}
            // tooltipContent={styles.tooltipContent}
            ratingValue={styles.ratingValue}
            onChange={handleChange}
            ActiveComponent={
              <div className="rating-active">
                <Icon source={FavoriteMajor} color="base" />
              </div>
            }
            InActiveComponent={
              <div className="rating">
                <Icon source={StarOutlineMinor} color="base" />
              </div>
            }
          />
          {isOpenModalNoticeRating && (
            <ModalNoticeRating
              handleClose={() => setIsOpenModalNoticeRating(false)}
            />
          )}
        </div>
      ):<div />
    );
  }, [Rating, styles, handleChange]);

  return renderRating();
};

export default RatingComponent;
