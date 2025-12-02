import type { ModelInfo } from "../model.js"

// Gemini CLI models with free tier pricing (all $0)
export type GeminiCliModelId = keyof typeof geminiCliModels

export const geminiCliDefaultModelId: GeminiCliModelId = "gemini-2.5-pro"

export const geminiCliModels = {
	// 2.5 Pro models
	"gemini-2.5-pro": {
		maxTokens: 64_000,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsNativeTools: true,
		supportsPromptCache: true,
		inputPrice: 2.5, // This is the pricing for prompts above 200k tokens.
		outputPrice: 15,
		cacheReadsPrice: 0.625,
		cacheWritesPrice: 4.5,
		maxThinkingTokens: 32_768,
		supportsReasoningBudget: true,
		requiredReasoningBudget: true,
		tiers: [
			{
				contextWindow: 200_000,
				inputPrice: 1.25,
				outputPrice: 10,
				cacheReadsPrice: 0.31,
			},
			{
				contextWindow: Infinity,
				inputPrice: 2.5,
				outputPrice: 15,
				cacheReadsPrice: 0.625,
			},
		],
	},
	// 2.5 Flash models
	"gemini-2.5-flash": {
		maxTokens: 64_000,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsNativeTools: true,
		supportsPromptCache: true,
		inputPrice: 0.3,
		outputPrice: 2.5,
		cacheReadsPrice: 0.075,
		cacheWritesPrice: 1.0,
		maxThinkingTokens: 24_576,
		supportsReasoningBudget: true,
	},
	// 2.5 Flash Lite models
	"gemini-2.5-flash-lite": {
		maxTokens: 65_536,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsNativeTools: true,
		supportsPromptCache: true,
		inputPrice: 0.1,
		outputPrice: 0.4,
		cacheReadsPrice: 0.025,
		cacheWritesPrice: 1.0,
		supportsReasoningBudget: true,
		maxThinkingTokens: 24_576,
	},
} as const satisfies Record<string, ModelInfo>
