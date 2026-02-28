import { useState, useCallback, useRef } from "react";
import type { JLPTLevel, Sentence } from "../types";
import { getRandomGrammarPoint } from "../data/grammarPoints";
import { useTatoebaSentences } from "./useTatoebaSentences";

interface UseSentenceGeneratorReturn {
  sentence: Sentence | null;
  isGenerating: boolean;
  generateError: string | null;
  generateSentence: (level: JLPTLevel) => Promise<Sentence | null>;
}

export function useSentenceGenerator(): UseSentenceGeneratorReturn {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const { pickSentence } = useTatoebaSentences();
  const requestIdRef = useRef(0);

  const generateSentence = useCallback(
    async (level: JLPTLevel): Promise<Sentence | null> => {
      const requestId = ++requestIdRef.current;
      setIsGenerating(true);
      setGenerateError(null);

      try {
        const grammarPoint = getRandomGrammarPoint(level);
        let result = await pickSentence(level, grammarPoint);

        if (!result) {
          result = await pickSentence(level);
        }

        if (requestId !== requestIdRef.current) {
          return null;
        }

        if (result) {
          setSentence(result);
          return result;
        }

        setGenerateError("No sentences available for this level.");
        return null;
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return null;
        }

        setGenerateError(
          err instanceof Error ? err.message : "Failed to load sentences"
        );
        return null;
      } finally {
        if (requestId === requestIdRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [pickSentence]
  );

  return {
    sentence,
    isGenerating,
    generateError,
    generateSentence,
  };
}
