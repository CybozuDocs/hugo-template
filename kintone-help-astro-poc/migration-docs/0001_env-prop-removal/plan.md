# 環境変数プロップ削除の実行プラン

## 概要
すべてのAstroファイルで、`env`をプロップとして受け取る代わりに、直接インポートするように変更する。

## 変換パターン

### 1. BasePropsを使用するファイル
```astro
// 変更前
interface Props extends BaseProps {}
const { env, page } = Astro.props;

// 変更後
import { env } from "@/lib/env";
interface Props extends BaseProps {}
const { page } = Astro.props;
```

### 2. カスタムenvインターフェースを持つファイル
```astro
// 変更前
interface Props {
  env: Env;
  // その他のプロップ
}
const { env, ...otherProps } = Astro.props;

// 変更後
import { env } from "@/lib/env";
interface Props {
  // その他のプロップ（envを削除）
}
const { ...otherProps } = Astro.props;
```

### 3. 分割代入でenvを含むファイル
```astro
// 変更前
const { env, prop1, prop2 } = Astro.props;

// 変更後
import { env } from "@/lib/env";
const { prop1, prop2 } = Astro.props;
```

## 対象ファイル（39ファイル）
1. /src/layouts/components/AlternateLink.astro
2. /src/layouts/components/AnnouncementBanner.astro
3. /src/layouts/components/ArticleLink.astro
4. /src/layouts/components/Breadcrumb.astro
5. /src/layouts/components/BreadcrumbNav.astro
6. /src/layouts/components/Disclaimer.astro
7. /src/layouts/components/Disclaimer2.astro
8. /src/layouts/components/Disclaimer3.astro
9. /src/layouts/components/Enquete.astro
10. /src/layouts/components/Footer.astro
11. /src/layouts/components/FooterGr6.astro
12. /src/layouts/components/GoToTop.astro
13. /src/layouts/components/Head.astro
14. /src/layouts/components/Header.astro
15. /src/layouts/components/HeaderLabel.astro
16. /src/layouts/components/IdLink.astro
17. /src/layouts/components/LangSelector.astro
18. /src/layouts/components/LatestPageGuide.astro
19. /src/layouts/components/LocaleModal.astro
20. /src/layouts/components/MegaNav.astro
21. /src/layouts/components/MegaNavGr.astro
22. /src/layouts/components/MegaNavGrMegaPanel.astro
23. /src/layouts/components/MegaNavGrSectBar.astro
24. /src/layouts/components/MegaNavKt.astro
25. /src/layouts/components/Nav.astro
26. /src/layouts/components/NavMainMenu.astro
27. /src/layouts/components/PreviewList.astro
28. /src/layouts/components/Related.astro
29. /src/layouts/components/SearchBox.astro
30. /src/layouts/components/SupportInquiry.astro
31. /src/layouts/components/Title.astro
32. /src/layouts/components/TreeNav.astro
33. /src/layouts/components/TreeNav2.astro
34. /src/layouts/components/TreeNav3.astro
35. /src/layouts/components/TreeNavMainMenu.astro
36. /src/layouts/components/TreeNavStatic.astro
37. /src/layouts/components/TreeNavStaticMenu.astro
38. /src/layouts/components/TreeNavToggle.astro
39. /src/layouts/components/VideoNav.astro

## 注意事項
- `/src/components/Enabled.astro`は既に更新済みのためスキップ
- 各ファイルの現在のパターンを確認し、適切な変換を適用する
- import文は他のimport文と一緒に、ファイルの上部に配置する