import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma'; // Assuming you use Prisma

// Import your Client Components for profile editing
import ProfileForm from '@/components/features/profile/ProfileForm'; // Example Form component
import ProfileAvatarUpload from '@/components/features/profile/ProfileAvatarUpload'; // Example Avatar component
import { Separator } from '@/components/ui/separator'; // Example UI component

// Define a type for your user profile data from the database
interface UserProfileData {
  id: string; // Your internal DB id
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  // Add other profile fields from your Prisma schema
  // e.g., phoneNumber: string | null; preferences: JsonValue | null;
}

export default async function ProfilePage() {
  // 1. Get authentication data from Clerk server-side
  const { userId } = auth();
  const clerkUser = await currentUser(); // Get basic Clerk user details

  // 2. Redirect if user is not logged in
  if (!userId || !clerkUser) {
    // Middleware should ideally handle this, but this is a safeguard
    redirect('/sign-in');
  }

  // 3. Fetch user-specific profile data from your database
  //    (You might need to create this record if it doesn't exist yet - e.g., via a webhook)
  let userProfile: UserProfileData | null = null;
  try {
    userProfile = await prisma.user.findUnique({
      where: {
        clerkId: userId, // Find user in your DB by their Clerk ID
      },
    });
  } catch (error) {
    console.error("Failed to fetch user profile from DB:", error);
    // Handle error appropriately - maybe show an error message
    // For now, we'll proceed, ProfileForm might handle null data
  }

  // Prepare data to pass to client components
  // Combine Clerk data (like email) with your DB data, prioritizing your DB
  const profileDataForClient = {
      clerkId: userId,
      // Use email from Clerk as a fallback if not in local profile
      email: userProfile?.email || clerkUser.emailAddresses[0]?.emailAddress || 'No email found',
      firstName: userProfile?.firstName || clerkUser.firstName || '',
      lastName: userProfile?.lastName || clerkUser.lastName || '',
      // Include image URL from Clerk
      imageUrl: clerkUser.imageUrl || null,
      // Add any other fields from userProfile to pass down
      // e.g., phoneNumber: userProfile?.phoneNumber
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="space-y-8">
        {/* Section for Avatar */}
        <div>
           <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
           {/* ProfileAvatarUpload would be a Client Component handling upload logic */}
           <ProfileAvatarUpload
              userId={userId} // Pass userId for potential upload endpoint
              currentImageUrl={profileDataForClient.imageUrl}
           />
        </div>

        <Separator />

        {/* Section for Profile Form */}
        <div>
           <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
           {/* ProfileForm would be a Client Component handling form state and submission */}
           <ProfileForm
              initialData={profileDataForClient}
           />
           {/* Display other non-editable info if needed */}
           {/* <p>Member since: {clerkUser.createdAt.toLocaleDateString()}</p> */}
        </div>

        {/* You could add other sections like Linked Accounts, Security, etc. */}
      </div>
    </div>
  );