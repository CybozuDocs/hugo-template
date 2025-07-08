import type { EnvConfig } from "./env";

/**
 * コンポーネント名とenv値のマッピング
 * FrontMatter内の<ComponentName />をenv値に置換するために使用
 */
export const COMPONENT_TO_ENV_MAPPING: Record<string, keyof EnvConfig> = {
  Kintone: "kintone",
  CybozuCom: "cybozuCom",
  Store: "store",
  Slash: "slash",
  SlashUi: "slashUi",
  Service: "service",
  SlashAdministrators: "slashAdministrators",
  SlashHelp: "slashHelp",
};

/**
 * コンポーネントが対応済みかどうかをチェック
 * @param componentName コンポーネント名
 * @returns 対応済みの場合true
 */
export function isSupportedComponent(componentName: string): boolean {
  return componentName in COMPONENT_TO_ENV_MAPPING;
}

/**
 * コンポーネント名からenv値を取得
 * @param componentName コンポーネント名
 * @param env 環境設定オブジェクト
 * @returns env値
 * @throws コンポーネントが未対応またはenv値が設定されていない場合にエラー
 */
export function getEnvValueForComponent(
  componentName: string,
  env: EnvConfig
): string {
  const envKey = COMPONENT_TO_ENV_MAPPING[componentName];
  
  if (!envKey) {
    throw new Error(`Unsupported component: ${componentName}. Supported components: ${Object.keys(COMPONENT_TO_ENV_MAPPING).join(', ')}`);
  }
  
  const envValue = env[envKey];
  if (!envValue) {
    throw new Error(`Environment value not set for component '${componentName}' (env key: '${envKey}')`);
  }
  
  return envValue as string;
}