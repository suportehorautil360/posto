import { getFieldErrorMessage } from "../lib/get-field-error-message";

type FormFieldErrorProps = {
  message?: string;
};

export { getFieldErrorMessage };

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}
