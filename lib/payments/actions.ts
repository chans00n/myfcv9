'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession, getStripePrices, getStripeProducts, getSubscriptionDetails } from './stripe';
import { withTeam } from '@/lib/auth/middleware';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});

export const getSubscriptionDetailsAction = withTeam(async (_, team) => {
  if (!team.stripeCustomerId || !team.stripeSubscriptionId) {
    return null;
  }
  
  return getSubscriptionDetails(team);
});

export async function getPricingData() {
  try {
    const [pricesData, productsData] = await Promise.all([
      getStripePrices(),
      getStripeProducts(),
    ]);

    // Debug logs
    console.log('Products fetched:', productsData.map(p => ({
      id: p.id,
      name: p.name,
      metadata: p.metadata,
    })));

    // Hardcoded IDs from the screenshots
    const monthlyProductId = 'prod_RrinBR6zvKESjS'; // MYFC Monthly Membership
    const yearlyProductId = 'prod_Rrio7EIc5nRCoA'; // MYFC Annual Membership
    
    // Find products by ID first, then fall back to name
    const basePlan = productsData.find(
      (product) => product.id === monthlyProductId
    ) || productsData.find(
      (product) => product.name === 'MYFC Monthly Membership' || product.name === 'Base'
    );
    
    const plusPlan = productsData.find(
      (product) => product.id === yearlyProductId
    ) || productsData.find(
      (product) => product.name === 'MYFC Annual Membership' || product.name === 'Plus'
    );

    // If the new products aren't found, look for "MYFC Membership Access" as a fallback
    const membershipAccess = productsData.find(
      (product) => product.name === 'MYFC Membership Access'
    );

    // Use the first product if none of the specific ones are found
    const finalBasePlan = basePlan || membershipAccess || productsData[0];
    const finalPlusPlan = plusPlan || membershipAccess || productsData[0];

    console.log('Selected products:', {
      monthly: finalBasePlan ? { id: finalBasePlan.id, name: finalBasePlan.name } : null,
      yearly: finalPlusPlan ? { id: finalPlusPlan.id, name: finalPlusPlan.name } : null
    });

    // Find prices for the selected products
    const basePrice = pricesData.find((price) => price.productId === finalBasePlan?.id);
    const plusPrice = pricesData.find((price) => price.productId === finalPlusPlan?.id);

    console.log('Selected prices:', {
      monthly: basePrice ? { id: basePrice.id, amount: basePrice.unitAmount } : null,
      yearly: plusPrice ? { id: plusPrice.id, amount: plusPrice.unitAmount } : null
    });

    return {
      monthly: { 
        id: basePrice?.id, 
        amount: (basePrice?.unitAmount || 1999) / 100 
      },
      yearly: { 
        id: plusPrice?.id, 
        amount: (plusPrice?.unitAmount || 14999) / 100 
      },
    };
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return {
      monthly: { amount: 19.99 },
      yearly: { amount: 14.99 },
    };
  }
}
