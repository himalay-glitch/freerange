"use client";

import { useId, useState } from "react";
import { ErrorRollup, FieldError, useHubSpotValidation } from "./hubspot-form-validation";

const RULES = { firstname: {}, lastname: {}, phone: {}, email: { required: true, email: true } };

/**
 * Stub of the HubSpot "download the resource" form that sits in the resource sidebar.
 * Client-side validation mirrors HubSpot's inline messages; submitting shows a thank-you
 * message and nothing is sent anywhere.
 */
export function ResourceDownloadForm({ id }: { id?: string }) {
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);
  const { values, errorFor, handleChange, handleBlur, handleSubmit, showRollup } = useHubSpotValidation(RULES, () =>
    setSubmitted(true),
  );

  if (submitted) {
    return (
      <div className="submitted-message" role="status">
        <p>Thanks — check your inbox.</p>
      </div>
    );
  }

  const field = (name: keyof typeof RULES, label: string, type: string, placeholder: string, autoComplete: string, required = false) => {
    const error = errorFor(name);
    const errorId = `${uid}-${name}-error`;
    return (
      <div className={`hs-form-field hs-fieldtype-${type === "tel" ? "phonenumber" : "text"} field`}>
        <label htmlFor={`${uid}-${name}`}>
          {label}
          {required && <span className="hs-form-required">*</span>}
        </label>
        <div className="input">
          <input
            id={`${uid}-${name}`}
            name={name}
            type={type}
            className={error ? "hs-input invalid error" : "hs-input"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
        <FieldError id={errorId} message={error} />
      </div>
    );
  };

  return (
    <form id={id} className="hs-form hs-custom-form" noValidate onSubmit={handleSubmit}>
      <fieldset className="form-columns-2">
        {field("firstname", "First name", "text", "First name", "given-name")}
        {field("lastname", "Last name", "text", "Last name", "family-name")}
      </fieldset>
      <fieldset className="form-columns-1">{field("phone", "Phone number", "tel", "+1 123456789", "tel")}</fieldset>
      <fieldset className="form-columns-1">{field("email", "Email", "email", "mail@domain.com", "email", true)}</fieldset>
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
      <ErrorRollup show={showRollup} />
      <div className="hs-submit">
        <div className="actions">
          <input type="submit" className="hs-button primary large" value="Download" />
        </div>
      </div>
    </form>
  );
}
