import { vendorCategories, validateIdentityDocument } from "../../lib/auth";
import TextField from "../TextField";


export type VendorFieldsProps = {
  values: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    serviceCategory: string;
    businessRegistrationNumber: string;
    nicNumber: string;
    identityDocument: File | null;
  };
  actions: {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setEmail: (value: string) => void;
    setPhoneNumber: (value: string) => void;
    setServiceCategory: (value: string) => void;
    setBusinessRegistrationNumber: (value: string) => void;
    setNicNumber: (value: string) => void;
    setIdentityDocument: (value: File | null) => void;
    setError: (value: string) => void;
    resetMessages: () => void;
  };
};

export default function VendorFields({ values, actions }: VendorFieldsProps) {
  const { firstName, lastName, email, phoneNumber, serviceCategory, businessRegistrationNumber, nicNumber, identityDocument } = values;
  const { setFirstName, setLastName, setEmail, setPhoneNumber, setServiceCategory, setBusinessRegistrationNumber, setNicNumber, setIdentityDocument, setError, resetMessages } = actions;
  return (

    <>
      <p className="vendor-form-section">ABOUT YOU</p>
      <div className="field-row">
        <div className="field">
          <TextField
            id="first-name"
            label="First name"
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Kasun"
            value={firstName}
            onValueChange={setFirstName}
            required
          />
        </div>
        <div className="field">
          <TextField
            id="last-name"
            label="Last name"
            type="text"
            autoComplete="family-name"
            placeholder="e.g. Fernando"
            value={lastName}
            onValueChange={setLastName}
            required
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@business.lk"
            value={email}
            onValueChange={setEmail}
            required
          />
        </div>
        <div className="field">
          <TextField
            id="phone-number"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            placeholder="+94 71 555 0192"
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            required
          />
        </div>
      </div>
    
      <p className="vendor-form-section">BUSINESS</p>
      <div className="field">
        <label className="field-label" htmlFor="service-category">Service category</label>
        <select
          className="text-input vendor-select"
          id="service-category"
          value={serviceCategory}
          onChange={(event) => setServiceCategory(event.target.value)}
          required
        >
          <option value="" disabled>Choose a category</option>
          {vendorCategories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <p className="field-hint">Photography, catering, decoration, sound and lighting, venue, cake, transport.</p>
      </div>
      <div className="field">
        <TextField
          id="business-registration"
          label="Business Registration Number (BRN)"
          type="text"
          placeholder="e.g. PV 00123456"
          value={businessRegistrationNumber}
          onValueChange={setBusinessRegistrationNumber}
          required
        />
      </div>
    
      <p className="vendor-form-section">ID VERIFICATION</p>
      <div className="field">
        <TextField
          id="nic-number"
          label="NIC number"
          type="text"
          autoComplete="off"
          placeholder="e.g. 199012345678"
          value={nicNumber}
          onValueChange={setNicNumber}
        />
      </div>
      <div className="vendor-upload-divider"><span>or</span></div>
      <label className="vendor-upload" htmlFor="identity-document">
        <strong>{identityDocument ? identityDocument.name : "Upload NIC or passport (front and back)"}</strong>
        <span>JPG, PNG or PDF, up to 5 MB</span>
        <input
          id="identity-document"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            const documentError = file ? validateIdentityDocument(file) : null;
            if (documentError) {
              setIdentityDocument(null);
              event.target.value = "";
              setError(documentError);
              return;
            }
            setIdentityDocument(file);
            resetMessages();
          }}
        />
      </label>
      <p className="vendor-document-note">Demo mode: identity documents are not uploaded or saved. A secure verification service is not connected yet.</p>
    </>
  );
}
