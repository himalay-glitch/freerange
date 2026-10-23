"use client";

import { useId, useState, type FormEvent } from "react";

/**
 * Stub of the HubSpot job application form under a job post.
 * Submitting shows a thank-you message; nothing is sent anywhere.
 */
export function JobApplyForm() {
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="submitted-message" role="status">
        <p>Thanks — we’ll be in touch.</p>
      </div>
    );
  }

  return (
    <form className="hs-form hs-custom-form" onSubmit={handleSubmit}>
      <fieldset className="form-columns-2">
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-firstname`}>
            First name<span className="hs-form-required">*</span>
          </label>
          <div className="input">
            <input id={`${uid}-firstname`} name="firstname" type="text" className="hs-input" autoComplete="given-name" required />
          </div>
        </div>
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-lastname`}>
            Last name<span className="hs-form-required">*</span>
          </label>
          <div className="input">
            <input id={`${uid}-lastname`} name="lastname" type="text" className="hs-input" autoComplete="family-name" required />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-email`}>
            Email<span className="hs-form-required">*</span>
          </label>
          <div className="input">
            <input id={`${uid}-email`} name="email" type="email" className="hs-input" autoComplete="email" required />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-linkedin`}>LinkedIn Profile</label>
          <div className="input">
            <input id={`${uid}-linkedin`} name="linkedin" type="url" className="hs-input" autoComplete="url" />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-textarea field">
          <label htmlFor={`${uid}-message`}>Message</label>
          <div className="input">
            <textarea id={`${uid}-message`} name="message" className="hs-input" rows={6} />
          </div>
        </div>
      </fieldset>
      <div className="hs-submit">
        <div className="actions">
          <input type="submit" className="hs-button primary large" value="Apply" />
        </div>
      </div>
    </form>
  );
}
