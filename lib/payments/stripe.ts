import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import {
  getTeamByStripeCustomerId,
  getUser,
  updateTeamSubscription
} from '@/lib/db/queries';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

export async function createCheckoutSession({
  team,
  priceId
}: {
  team: Team | null;
  priceId: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: team.stripeCustomerId || undefined,
    client_reference_id: user.id.toString(),
    customer_email: team.stripeCustomerId ? undefined : user.email,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 7
    }
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(team: Team) {
  if (!team.stripeCustomerId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    // If no product ID is available, create a default configuration
    if (!team.stripeProductId) {
      configuration = await stripe.billingPortal.configurations.create({
        business_profile: {
          headline: 'Manage your subscription'
        },
        features: {
          subscription_cancel: {
            enabled: true,
            mode: 'at_period_end',
            cancellation_reason: {
              enabled: true,
              options: [
                'too_expensive',
                'missing_features',
                'switched_service',
                'unused',
                'other'
              ]
            }
          }
        }
      });
    } else {
      const product = await stripe.products.retrieve(team.stripeProductId);
      if (!product.active) {
        throw new Error("Team's product is not active in Stripe");
      }

      const prices = await stripe.prices.list({
        product: product.id,
        active: true
      });
      if (prices.data.length === 0) {
        throw new Error("No active prices found for the team's product");
      }

      configuration = await stripe.billingPortal.configurations.create({
        business_profile: {
          headline: 'Manage your subscription'
        },
        features: {
          subscription_update: {
            enabled: true,
            default_allowed_updates: ['price', 'quantity', 'promotion_code'],
            proration_behavior: 'create_prorations',
            products: [
              {
                product: product.id,
                prices: prices.data.map((price) => price.id)
              }
            ]
          },
          subscription_cancel: {
            enabled: true,
            mode: 'at_period_end',
            cancellation_reason: {
              enabled: true,
              options: [
                'too_expensive',
                'missing_features',
                'switched_service',
                'unused',
                'other'
              ]
            }
          }
        }
      });
    }
  }

  return stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error('Team not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: plan?.product as string,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: status
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    metadata: product.metadata,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}

export async function getSubscriptionDetails(team: Team) {
  if (!team.stripeCustomerId || !team.stripeSubscriptionId) {
    return null;
  }

  try {
    // Fetch subscription with expanded price and product
    const subscription = await stripe.subscriptions.retrieve(team.stripeSubscriptionId, {
      expand: ['items.data.price.product', 'customer', 'latest_invoice']
    });

    // Fetch payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: team.stripeCustomerId,
      type: 'card',
      limit: 1
    });

    // Fetch recent invoices
    const invoices = await stripe.invoices.list({
      customer: team.stripeCustomerId,
      limit: 5,
      status: 'paid'
    });

    // Get the current price from the subscription
    const currentPrice = subscription.items.data[0]?.price;
    const product = currentPrice?.product as Stripe.Product;
    
    // Get features from product metadata or use default features
    const features = product?.metadata?.features 
      ? JSON.parse(product.metadata.features) 
      : ['Full access to all workouts', 'Mobile-friendly platform'];

    return {
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        price: {
          id: currentPrice?.id,
          unitAmount: currentPrice?.unit_amount,
          currency: currentPrice?.currency,
          interval: currentPrice?.recurring?.interval,
          intervalCount: currentPrice?.recurring?.interval_count
        },
        product: {
          id: product?.id,
          name: product?.name,
          features: features
        }
      },
      paymentMethod: paymentMethods.data.length > 0 ? {
        id: paymentMethods.data[0].id,
        brand: paymentMethods.data[0].card?.brand,
        last4: paymentMethods.data[0].card?.last4,
        expMonth: paymentMethods.data[0].card?.exp_month,
        expYear: paymentMethods.data[0].card?.exp_year
      } : null,
      invoices: invoices.data.map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        date: new Date(invoice.created * 1000),
        url: invoice.hosted_invoice_url
      }))
    };
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return null;
  }
}
