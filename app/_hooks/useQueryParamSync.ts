import { usePathname, useRouter, useSearchParams } from "next/navigation";
/**
 * Custom hook to simplify reading and manipulating URL query parameters
 * with optional synchronization behavior (e.g., resetting `page` when filters change).
 * Made with the idea of resseting pagination filter when another filter changes.
 *
 * @returns Object containing helpers for reading and writing query parameters.
 */

export function useQueryParamSync() {
  const searchParams = useSearchParams();
  const router = useRouter(); // need this to navigate, setting the params doesnt do anything alone
  const pathname = usePathname(); // convenient way to get the current path

  /**
   * Gets the first value of a query parameter by key.
   *
   * @param {string} key - The query parameter name.
   * @returns {string | null} - The value of the parameter, or null if not present.
   */
  function getParam(key: string): string | null {
    return searchParams.get(key);
  }

  /**
   * Gets all values associated with a query parameter key.
   *
   * @param {string} key - The query parameter name.
   * @returns {string[]} - An array of all values, or an empty array if none are present.
   */
  function getAllParams(key: string): string[] {
    return searchParams.getAll(key);
  }

  /**
   * Sets a single query parameter. Optionally synchronizes another parameter.
   *
   * @param {string} key - The parameter to set.
   * @param {string} value - The new value for the parameter.
   * @param {string} [syncKey] - An optional key to sync/reset before setting the new param.
   * @param {string | string[]} [syncValue] - Optional value(s) to set for the syncKey after clearing it.
   */
  function setParam(key: string, value: string, syncKey?: string, syncValue?: string | string[]) {
    const params = new URLSearchParams(searchParams);
    sync(params, syncKey, syncValue);

    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  /**
   * Sets multiple values for a query parameter. Replaces all previous values for the given key.
   *
   * @param {string} key  The parameter to set.
   * @param {string[]} values  An array of values to assign.
   * @param {string} [syncKey]  An optional key to sync/reset before setting the new param.
   * @param {string | string[]} [syncValue] Optional value(s) to set for the syncKey after clearing it.
   */
  function setMultiParams(key: string, values: string[], syncKey?: string, syncValue?: string | string[]) {
    const params = new URLSearchParams(searchParams);
    sync(params, syncKey, syncValue);

    params.delete(key);
    values.forEach((v) => params.append(key, v));
    router.push(`${pathname}?${params.toString()}`);
  }

  /**
   * Appends a single value to a query parameter.
   *
   * @param {string} key - The parameter name.
   * @param {string} value - The value to append.
   * @param {string} [syncKey] - An optional key to sync/reset before setting the new param.
   * @param {string | string[]} [syncValue] - Optional value(s) to set for the syncKey after clearing it.
   */
  function appendParam(key: string, value: string, syncKey?: string, syncValue?: string | string[]) {
    const params = new URLSearchParams(searchParams);

    sync(params, syncKey, syncValue);
    params.append(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  /**
   * Deletes a query parameter completely or a specific value under a multi-valued param.
   *
   * @param {string} key - The parameter name.
   * @param {string} [value] - If provided, removes only the matching value. Otherwise, removes the entire key.
   * @param {string} [syncKey] - An optional key to sync/reset before setting the new param.
   * @param {string | string[]} [syncValue] - Optional value(s) to set for the syncKey after clearing it.
   */
  function deleteParam(key: string, value?: string, syncKey?: string, syncValue?: string | string[]) {
    const params = new URLSearchParams(searchParams);
    sync(params, syncKey, syncValue);
    if (value) params.delete(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  /**
   * Internal helper to synchronize a secondary key before modifying another param.
   *
   * @param {string} [syncKey] - Key to reset (e.g. "page").
   * @param {string | string[]} [syncValue] - New value(s) to assign to syncKey after clearing it.
   */
  function sync(params: URLSearchParams, syncKey?: string, syncValue?: string | string[]) {
    if (syncKey) {
      params.delete(syncKey);
      if (syncValue) {
        if (Array.isArray(syncValue)) syncValue.forEach((v) => params.append(syncKey, v));
        else params.set(syncKey, syncValue);
      }
    }
  }

  return { getParam, getAllParams, setParam, setMultiParams, appendParam, deleteParam };
}
