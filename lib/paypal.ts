import "server-only";
import type { BusinessType } from "@/types";

type PayPalEnvironment = "sandbox" | "live";

type PayPalConfig = {
  clientId: string;
  clientSecret: string;
  webhookId: string | null;
  environment: PayPalEnvironment;
  baseUrl: string;
};

type PayPalLink = {
  href: string;
  rel: string;
  method?: string;
};

type PayPalOrderResponse = {
  id: string;
  status?: string;
  links?: PayPalLink[];
};

export type PayPalCaptureResult = {
  status: string;
  captureId: string | null;
};

export type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    custom_id?: string;
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
  };
};

function normaliseEnvironment(value: string | undefined): PayPalEnvironment {
  return value === "live" ? "live" : "sandbox";
}

export function getPayPalConfig(): PayPalConfig | null {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID ?? null;
  const environment = normaliseEnvironment(process.env.PAYPAL_ENVIRONMENT);

  if (!clientId || !clientSecret) return null;

  return {
    clientId,
    clientSecret,
    webhookId,
    environment,
    baseUrl:
      environment === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com",
  };
}

export function isPayPalConfigured() {
  return Boolean(getPayPalConfig());
}

function formatPayPalAmount(pence: number) {
  return (Math.max(0, pence) / 100).toFixed(2);
}

async function getAccessToken(config: PayPalConfig) {
  const credentials = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
  ).toString("base64");
  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("PayPal authentication failed.");
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("PayPal authentication did not return an access token.");
  }

  return data.access_token;
}

export async function createPayPalOrder({
  reference,
  businessType,
  total,
  returnUrl,
  cancelUrl,
}: {
  reference: string;
  businessType: BusinessType;
  total: number;
  returnUrl: string;
  cancelUrl: string;
}) {
  const config = getPayPalConfig();

  if (!config) {
    throw new Error("PayPal is not configured.");
  }

  const accessToken = await getAccessToken(config);
  const response = await fetch(`${config.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: reference,
          custom_id: reference,
          description:
            businessType === "grocery"
              ? `Shop Africana order ${reference}`
              : `Pride of Scotland order ${reference}`,
          amount: {
            currency_code: "GBP",
            value: formatPayPalAmount(total),
          },
        },
      ],
      application_context: {
        brand_name: "Shop Africana & Pride of Scotland",
        landing_page: "LOGIN",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("PayPal order creation failed.");
  }

  const data = (await response.json()) as PayPalOrderResponse;
  const approveUrl = data.links?.find((link) => link.rel === "approve")?.href;

  if (!data.id || !approveUrl) {
    throw new Error("PayPal did not return an approval link.");
  }

  return {
    id: data.id,
    status: data.status ?? "CREATED",
    approveUrl,
  };
}

export async function capturePayPalOrder(orderId: string) {
  const config = getPayPalConfig();

  if (!config) {
    throw new Error("PayPal is not configured.");
  }

  const accessToken = await getAccessToken(config);
  const response = await fetch(
    `${config.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("PayPal order capture failed.");
  }

  const data = (await response.json()) as {
    status?: string;
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{ id?: string; status?: string }>;
      };
    }>;
  };
  const capture = data.purchase_units
    ?.flatMap((unit) => unit.payments?.captures ?? [])
    .find((item) => item.id);

  return {
    status: capture?.status ?? data.status ?? "UNKNOWN",
    captureId: capture?.id ?? null,
  } satisfies PayPalCaptureResult;
}

export async function verifyPayPalWebhookSignature({
  headers,
  event,
}: {
  headers: Headers;
  event: PayPalWebhookEvent;
}) {
  const config = getPayPalConfig();

  if (!config?.webhookId) {
    throw new Error("PayPal webhook verification is not configured.");
  }

  const accessToken = await getAccessToken(config);
  const response = await fetch(
    `${config.baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: config.webhookId,
        webhook_event: event,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("PayPal webhook signature verification failed.");
  }

  const data = (await response.json()) as { verification_status?: string };

  return data.verification_status === "SUCCESS";
}
