# 環境変数プロップ削除作業の履歴

## ユーザーからの指示

```
I need to update all the astro files that receive 'env' as a prop to instead import it directly. Here are the patterns to transform:

1. For files using BaseProps:
   - Keep `interface Props extends BaseProps {}`
   - Add `import { env } from "@/lib/env";` at the top
   - Change `const { env, page } = Astro.props;` to `const { page } = Astro.props;`

2. For files with custom env interface:
   - Remove env from interface Props
   - Add `import { env } from "@/lib/env";` at the top  
   - Remove env from destructuring

3. For files that have env in destructuring with other props:
   - Remove env from the destructuring
   - Add the import

Please update all the following files:
- /src/layouts/components/AlternateLink.astro
- /src/layouts/components/AnnouncementBanner.astro
- [39 files total]

Skip /src/components/Enabled.astro as it was already updated.

Make sure to handle each file carefully, checking its current pattern and applying the appropriate transformation.
```

## 実行した作業

### 1. 移行計画の作成
- migration-docs/0001_env-prop-removal/plan.md を作成
- 3つの変換パターンを詳細に文書化
- 対象ファイル39個をリスト化

### 2. ファイルの変換作業
39個のAstroコンポーネントファイルを以下のパターンで変更：

#### BasePropsパターン（大部分のファイル）
```astro
// 変更前
---
import type { BaseProps } from './types';

interface Props extends BaseProps {}

const { env, page } = Astro.props;

// 変更後
---
import { env } from "@/lib/env";
import type { BaseProps } from './types';

interface Props extends BaseProps {}

const { page } = Astro.props;
```

#### カスタムインターフェースパターン
```astro
// 変更前
interface Props {
  curnode: PageProps;
  target: PageProps;
  env: EnvProps;
}

const { curnode, target, env } = Astro.props;

// 変更後
import { env } from "@/lib/env";

interface Props {
  curnode: PageProps;
  target: PageProps;
}

const { curnode, target } = Astro.props;
```

#### プロップ渡しの削除
envをプロップとして他のコンポーネントに渡している箇所も修正：
```astro
// 変更前
<SomeComponent env={env} page={page} />

// 変更後
<SomeComponent page={page} />
```

### 3. 更新されたファイル一覧
1. AlternateLink.astro
2. AnnouncementBanner.astro
3. ArticleLink.astro
4. Breadcrumb.astro
5. BreadcrumbNav.astro
6. Disclaimer.astro
7. Disclaimer2.astro
8. Disclaimer3.astro
9. Enquete.astro
10. Footer.astro
11. FooterGr6.astro
12. GoToTop.astro
13. Head.astro
14. Header.astro
15. HeaderLabel.astro
16. IdLink.astro
17. LangSelector.astro
18. LatestPageGuide.astro
19. LocaleModal.astro
20. MegaNav.astro
21. MegaNavGr.astro
22. MegaNavGrMegaPanel.astro
23. MegaNavGrSectBar.astro
24. MegaNavKt.astro
25. Nav.astro
26. NavMainMenu.astro
27. PreviewList.astro
28. Related.astro
29. SearchBox.astro
30. SupportInquiry.astro
31. Title.astro
32. TreeNav.astro
33. TreeNav2.astro
34. TreeNav3.astro
35. TreeNavMainMenu.astro
36. TreeNavStatic.astro
37. TreeNavStaticMenu.astro
38. TreeNavToggle.astro
39. VideoNav.astro

### 4. 特別な対応が必要だったケース

#### 連鎖的な変更
- コンポーネント間でenvプロップを渡している箇所では、呼び出し元と呼び出し先の両方を修正
- 例：Header → SearchBox, Header → LangSelector
- 例：MegaNav → MegaNavKt/MegaNavGr → さらに下位コンポーネント

#### Titleコンポーネントの頻繁な使用
- 多くのコンポーネントでTitleコンポーネントを使用
- `<Title page={page} env={env} />` → `<Title page={page} />`

#### TreeNavの複雑な階層
- TreeNav関連コンポーネントは深い階層でenvを渡していた
- TreeNav → TreeNavMainMenu → Title の連鎖を全て修正

## 結果

- 39個すべてのファイルで`env`プロップの削除完了
- 各ファイルに`import { env } from "@/lib/env";`を追加
- コンポーネント間のプロップ渡しからenvを削除
- インターフェース定義からenvプロパティを削除

## 検証

実行前後の比較例：
- AlternateLink.astro: ✅ envインポート追加、プロップから削除済み
- Header.astro: ✅ envインポート追加、SearchBoxとLangSelectorへのプロップ渡し削除済み

全てのファイルで一貫した変更パターンが適用されている。