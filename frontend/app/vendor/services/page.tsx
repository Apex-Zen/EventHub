'use client';

import { useRef, useState, type FormEvent } from 'react';

type Service = {
  id: number;
  name: string;
  duration: string;
  price: number;
};

type ServiceForm = {
  name: string;
  duration: string;
  price: string;
};

const initialServices: Service[] = [
  { id: 1, name: 'Full-day wedding coverage', duration: '10 hours', price: 180000 },
  { id: 2, name: 'Half-day coverage', duration: '5 hours', price: 95000 },
  { id: 3, name: 'Pre-shoot session', duration: '3 hours', price: 45000 },
  { id: 4, name: 'Drone add-on', duration: '2 hours', price: 25000 },
  { id: 5, name: 'Printed album, 40 pages', duration: '', price: 35000 },
];

const initialForm: ServiceForm = {
  name: '',
  duration: '4 hours',
  price: '60000',
};

const formatPrice = new Intl.NumberFormat('en-US');

export default function VendorServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);

    if (!name) {
      setFormError('Enter a service name.');
      setFormStatus('');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError('Enter a valid, non-negative price.');
      setFormStatus('');
      return;
    }

    if (editingId !== null) {
      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === editingId
            ? { ...service, name, duration: form.duration.trim(), price }
            : service,
        ),
      );
      setFormStatus('Service updated.');
    } else {
      setServices((currentServices) => [
        ...currentServices,
        {
          id: Math.max(0, ...currentServices.map((service) => service.id)) + 1,
          name,
          duration: form.duration.trim(),
          price,
        },
      ]);
      setFormStatus('Service added.');
    }

    setFormError('');
    setEditingId(null);
    setForm(initialForm);
  }

  function editService(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      duration: service.duration,
      price: String(service.price),
    });
    setFormError('');
    setFormStatus('');
    nameInputRef.current?.focus();
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
    setFormError('');
    setFormStatus('');
  }

  return (
    <section className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#111827]">Services</h1>
          <p className="mt-1 text-sm text-[#4B5563]">
            Prices here are what clients see in their package.
          </p>
        </div>
        <button
          type="button"
          onClick={() => nameInputRef.current?.focus()}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start bg-[#286B68] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#205957] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286B68] sm:self-auto"
        >
          <span aria-hidden="true">+</span>
          Add service
        </button>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <section
          aria-label="Your services"
          className="min-w-0 rounded-sm bg-white p-4 shadow-[0_8px_24px_rgba(17,24,39,0.07)] sm:p-5"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-xs sm:text-sm">
              <thead className="bg-[#DBECEC] text-[#4B5563]">
                <tr>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                    Service
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                    Duration
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">
                    Price (LKR)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {services.map((service) => (
                  <tr key={service.id} className="transition-colors hover:bg-[#F8FAFC]">
                    <th
                      scope="row"
                      className="px-3 py-4 text-left font-medium sm:px-4"
                    >
                      {service.name}
                    </th>
                    <td className="px-3 py-4 text-[#4B5563] sm:px-4">
                      {service.duration || '—'}
                    </td>
                    <td className="px-3 py-4 sm:px-4">
                      <div className="flex items-center justify-end gap-3">
                        <span className="whitespace-nowrap">
                          {formatPrice.format(service.price)}
                        </span>
                        {service.name === 'Printed album, 40 pages' && (
                          <button
                            type="button"
                            onClick={() => editService(service)}
                            aria-label={`Edit ${service.name}`}
                            className="inline-flex items-center gap-1 text-[#087E83] hover:text-[#055F63] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087E83]"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 2.651 2.651M4 20l4.5-1 11.013-11.013a1.875 1.875 0 0 0-2.652-2.652L5.848 16.348 4 20Z"
                              />
                            </svg>
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="service-form-title"
          className="rounded-sm bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.07)] sm:p-6"
        >
          <h2
            id="service-form-title"
            className="mb-4 font-serif text-xl font-bold text-[#111827]"
          >
            {editingId === null ? 'Add service' : 'Edit service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="service-name"
                className="mb-1.5 block text-sm font-medium text-[#111827]"
              >
                Service name
              </label>
              <input
                ref={nameInputRef}
                id="service-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((currentForm) => ({ ...currentForm, name: event.target.value }))
                }
                placeholder="e.g. Homecoming coverage"
                className="min-h-10 w-full border border-[#E5E7EB] px-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#286B68] focus:ring-1 focus:ring-[#286B68]"
              />
            </div>
            <div>
              <label
                htmlFor="service-duration"
                className="mb-1.5 block text-sm font-medium text-[#111827]"
              >
                Duration
              </label>
              <input
                id="service-duration"
                name="duration"
                type="text"
                value={form.duration}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    duration: event.target.value,
                  }))
                }
                placeholder="e.g. 4 hours"
                className="min-h-10 w-full border border-[#E5E7EB] px-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#286B68] focus:ring-1 focus:ring-[#286B68]"
              />
            </div>
            <div>
              <label
                htmlFor="service-price"
                className="mb-1.5 block text-sm font-medium text-[#111827]"
              >
                Price (LKR)
              </label>
              <input
                id="service-price"
                name="price"
                type="number"
                min="0"
                step="1"
                required
                value={form.price}
                onChange={(event) =>
                  setForm((currentForm) => ({ ...currentForm, price: event.target.value }))
                }
                className="min-h-10 w-full border border-[#E5E7EB] px-3 text-sm text-[#111827] outline-none focus:border-[#286B68] focus:ring-1 focus:ring-[#286B68]"
              />
            </div>
            {formError && (
              <p role="alert" className="text-sm text-red-700">
                {formError}
              </p>
            )}
            {formStatus && (
              <p role="status" className="text-sm text-[#166534]">
                {formStatus}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="min-h-10 w-full bg-[#286B68] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#205957] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286B68]"
              >
                {editingId === null ? 'Add' : 'Save changes'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="min-h-10 w-full border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286B68]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <aside className="mt-4 flex gap-2.5 rounded-sm bg-[#DBECEC] p-3 text-xs leading-5 text-[#111827]">
            <svg
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#087E83]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
            </svg>
            <p>
              A changed price shows in new client packages. Packages already accepted keep
              the agreed price.
            </p>
          </aside>
        </section>
      </div>
    </section>
  );
}
