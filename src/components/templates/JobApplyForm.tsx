"use client";

import { useId, useState } from "react";
import { ErrorRollup, FieldError, useHubSpotValidation } from "./hubspot-form-validation";

const RULES = { firstname: { required: true }, lastname: { required: true }, email: { required: true, email: true }, linkedin: {}, message: {} };

/**
 * Stub of the HubSpot job application form under a job post. Client-side validation mirrors
 * HubSpot's inline messages; submitting shows a thank-you message and nothing is sent anywhere.
 */
export function JobApplyForm() {
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);
  const { values, errorFor, handleChange, handleBlur, handleSubmit, showRollup } = useHubSpotValidation(RULES, () =>
    setSubmitted(true),
  );

  if (submitted) {
    return (
      <div className="submitted-message" role="status">
        <p>Thanks — we’ll be in touch.</p>
      </div>
    );
  }

  const field = (name: keyof typeof RULES, label: string, type: string, autoComplete: string, required = false) => {
    const error = errorFor(name);
    const errorId = `${uid}-${name}-error`;
    return (
      <div className="hs-form-field hs-fieldtype-text field">
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
    <form className="hs-form hs-custom-form" noValidate onSubmit={handleSubmit}>
      <fieldset className="form-columns-2">
        {field("firstname", "First name", "text", "given-name", true)}
        {field("lastname", "Last name", "text", "family-name", true)}
      </fieldset>
      <fieldset className="form-columns-1">{field("email", "Email", "email", "email", true)}</fieldset>
      <fieldset className="form-columns-1">{field("linkedin", "LinkedIn Profile", "url", "url")}</fieldset>
      <fieldset className="form-columns-1">
        <div className="hs-form-field hs-fieldtype-textarea field">
          <label htmlFor={`${uid}-message`}>Message</label>
          <div className="input">
            <textarea id={`${uid}-message`} name="message" className="hs-input" rows={6} value={values.message} onChange={handleChange} onBlur={handleBlur} />
          </div>
        </div>
      </fieldset>
      <ErrorRollup show={showRollup} />
      <div className="hs-submit">
        <div className="actions">
          <input type="submit" className="hs-button primary large" value="Apply" />
        </div>
      </div>
    </form>
  );
}
