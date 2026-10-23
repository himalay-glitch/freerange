"use client";

import { useId, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import type { FormField } from "@/types/content";
import "@/styles/lets-talk.css";

/**
 * "Get a Free Consultation" module (`.module.lets-talk`) that sits above the footer.
 *
 * DOM, class names and field order mirror the original HubSpot-rendered form
 * (docs/research/raw/home-letstalk.json → formHTML). The form is static: client-side
 * validation of the required fields + email format, then the HubSpot success
 * message replaces the form. No reCAPTCHA / HubSpot scripts are loaded.
 */

const PHONE_NUMBER = "+1.000.000.0000";
const SUCCESS_MESSAGE = "Thanks! We’ll be in touch shortly.";
const REQUIRED_MESSAGE = "Please complete this required field.";
const EMAIL_MESSAGE = "Email must be formatted correctly.";
const ROLLUP_MESSAGE = "Please complete all required fields.";

export const LETS_TALK_FIELDS: FormField[] = [
  { name: "firstname", label: "First name", type: "text", placeholder: "First name", required: true },
  { name: "lastname", label: "Last name", type: "text", placeholder: "Last name", required: true },
  { name: "company", label: "Organization", type: "text", placeholder: "Organization" },
  { name: "phone", label: "Phone number", type: "tel", placeholder: "+1 123456789" },
  { name: "email", label: "Email", type: "email", placeholder: "mail@domain.com", required: true, full: true },
  { name: "utm_term", label: "UTM Term", type: "hidden" },
  { name: "message", label: "Message", type: "textarea", placeholder: "How can we help?" },
];

/** HubSpot's `hs-fieldtype-*` wrapper class per input type. */
const FIELDTYPE: Record<FormField["type"], string> = {
  text: "text",
  email: "text",
  tel: "phonenumber",
  hidden: "text",
  textarea: "textarea",
};

const AUTOCOMPLETE: Record<string, string> = {
  firstname: "given-name",
  lastname: "family-name",
  company: "organization",
  phone: "tel",
  email: "email",
};

const INPUTMODE: Record<string, "text" | "tel" | "email"> = {
  firstname: "text",
  lastname: "text",
  company: "text",
  phone: "tel",
  email: "email",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = Record<string, string>;
type Errors = Record<string, string | undefined>;

function validateField(field: FormField, value: string): string | undefined {
  const trimmed = value.trim();
  if (field.required && trimmed === "") return REQUIRED_MESSAGE;
  if (field.type === "email" && trimmed !== "" && !EMAIL_RE.test(trimmed)) return EMAIL_MESSAGE;
  return undefined;
}

function validateAll(values: Values): Errors {
  const errors: Errors = {};
  for (const field of LETS_TALK_FIELDS) {
    const message = validateField(field, values[field.name] ?? "");
    if (message) errors[field.name] = message;
  }
  return errors;
}

export function LetsTalk() {
  const idPrefix = useId();
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(LETS_TALK_FIELDS.map((f) => [f.name, ""])),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (field: FormField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field.name]: value }));
    // Once a field has been flagged, re-validate live so the error clears as the user fixes it.
    if (errors[field.name]) {
      setErrors((prev) => ({ ...prev, [field.name]: validateField(field, value) }));
    }
  };

  const handleBlur = (field: FormField) => (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!attempted) return;
    setErrors((prev) => ({ ...prev, [field.name]: validateField(field, event.target.value) }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    // Submission stub: the original posts to HubSpot; the clone only shows the inline thank-you.
    setSubmitted(true);
  };

  return (
    <div className="module lets-talk full-width remove-bottom-margin">
      <div className="container">
        <div className="lets-talk-form form">
          <h2 className="title">
            Get a Free Consultation <span className="phone-number">{PHONE_NUMBER}</span>
          </h2>
          <div className="lets-talk-content-wrapper">
            {submitted ? (
              <div className="submitted-message" role="status">
                <p>{SUCCESS_MESSAGE}</p>
              </div>
            ) : (
              <form className="hs-form stacked" method="post" noValidate onSubmit={handleSubmit}>
                {LETS_TALK_FIELDS.map((field) => {
                  const id = `${idPrefix}${field.name}`;
                  const error = errors[field.name];
                  const inputClass = `hs-input${field.type === "textarea" ? " hs-fieldtype-textarea" : ""}${
                    error ? " invalid error" : ""
                  }`;
                  const wrapperClass = `hs_${field.name} hs-${field.name} hs-fieldtype-${FIELDTYPE[field.type]} field hs-form-field`;

                  return (
                    <div
                      key={field.name}
                      className={wrapperClass}
                      style={field.type === "hidden" ? { display: "none" } : undefined}
                    >
                      <label id={`label-${id}`} htmlFor={id}>
                        <span>{field.label}</span>
                        {field.required && <span className="hs-form-required">*</span>}
                      </label>
                      <div className="input">
                        {field.type === "textarea" ? (
                          <textarea
                            id={id}
                            name={field.name}
                            className={inputClass}
                            placeholder={field.placeholder}
                            value={values[field.name]}
                            onChange={handleChange(field)}
                            onBlur={handleBlur(field)}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${id}-error` : undefined}
                          />
                        ) : (
                          <input
                            id={id}
                            name={field.name}
                            type={field.type}
                            className={inputClass}
                            placeholder={field.placeholder}
                            required={field.required}
                            inputMode={INPUTMODE[field.name]}
                            autoComplete={AUTOCOMPLETE[field.name]}
                            value={values[field.name]}
                            onChange={handleChange(field)}
                            onBlur={handleBlur(field)}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${id}-error` : undefined}
                          />
                        )}
                      </div>
                      {error && (
                        <ul className="no-list hs-error-msgs inputs-list" role="alert">
                          <li>
                            <label id={`${id}-error`} className="hs-error-msg hs-main-font-element">
                              {error}
                            </label>
                          </li>
                        </ul>
                      )}
                    </div>
                  );
                })}

                {/*
                  The original form carries a 60px-tall reCAPTCHA field here (badge iframe). No
                  third-party script is loaded in the clone; the empty wrapper keeps the module
                  at its original 759px height and the Submit button at its original position.
                */}
                <div className="hs_recaptcha hs-recaptcha field hs-form-field" aria-hidden="true" />

                {hasErrors && (
                  <div className="hs_error_rollup">
                    <ul className="no-list hs-error-msgs inputs-list" role="alert">
                      <li>
                        <label className="hs-main-font-element">{ROLLUP_MESSAGE}</label>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="hs_submit hs-submit">
                  <div className="actions">
                    <input type="submit" className="hs-button primary large" value="Submit" />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="lets-talk-image">
          {/* Placeholder stand-in for the low-poly parrot illustration (same 1.273 aspect ratio). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- plain <img>, sized by the module CSS */}
          <img
            src="/placeholders/side-illustration.svg"
            alt=""
            width={1518}
            height={1192}
            style={{ maxWidth: 857 }}
          />
        </div>
      </div>
    </div>
  );
}

export default LetsTalk;
