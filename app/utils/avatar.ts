import { AVATARS } from "@/app/constants/avatars";

/**
 * Resolve an avatar reference (index or URL) to a valid image source.
 * 
 * @param avatarRef The avatar reference from the backend (e.g., "0", "1" or "https://...")
 * @returns A valid URL string for the avatar
 */
export const getAvatarUrl = (avatarRef: string | undefined): string => {
  if (!avatarRef || avatarRef === "N/A" || avatarRef === "") {
    return AVATARS[0];
  }

  // If it's already a full URL, return it
  if (avatarRef.startsWith("http")) {
    return avatarRef;
  }

  // If it's an index, resolve from AVATARS array
  const index = parseInt(avatarRef);
  if (!isNaN(index) && AVATARS[index]) {
    return AVATARS[index];
  }

  // Fallback to default avatar
  return AVATARS[0];
};
