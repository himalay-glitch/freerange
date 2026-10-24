"use client";

import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";

export const REQUIRED_MESSAGE = "Please complete this required field.";
export const EMAIL_MESSAGE = "Email must be formatted correctly.";
export const ROLLUP_MESSAGE = "Please complete all required fields.";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface FieldRule {
  required?: boolean;
  email?: boolean;
}

export type Rules = Record<string, FieldRule>;
type Values = Record<string, string>;
type Errors = Record<string, string | undefined>;

function validateValue(rule: FieldRule, value: string): string | undefined {
  const trimmed = value.trim();
  if (rule.required && trimmed === "") return REQUIRED_MESSAGE;
  if (rule.email && trimmed !== "" && !EMAIL_RE.test(trimmed)) return EMAIL_MESSAGE;
  return undefined;
}

/**
 * HubSpot-style client validation shared by the stub forms: errors appear under a field once it
 * has been blurred or the form submitted, plus the "Please complete all required fields." roll-up.
 */
export function useHubSpotValidation(rules: Rules, onValid: () => void) {
  const [values, setValues] = useState<Values>(() => Object.fromEntries(Object.keys(rules).map((k) => [k, ""])));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);

  const errors: Errors = {};
  for (const [name, rule] of Object.entries(rules)) {
    const message = validateValue(rule, values[name] ?? "");
    if (message) errors[name] = message;
  }

  const shows = (name: string) => Boolean(errors[name]) && (attempted || touched[name]);
  const errorFor = (name: string) => (shows(name) ? errors[name] : undefined);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    if (Object.keys(errors).length === 0) onValid();
  };

  const showRollup = attempted && Object.keys(errors).length > 0;
  return { values, errorFor, handleChange, handleBlur, handleSubmit, showRollup };
}

/** The `ul.hs-error-msgs` HubSpot renders under an invalid field. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <ul className="no-list hs-error-msgs inputs-list" role="alert">
      <li>
        <label id={id} className="hs-error-msg hs-main-font-element">
          {message}
        </label>
      </li>
    </ul>
  );
}

/** The form-level roll-up HubSpot shows above the submit button. */
export function ErrorRollup({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="hs_error_rollup">
      <ul className="no-list hs-error-msgs inputs-list" role="alert">
        <li>
          <label className="hs-main-font-element">{ROLLUP_MESSAGE}</label>
        </li>
      </ul>
    </div>
  );
}
