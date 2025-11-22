import { useCallback, useState } from "react";
import type { User } from "firebase/auth";
import type {
  AiQuestGenerationRequest,
  AiQuestSuggestion,
} from "@/lib/sideQuestAdmin";
import { useSideQuestAdminApi } from "./useSideQuestAdminApi";

type AiState = {
  suggestions: AiQuestSuggestion[];
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: AiState = {
  suggestions: [],
  loading: false,
  error: null,
};

export const useAiQuestGenerator = (mobileUser: User | null) => {
  const api = useSideQuestAdminApi(mobileUser);
  const [state, setState] = useState<AiState>(INITIAL_STATE);

  const generate = useCallback(
    async (payload: AiQuestGenerationRequest) => {
      if (!mobileUser) {
        throw new Error("Mobile admin session is not ready.");
      }
      setState({ suggestions: [], loading: true, error: null });
      try {
        const response = await api<{ suggestions: AiQuestSuggestion[] }>(
          "/api/admin/sidequests/ai/generate",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        setState({ suggestions: response.suggestions, loading: false, error: null });
      } catch (error) {
        setState({
          suggestions: [],
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to generate quests.",
        });
      }
    },
    [api, mobileUser]
  );

  const clear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    generate,
    clear,
  };
};


