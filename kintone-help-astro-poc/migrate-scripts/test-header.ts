#!/usr/bin/env node
import { transformHeadersToComponents } from './src/lib/string-transformer.js';

const testContent = `## {{< kintone >}} AIラボのサポート{#ai_index_40}

<Kintone /> AIラボのサービスで提供している機能は、開発中の機能であるため、弊社サポートの対象外です。

## モバイルでの利用{#ai_index_50}`;

const usedComponents = new Set<string>();
const result = transformHeadersToComponents(testContent, usedComponents);

console.log('Original:');
console.log(testContent);
console.log('\nTransformed:');
console.log(result);
console.log('\nComponents:', Array.from(usedComponents));