// app/api/webhooks/clerk/route.ts

import { NextResponse } from 'next/server';
import { Webhook } from 'svix'; // Webhook verification
import { headers } from 'next/headers'; // To read headers
import { WebhookEvent } from '@clerk/clerk-sdk-node'; // Type for the event payload
import { clerkClient } from '@clerk/clerk-sdk-node'; // Clerk Backend SDK

// Define the default role for new users
const DEFAULT_ROLE = 'guest';

export async function POST(req: Request) {
  // --- 1. Verify Webhook Signature ---

  // Get the webhook secret from environment variables
  // IMPORTANT: Set this in your .env.local file
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set in environment variables.');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get the headers required for Svix verification
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If any required headers are missing, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing Svix headers');
    return new Response('Error occurred -- missing Svix headers', {
      status: 400,
    });
  }

  // Get the request body (payload)
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Attempt to verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent; // Cast to WebhookEvent type
    console.log('Webhook signature verified successfully.');
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return new Response('Error occurred -- invalid signature', {
      status: 400,
    });
  }

  // --- 2. Process the Webhook Event ---

  const eventType = evt.type;
  console.log(`Received webhook event: ${eventType}`);

  // --- Handle User Creation Event ---
  if (eventType === 'user.created') {
    const { id: userId, /* other attributes if needed */ } = evt.data;

    if (!userId) {
      console.error('User ID missing in user.created event data.');
      return new Response('Error occurred -- user ID missing', { status: 400 });
    }

    console.log(`Processing user.created event for user ID: ${userId}`);

    try {
      // Update the user's metadata using the Clerk Backend SDK
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: DEFAULT_ROLE,
          // Add any other default public metadata here
        },
        // You can also set privateMetadata if needed
        // privateMetadata: { ... }
      });
      console.log(`Successfully assigned role '${DEFAULT_ROLE}' to user ${userId}`);
    } catch (error) {
      console.error(`Error setting default role for user ${userId}:`, error);
      // Even if metadata update fails, acknowledge the webhook to prevent retries for this specific error
      // You might want more sophisticated error handling/retries depending on the cause
      return new Response('Error occurred while updating user metadata', { status: 500 });
    }
  }
  // --- Handle Other Event Types (Optional) ---
  // else if (eventType === 'user.updated') {
  //   // Handle user updates if needed
  // }
  else {
    console.log(`Ignoring webhook event type: ${eventType}`);
  }


  // --- 3. Acknowledge Receipt ---
  // Return a 200 OK response to Clerk to acknowledge receipt of the event
  console.log('Webhook processed successfully.');
  return new Response('', { status: 200 });
}

// Added GET handler for simple verification if needed, though POST is used for webhooks
export async function GET() {
    return NextResponse.json({ message: "Clerk Webhook Endpoint Active" });
}