import React from "react";
import { Badge, Link } from "@shopify/polaris"

const UpgradePlan = () => {
    return (
        <div className="upgrade-plan">
            <Badge status="attention">Premium Feature</Badge>
            {/* {!router.pathname.includes("onboard") &&
                <Link url="/plan">Upgrade now!</Link>
            } */}
        </div>
    )
}

export default UpgradePlan;