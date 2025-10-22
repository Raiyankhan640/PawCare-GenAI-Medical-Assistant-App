"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { PricingTable } from "@clerk/nextjs";

const Pricing = () => {
  // Toggle showing Clerk's PricingTable with an environment variable.
  // Set NEXT_PUBLIC_ENABLE_BILLING=true in .env.local to enable.
  const billingEnabled = process.env.NEXT_PUBLIC_ENABLE_BILLING === "true";

  if (!billingEnabled) {
    // Development-only: render a harmless placeholder and log a notice.
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn(
        "Clerk billing is disabled — PricingTable is hidden. To enable, set NEXT_PUBLIC_ENABLE_BILLING=true or enable billing in the Clerk dashboard: https://dashboard.clerk.com/last-active?path=billing/settings"
      );
    }

    return (
      <Card className="border-emerald-900/30 shadow-lg bg-linear-to-b from-emerald-950/30 to-transparent">
        <CardContent className="p-6 md:p-8">
          {/* Safe placeholder when billing is disabled */}
          <div className="text-muted-foreground">
            <p className="text-white font-semibold mb-2">Pricing is unavailable</p>
            <p className="text-sm">
              Billing is currently disabled for this Clerk project. To show the
              pricing table enable billing in your Clerk dashboard or set
              <code className="mx-1">NEXT_PUBLIC_ENABLE_BILLING=true</code> in
              your <code>.env.local</code> during development.
            </p>
            <p className="mt-3 text-sm">
              <a
                className="underline"
                href="https://dashboard.clerk.com/last-active?path=billing/settings"
                target="_blank"
                rel="noreferrer"
              >
                Open Clerk billing settings
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-900/30 shadow-lg bg-linear-to-b from-emerald-950/30 to-transparent">
      <CardContent className="p-6 md:p-8">
        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Pricing;