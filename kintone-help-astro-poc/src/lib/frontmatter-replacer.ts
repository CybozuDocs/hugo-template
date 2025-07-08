import { env } from "./env";
import { getEnvValueForComponent, isSupportedComponent } from "./component-mapping";

/**
 * FrontMatter内の文字列値内にあるAstroコンポーネント風の文字列を実際のenv値に置換
 * @param value 置換対象の文字列
 * @returns 置換後の文字列
 */
export function replaceFrontMatterString(value: string | undefined): string | undefined {
  if (!value || typeof value !== 'string') {
    return value;
  }
  
  // <ComponentName /> パターンを検索
  const componentRegex = /<(\w+)\s*\/>/g;
  let result = value;
  let match;
  
  while ((match = componentRegex.exec(value)) !== null) {
    const componentName = match[1];
    
    // 対応していないコンポーネントは無視（<Yeah />などの意図的な文字列）
    if (!isSupportedComponent(componentName)) {
      continue;
    }
    
    // 対応済みコンポーネントの場合、env値が未設定ならビルドエラーとする
    const envValue = getEnvValueForComponent(componentName, env);
    result = result.replace(match[0], envValue);
  }
  
  return result;
}

/**
 * FrontMatterオブジェクト内の全ての文字列値を処理して、コンポーネント風文字列を置換
 * @param frontmatter FrontMatterオブジェクト
 * @returns 置換後のFrontMatterオブジェクト
 */
export function replaceFrontMatterComponents(
  frontmatter: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'string') {
      result[key] = replaceFrontMatterString(value);
    } else if (Array.isArray(value)) {
      // 配列の場合、各要素が文字列なら置換処理
      result[key] = value.map(item => 
        typeof item === 'string' ? replaceFrontMatterString(item) : item
      );
    } else {
      // その他の型はそのまま
      result[key] = value;
    }
  }
  
  return result;
}