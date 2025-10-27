import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* 
-A small hook for handling a single query parameter from the URL
*/
export function useQueryParam(key: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get(key);

  function setQueryParam(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  }
  return { queryParam, setQueryParam };
}
