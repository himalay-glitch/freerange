"use client";

import { useId, useState, type FormEvent } from "react";

/**
 * Stub of the HubSpot "download the resource" form that sits in the resource sidebar.
 * Submitting shows a thank-you message; nothing is sent anywhere.
 */
export function ResourceDownloadForm({ id }: { id?: string }) {
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="submitted-message" role="status">
        <p>Thanks — check your inbox.</p>
      </div>
    );
  }

  return (
    <form id={id} className="hs-form hs-custom-form" onSubmit={handleSubmit}>
      <fieldset className="form-columns-2">
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-firstname`}>First name</label>
          <div className="input">
            <input id={`${uid}-firstname`} name="firstname" type="text" className="hs-input" placeholder="First name" autoComplete="given-name" />
          </div>
        </div>
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-lastname`}>Last name</label>
          <div className="input">
            <input id={`${uid}-lastname`} name="lastname" type="text" className="hs-input" placeholder="Last name" autoComplete="family-name" />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-phonenumber field">
          <label htmlFor={`${uid}-phone`}>Phone number</label>
          <div className="input">
            <input id={`${uid}-phone`} name="phone" type="tel" className="hs-input" placeholder="+1 123456789" autoComplete="tel" />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-text field">
          <label htmlFor={`${uid}-email`}>
            Email<span className="hs-form-required">*</span>
          </label>
          <div className="input">
            <input id={`${uid}-email`} name="email" type="email" className="hs-input" placeholder="mail@domain.com" autoComplete="email" required />
          </div>
        </div>
      </fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-booleancheckbox field">
          <div className="input">
            <ul className="inputs-list">
              <li className="hs-form-booleancheckbox">
                <label htmlFor={`${uid}-consent`} className="hs-form-booleancheckbox-display">
                  <input id={`${uid}-consent`} name="consent" type="checkbox" className="hs-input" defaultChecked />
                  <span>I agree to receive other communications from Free Range</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </fieldset>
      <div className="hs-submit">
        <div className="actions">
          <input type="submit" className="hs-button primary large" value="Download" />
        </div>
      </div>
    </form>
  );
}
