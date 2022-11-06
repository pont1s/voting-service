import {
  createFilterWrapper,
  debounceFilter,
  DebounceFilterOptions,
  FunctionArgs,
} from '@/utils/filters';

import { MaybeComputedRef } from '@/utils/types';

export function useDebounce<T extends FunctionArgs>(
  fn: T,
  ms: MaybeComputedRef<number> = 200,
  options: DebounceFilterOptions = {},
): T {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn,
  );
}
