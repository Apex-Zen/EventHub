'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

type HallType = 'Indoor' | 'Outdoor' | 'Indoor + Outdoor';
type HallStatus = 'Active' | 'Paused';
type SlotId = 'day' | 'night';

interface HallSlot {
  id: SlotId;
  name: string;
  enabled: boolean;
  start: string;
  end: string;
  price: string;
}

interface HallFormState {
  name: string;
  type: HallType;
  guests: string;
  description: string;
  photo: File | null;
  slots: HallSlot[];
  status: HallStatus;
}

interface HallFormErrors {
  name?: string;
  guests?: string;
  slotsEnabled?: string;
  dayStart?: string;
  dayEnd?: string;
  dayPrice?: string;
  nightStart?: string;
  nightEnd?: string;
  nightPrice?: string;
}

const inputClassName =
  'w-full p-3 border border-line rounded-sm text-sm focus:outline-none focus:border-green-500';
const labelClassName =
  'block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2';

export default function AddHall() {
  const router = useRouter();
  const [form, setForm] = useState<HallFormState>({
    name: '',
    type: 'Indoor',
    guests: '',
    description: '',
    photo: null,
    slots: [
      { id: 'day', name: 'Day slot', enabled: true, start: '08:00', end: '15:00', price: '450000' },
      { id: 'night', name: 'Night slot', enabled: true, start: '18:00', end: '23:30', price: '650000' },
    ],
    status: 'Active',
  });
  const [errors, setErrors] = useState<HallFormErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoPreviewUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl.current) {
        URL.revokeObjectURL(photoPreviewUrl.current);
      }
    };
  }, []);

  function updateForm<K extends keyof HallFormState>(
    key: K,
    value: HallFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateSlot(
    slotId: SlotId,
    field: keyof Omit<HallSlot, 'id' | 'name'>,
    value: boolean | string,
  ) {
    setForm((current) => ({
      ...current,
      slots: current.slots.map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot,
      ),
    }));
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const photo = event.target.files?.[0] ?? null;
    if (photoPreviewUrl.current) {
      URL.revokeObjectURL(photoPreviewUrl.current);
    }

    const previewUrl = photo ? URL.createObjectURL(photo) : null;
    photoPreviewUrl.current = previewUrl;
    setPhotoPreview(previewUrl);
    updateForm('photo', photo);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: HallFormErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Hall name is required.';
    }
    if (!form.guests || Number(form.guests) < 1) {
      nextErrors.guests = 'Enter at least 1 guest.';
    }

    const enabledSlots = form.slots.filter((slot) => slot.enabled);
    if (enabledSlots.length === 0) {
      nextErrors.slotsEnabled = 'Enable at least one time slot.';
    }

    enabledSlots.forEach((slot) => {
      const startErrorKey = `${slot.id}Start` as 'dayStart' | 'nightStart';
      const endErrorKey = `${slot.id}End` as 'dayEnd' | 'nightEnd';
      const priceErrorKey = `${slot.id}Price` as 'dayPrice' | 'nightPrice';

      if (!slot.start) {
        nextErrors[startErrorKey] = 'Start time is required.';
      }
      if (!slot.end) {
        nextErrors[endErrorKey] = 'End time is required.';
      } else if (slot.start && slot.start >= slot.end) {
        nextErrors[endErrorKey] = 'End time must be after the start time.';
      }
      if (!slot.price || !Number.isFinite(Number(slot.price)) || Number(slot.price) <= 0) {
        nextErrors[priceErrorKey] = 'Price must be greater than 0.';
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const hall = {
      ...form,
      name: form.name.trim(),
      guests: Number(form.guests),
      slots: form.slots.map((slot) => ({
        ...slot,
        price: Number(slot.price),
      })),
    };

    // TODO: replace with POST /api/vendor/halls when backend is ready
    console.log('New hall (placeholder for the future API call):', hall);
    router.push('/vendor/halls');
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink-900 font-serif mb-1">Add hall</h1>
          <p className="text-sm text-ink-600">
            Add a new hall or space. You can set up its time slots and pricing below.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/vendor/halls"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm rounded-sm text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="add-hall-form"
            className="px-5 py-2.5 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors text-sm rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Save hall
          </button>
        </div>
      </div>

      <form id="add-hall-form" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-sm border border-line shadow-sm p-6">
              <h2 className="font-serif font-bold text-xl text-ink-900 mb-6">Hall details</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="hall-name" className={labelClassName}>Hall name</label>
                  <input
                    id="hall-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateForm('name', event.target.value)}
                    placeholder="Grand Ballroom"
                    aria-describedby={errors.name ? 'hall-name-error' : undefined}
                    className={inputClassName}
                  />
                  {errors.name && <p id="hall-name-error" className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="hall-type" className={labelClassName}>Hall type</label>
                    <select
                      id="hall-type"
                      value={form.type}
                      onChange={(event) => updateForm('type', event.target.value as HallType)}
                      className={`${inputClassName} bg-white`}
                    >
                      <option>Indoor</option>
                      <option>Outdoor</option>
                      <option>Indoor + Outdoor</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="hall-guests" className={labelClassName}>Maximum guests</label>
                    <input
                      id="hall-guests"
                      type="number"
                      min="1"
                      required
                      value={form.guests}
                      onChange={(event) => updateForm('guests', event.target.value)}
                      aria-describedby={errors.guests ? 'hall-guests-error' : undefined}
                      className={inputClassName}
                    />
                    {errors.guests && <p id="hall-guests-error" className="text-xs text-red-600 mt-1">{errors.guests}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="hall-description" className={labelClassName}>Features / description</label>
                  <textarea
                    id="hall-description"
                    rows={4}
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="Air conditioned, stage, parking for 100 vehicles"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="hall-photo" className={labelClassName}>Hall photo</label>
                  <label
                    htmlFor="hall-photo"
                    className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-line bg-gray-50 p-4 text-center focus-within:border-green-500 focus-within:outline-none"
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Selected hall preview" className="max-h-48 w-full object-contain" />
                    ) : (
                      <>
                        <span className="text-sm font-medium text-ink-900">Choose a hall photo</span>
                        <span className="text-xs text-ink-600 mt-1">JPG or PNG, landscape works best</span>
                      </>
                    )}
                  </label>
                  <input
                    id="hall-photo"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                  {photoPreview && <p className="text-xs text-ink-600 mt-2">JPG or PNG, landscape works best</p>}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-sm border border-line shadow-sm p-6">
              <h2 className="font-serif font-bold text-xl text-ink-900">Time slots</h2>
              <p className="text-sm text-ink-600 mt-1 mb-6">Set the sessions and pricing offered each day.</p>
              {errors.slotsEnabled && (
                <p id="slots-enabled-error" className="text-xs text-red-600 mb-4">{errors.slotsEnabled}</p>
              )}
              <div className="space-y-6">
                {form.slots.map((slot) => {
                  const startErrorId = `${slot.id}-start-error`;
                  const endErrorId = `${slot.id}-end-error`;
                  const priceErrorId = `${slot.id}-price-error`;
                  const startError = errors[`${slot.id}Start` as 'dayStart' | 'nightStart'];
                  const endError = errors[`${slot.id}End` as 'dayEnd' | 'nightEnd'];
                  const priceError = errors[`${slot.id}Price` as 'dayPrice' | 'nightPrice'];

                  return (
                    <fieldset key={slot.id} className="border-t border-line pt-5">
                      <legend className="sr-only">{slot.name}</legend>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm text-ink-900">{slot.name}</h3>
                        <div className="flex items-center gap-2">
                          <input
                            id={`${slot.id}-enabled`}
                            type="checkbox"
                            checked={slot.enabled}
                            onChange={(event) => updateSlot(slot.id, 'enabled', event.target.checked)}
                            aria-describedby={errors.slotsEnabled ? 'slots-enabled-error' : undefined}
                            className="h-4 w-4 accent-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          />
                          <label htmlFor={`${slot.id}-enabled`} className="text-sm text-ink-900">Enabled</label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`${slot.id}-start`} className={labelClassName}>Start time</label>
                          <input
                            id={`${slot.id}-start`}
                            type="time"
                            value={slot.start}
                            disabled={!slot.enabled}
                            onChange={(event) => updateSlot(slot.id, 'start', event.target.value)}
                            aria-describedby={startError ? startErrorId : undefined}
                            className={`${inputClassName} disabled:bg-gray-100`}
                          />
                          {startError && <p id={startErrorId} className="text-xs text-red-600 mt-1">{startError}</p>}
                        </div>
                        <div>
                          <label htmlFor={`${slot.id}-end`} className={labelClassName}>End time</label>
                          <input
                            id={`${slot.id}-end`}
                            type="time"
                            value={slot.end}
                            disabled={!slot.enabled}
                            onChange={(event) => updateSlot(slot.id, 'end', event.target.value)}
                            aria-describedby={endError ? endErrorId : undefined}
                            className={`${inputClassName} disabled:bg-gray-100`}
                          />
                          {endError && <p id={endErrorId} className="text-xs text-red-600 mt-1">{endError}</p>}
                        </div>
                        <div>
                          <label htmlFor={`${slot.id}-price`} className={labelClassName}>Price in LKR</label>
                          <input
                            id={`${slot.id}-price`}
                            type="number"
                            min="0"
                            value={slot.price}
                            disabled={!slot.enabled}
                            onChange={(event) => updateSlot(slot.id, 'price', event.target.value)}
                            aria-describedby={priceError ? priceErrorId : undefined}
                            className={`${inputClassName} disabled:bg-gray-100`}
                          />
                          {priceError && <p id={priceErrorId} className="text-xs text-red-600 mt-1">{priceError}</p>}
                        </div>
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <section className="bg-white rounded-sm border border-line shadow-sm p-6">
              <h2 className="font-serif font-bold text-xl text-ink-900 mb-6">Status</h2>
              <label htmlFor="hall-status" className={labelClassName}>Hall status</label>
              <select
                id="hall-status"
                value={form.status}
                onChange={(event) => updateForm('status', event.target.value as HallStatus)}
                className={`${inputClassName} bg-white`}
              >
                <option>Active</option>
                <option>Paused</option>
              </select>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}
