export interface PreprocessorRule {
  /** File path pattern to match (can be partial path, relative to input directory) */
  filePath: string;
  /** Preprocessing function that transforms the content */
  transform: (content: string) => string;
}

export interface PreprocessorConfig {
  /** List of preprocessing rules */
  rules: PreprocessorRule[];
}

export interface PreprocessingResult {
  content: string;
  rulesApplied: string[];
}

/**
 * Apply preprocessing rules to content based on file path
 */
export function applyPreprocessing(
  filePath: string,
  content: string,
  preprocessor?: PreprocessorConfig
): PreprocessingResult {
  if (!preprocessor) {
    return { content, rulesApplied: [] };
  }

  // Find matching rules for this file path
  const matchingRules = preprocessor.rules.filter(rule => 
    filePath.includes(rule.filePath)
  );

  // Apply transformations in order
  let processedContent = content;
  const rulesApplied: string[] = [];
  
  for (const rule of matchingRules) {
    const beforeTransform = processedContent;
    processedContent = rule.transform(processedContent);
    
    // Only add to rulesApplied if content actually changed
    if (beforeTransform !== processedContent) {
      rulesApplied.push(rule.filePath);
    }
  }

  return { content: processedContent, rulesApplied };
}

/**
 * Load preprocessor configuration from a JavaScript file
 */
export async function loadPreprocessorConfig(configPath: string): Promise<PreprocessorConfig> {
  try {
    const module = await import(configPath);
    return module.default || module;
  } catch (error) {
    throw new Error(`Failed to load preprocessor config from ${configPath}: ${error}`);
  }
}