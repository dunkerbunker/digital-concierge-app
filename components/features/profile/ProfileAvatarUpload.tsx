// components/features/profile/ProfileAvatarUpload.tsx
'use client';

import { useState, useRef, ChangeEvent, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; // Assuming use of sonner for toasts
import { Loader2, Upload } from 'lucide-react';
import { uploadAvatar } from '@/actions/user.actions'; // Import your server action
import { useRouter } from 'next/navigation'; // To refresh data

interface ProfileAvatarUploadProps {
  userId: string; // Clerk User ID
  currentImageUrl: string | null;
}

export default function ProfileAvatarUpload({ userId, currentImageUrl }: ProfileAvatarUploadProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [isPending, startTransition] = useTransition(); // For server action loading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation (optional)
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast.error('File size should be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error('Invalid file type. Please upload JPG, PNG, WEBP, or GIF.');
        return;
      }

      setAvatarFile(file);
      // Create a temporary preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!avatarFile) {
      toast.warning('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);
    formData.append('userId', userId); // Pass userId if needed by action

    startTransition(async () => {
      try {
        const result = await uploadAvatar(formData); // Call server action

        if (result.success && result.newImageUrl) {
          toast.success('Avatar updated successfully!');
          setPreviewUrl(result.newImageUrl); // Update preview with final URL from storage
          setAvatarFile(null); // Clear selected file
          // Refresh the page or specific data to ensure UI consistency
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to upload avatar.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('An unexpected error occurred during upload.');
      }
    });
  };

  // Trigger hidden file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Calculate fallback initials
  const fallbackInitials = 'NN'; // Replace with actual logic if possible e.g., based on user name props

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={previewUrl ?? undefined} alt="User Avatar" />
        <AvatarFallback>{fallbackInitials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-3">
        {/* Hidden file input */}
        <Input
          id="avatar-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp, image/gif"
        />
        {/* Button to trigger file input */}
        <Button variant="outline" onClick={handleButtonClick} disabled={isPending}>
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
        {/* Button to submit the upload */}
        <Button onClick={handleUpload} disabled={!avatarFile || isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            'Save Avatar'
          )}
        </Button>
        <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 2MB.</p>
      </div>
    </div>
  );
}