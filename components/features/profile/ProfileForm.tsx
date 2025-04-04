// components/features/profile/ProfileForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateUserProfile } from '@/actions/user.actions'; // Import your server action
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the shape of the initial data prop
interface ProfileFormProps {
  initialData: {
    clerkId: string;
    email: string; // Usually non-editable from user side
    firstName: string;
    lastName: string;
    // Add other fields if necessary
  };
}

// Define the Zod schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }).max(50),
  lastName: z.string().min(1, { message: 'Last name is required.' }).max(50),
  // Add validation for other fields if they are editable
});

// Infer the type for the form values from the schema
type ProfileFormValues = z.infer<typeof formSchema>;

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Initialize the form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      // Set default values for other editable fields
    },
    mode: 'onChange', // Validate on change
  });

  // Handle form submission
  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateUserProfile({
          clerkId: initialData.clerkId, // Pass the Clerk ID
          firstName: values.firstName,
          lastName: values.lastName,
          // Pass other updated values
        });

        if (result.success) {
          toast.success('Profile updated successfully!');
          form.reset(values); // Reset form with new default values after successful submit
          router.refresh(); // Refresh server components
        } else {
          toast.error(result.error || 'Failed to update profile.');
        }
      } catch (error) {
        console.error('Update profile error:', error);
        toast.error('An unexpected error occurred.');
      }
    });
  };

  return (
    // Use Shadcn UI's Form component
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Non-Editable Email Field (Example) */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
             {/* Display email but make it read-only or disabled */}
            <Input value={initialData.email} readOnly disabled className="bg-muted/50"/>
          </FormControl>
           <FormMessage />
        </FormItem>

        {/* First Name Field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Your first name" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage /> {/* Shows validation errors */}
            </FormItem>
          )}
        />

        {/* Last Name Field */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Your last name" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add other editable fields here following the same pattern */}

        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}