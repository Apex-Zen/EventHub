import Image from 'next/image';

interface ProfileAvatarProps {
  alt: string;
  className: string;
  src?: string;
}

export const PROFILE_PHOTO_SRC = '/images/profile-pic.jpg';

export default function ProfileAvatar({
  alt,
  className,
  src = PROFILE_PHOTO_SRC,
}: ProfileAvatarProps) {
  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={96}
        height={96}
        priority
        unoptimized
        className="h-full w-full translate-x-[-20%] translate-y-[7%] scale-[1.5] object-cover"
      />
    </div>
  );
}
