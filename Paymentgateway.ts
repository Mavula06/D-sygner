// lib/payment/paymentGateway.ts
import { PaymentConfig } from '../../types';

// ---- PayFast ----
export const payfastGateway = {
  generatePaymentUrl(config: PaymentConfig, merchantId: string, merchantKey: string): string {
    const params = new URLSearchParams({
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: config.returnUrl || 'dsygner://payment/success',
      cancel_url: config.cancelUrl || 'dsygner://payment/cancel',
      notify_url: config.notifyUrl || 'https://your-backend.com/payfast/notify',
      name_first: config.customerName.split(' ')[0],
      name_last: config.customerName.split(' ')[1] || '',
      email_address: config.customerEmail,
      m_payment_id: config.reference,
      amount: config.amount.toFixed(2),
      item_name: config.description,
    });
    // Production: https://www.payfast.co.za/eng/process
    // Sandbox: https://sandbox.payfast.co.za/eng/process
    return `https://sandbox.payfast.co.za/eng/process?${params.toString()}`;
  },

  verifyPayment(pfData: Record<string, string>, passPhrase: string): boolean {
    // In production, verify the ITN signature
    // This requires server-side verification
    return true;
  },
};

// ---- Yoco ----
export const yocoGateway = {
  async createCharge(
    token: string,
    amountInCents: number,
    currency: string,
    description: string,
    secretKey: string
  ): Promise<{ id: string; status: string }> {
    const response = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'X-Auth-Secret-Key': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency,
        description,
      }),
    });
    if (!response.ok) throw new Error('Yoco charge failed');
    return response.json();
  },

  getPublicKey(): string {
    return process.env.EXPO_PUBLIC_YOCO_PUBLIC_KEY || 'pk_test_YOUR_YOCO_KEY';
  },
};

// ---- Peach Payments ----
export const peachGateway = {
  async createCheckout(
    config: PaymentConfig,
    entityId: string,
    accessToken: string
  ): Promise<string> {
    const response = await fetch(
      'https://testsecure.peachpayments.com/v1/checkouts',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          entityId,
          amount: config.amount.toFixed(2),
          currency: config.currency,
          paymentType: 'DB',
          'customer.email': config.customerEmail,
          'customer.givenName': config.customerName,
          merchantTransactionId: config.reference,
          description: config.description,
        }).toString(),
      }
    );
    const data = await response.json();
    return data.id;
  },

  buildCheckoutUrl(checkoutId: string, entityId: string): string {
    return `https://testsecure.peachpayments.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
  },
};

// ---- Unified Payment Interface ----
export const paymentGateway = {
  async initiatePayment(config: PaymentConfig): Promise<{
    url?: string;
    checkoutId?: string;
    provider: string;
  }> {
    switch (config.provider) {
      case 'payfast': {
        const merchantId = process.env.EXPO_PUBLIC_PAYFAST_MERCHANT_ID || '';
        const merchantKey = process.env.EXPO_PUBLIC_PAYFAST_MERCHANT_KEY || '';
        const url = payfastGateway.generatePaymentUrl(config, merchantId, merchantKey);
        return { url, provider: 'payfast' };
      }

      case 'peach': {
        const entityId = process.env.EXPO_PUBLIC_PEACH_ENTITY_ID || '';
        const accessToken = process.env.EXPO_PUBLIC_PEACH_ACCESS_TOKEN || '';
        const checkoutId = await peachGateway.createCheckout(config, entityId, accessToken);
        const url = peachGateway.buildCheckoutUrl(checkoutId, entityId);
        return { url, checkoutId, provider: 'peach' };
      }

      case 'yoco':
        // Yoco requires a web popup/redirect; handled via WebView
        return { provider: 'yoco', url: 'https://online.yoco.com/checkout' };

      default:
        throw new Error(`Unknown payment provider: ${config.provider}`);
    }
  },
};
