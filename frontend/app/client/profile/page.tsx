'use client';

import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ProfileAvatar, { PROFILE_PHOTO_SRC } from '@/components/profile/ProfileAvatar';
import { DISTRICT_OPTIONS } from '@/components/events/create/types';

const CURRENCY_OPTIONS = [
  'LKR, Sri Lankan rupee',
  'USD, US dollar',
  'EUR, Euro',
  'GBP, British pound',
];

const initialDetails = {
  firstName: 'Nadeesha',
  lastName: 'Perera',
  email: 'nadeesha.p@gmail.com',
  phone: '+94 77 123 4567',
  district: 'Colombo',
  currency: 'LKR, Sri Lankan rupee',
};

function ProfileSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-[#1B2430]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[49px] w-full appearance-none border border-[#DFE5EB] bg-white px-4 pr-10 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default function ClientProfilePage() {
  const [details, setDetails] = useState(initialDetails);
  const [photoSrc, setPhotoSrc] = useState(PROFILE_PHOTO_SRC);
  const [saveMessage, setSaveMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoSrc.startsWith('blob:')) URL.revokeObjectURL(photoSrc);
    };
  }, [photoSrc]);

  const updateDetail = (field: keyof typeof initialDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setSaveMessage('');
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoSrc(URL.createObjectURL(file));
    event.target.value = '';
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveMessage('Changes saved for this session.');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1224px]">
        <form onSubmit={handleSave}>
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#1B2430]">
                Your profile
              </h1>
              <p className="mt-1 text-[15px] text-[#687383]">
                This is what vendors and the EventHub team see.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <PrimaryButton type="submit" className="h-11 px-6">
                Save changes
              </PrimaryButton>
              {saveMessage && (
                <p role="status" className="text-xs text-[#266665]">
                  {saveMessage}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(270px,0.69fr)_minmax(0,1.7fr)]">
            <aside className="flex flex-col items-center rounded-[4px] border border-gray-100/80 bg-white px-6 py-5 text-center shadow-sm">
              <ProfileAvatar
                src={photoSrc}
                alt="Nadeesha Perera"
                className="h-24 w-24 bg-gray-200"
              />
              <h2 className="mt-4 font-serif text-[26px] font-bold leading-tight text-[#1B2430]">
                Nadeesha Perera
              </h2>
              <p className="mt-3 text-[13px] text-[#8993A2]">
                Client since Aug 2026 · 3 events
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                aria-label="Choose a new profile photo"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex h-12 items-center justify-center border border-[#266665] px-6 text-sm font-medium text-[#266665] transition-colors hover:bg-[#DBECEC]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#266665]"
              >
                Change photo
              </button>
            </aside>

            <div className="space-y-6">
              <section
                aria-labelledby="personal-details-heading"
                className="rounded-[4px] border border-gray-100/80 bg-white p-5 shadow-sm sm:p-5"
              >
                <h2
                  id="personal-details-heading"
                  className="mb-4 font-serif text-2xl font-bold leading-tight text-[#1B2430]"
                >
                  Personal details
                </h2>
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="mb-2 block text-sm font-medium text-[#1B2430]">
                      First name
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      autoComplete="given-name"
                      value={details.firstName}
                      onChange={(event) => updateDetail('firstName', event.target.value)}
                      className="h-[49px] w-full border border-[#DFE5EB] px-4 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="mb-2 block text-sm font-medium text-[#1B2430]">
                      Last name
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      autoComplete="family-name"
                      value={details.lastName}
                      onChange={(event) => updateDetail('lastName', event.target.value)}
                      className="h-[49px] w-full border border-[#DFE5EB] px-4 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1B2430]">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={details.email}
                      onChange={(event) => updateDetail('email', event.target.value)}
                      className="h-[49px] w-full border border-[#DFE5EB] px-4 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1B2430]">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={details.phone}
                      onChange={(event) => updateDetail('phone', event.target.value)}
                      className="h-[49px] w-full border border-[#DFE5EB] px-4 text-sm text-[#1B2430] focus:border-[#266665] focus:outline-none focus:ring-1 focus:ring-[#266665]"
                    />
                  </div>
                  <ProfileSelect
                    id="district"
                    label="District"
                    value={details.district}
                    options={DISTRICT_OPTIONS}
                    onChange={(value) => updateDetail('district', value)}
                  />
                  <ProfileSelect
                    id="preferred-currency"
                    label="Preferred currency"
                    value={details.currency}
                    options={CURRENCY_OPTIONS}
                    onChange={(value) => updateDetail('currency', value)}
                  />
                </div>
              </section>

              <section
                aria-labelledby="security-heading"
                className="rounded-[4px] border border-gray-100/80 bg-white p-5 shadow-sm sm:p-5"
              >
                <h2
                  id="security-heading"
                  className="mb-4 font-serif text-2xl font-bold leading-tight text-[#1B2430]"
                >
                  Sign-in and security
                </h2>
                <div className="space-y-3 text-sm text-[#687383]">
                  <div className="flex items-center justify-between gap-4">
                    <span>Password</span>
                    <span>Last changed 2 months ago</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Google account</span>
                    <span>Connected</span>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center border border-[#266665] px-6 text-sm font-medium text-[#266665] transition-colors hover:bg-[#DBECEC]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#266665]"
                  >
                    Change password
                  </button>
                  <button
                    type="button"
                    className="text-sm font-medium text-[#266665] transition-colors hover:text-[#123B3A] focus:outline-none focus-visible:underline"
                  >
                    Delete account
                  </button>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
