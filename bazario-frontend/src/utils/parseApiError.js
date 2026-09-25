/**
 * The backend always returns { success, message, data, errors }. `errors` can be
 * a flat DRF validation dict ({ field: ["msg"] }) or just a string. This picks
 * out one readable line so the UI never has to know the shape.
 */
export function parseApiError(error) {
  const body = error?.response?.data;
  if (!body) return "Something went wrong. Check your connection and try again.";

  if (body.errors && typeof body.errors === "object") {
    const firstKey = Object.keys(body.errors)[0];
    const firstValue = body.errors[firstKey];
    if (Array.isArray(firstValue)) return firstValue[0];
    if (typeof firstValue === "string") return firstValue;
  }

  return body.message || "Something went wrong.";
}
