export function getFieldErrorMessage(
  error: { message?: string } | undefined
): string | undefined {
  return error?.message;
}
