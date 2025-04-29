import { useQueryState } from "nuqs";

// Now we can get a parentMessageId from the URL
// If we change it in the state, it will be reflected in the URL
// If we change it in the URL, it will be reflected in the state
export const useParentMessageId = () => {
  return useQueryState("parentMessageId");
};
