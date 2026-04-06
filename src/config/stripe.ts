import Stripe from 'stripe';
import { getEnv, loadEnv } from './env';

loadEnv();

export const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));
