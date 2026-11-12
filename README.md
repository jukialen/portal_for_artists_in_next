# Pfartists — Portal for Artists

> Created by [jukialen](https://github.com/jukialen/) · [Live site](https://pfartists.piotrbidny.ovh)

---

## 🌐 Language / 言語 / Język

- [EN — English](#en--english)
- [JA — 日本語](#ja--日本語)
- [PL — Polski](#pl--polski)

---

## EN — English

### About the Project

**Pfartists** is a social platform built exclusively for visual artists — from casual Sunday creators to professionals assembling their virtual portfolios. It is primarily aimed at cartoonists, painters, animators, filmmakers and photographers, though the scope may expand to include other artistic disciplines such as writers and musicians in the future.

The project doubles as a living portfolio of engineering practice: it is built with modern React and Next.js patterns, applied in a real-world product context.

### What the Platform Offers

- **File uploads** — share drawings, photographs, animations and short films in a few clicks.
- **Content feed** — browse the most recent works directly from the home page after signing in.
- **Liked content** — a personal history of everything a user has reacted to.
- **User profiles** — click any nickname to explore another creator's gallery.
- **Category tags** — tag your uploads and filter content by type (manga, realistic, anime, comics, photographs, animations, videos…).
- **Groups** — join existing communities or create your own; group admins can assign moderators and manage posts.
- **Friends** — follow up to five favourite artists and always see their latest work at a glance.
- **Subscription plans** — FREE tier available to everyone; PREMIUM and GOLD tiers unlock higher file-size limits and customer support.
- **Dark mode** — toggled from the Settings page, persisted per user.
- **Full internationalisation** — the UI ships in English, Polish and Japanese (including Hiragana/Katakana/Kanji input validation).
- **PWA support** — installable as a Progressive Web App with a custom service worker built via Workbox.
- **Responsive design** — fluid layout from small smartphones to large-screen TVs.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI library | React 19 |
| Language | TypeScript 5 |
| Styling | CSS Modules + custom reset |
| Component architecture | Atomic Design |
| UI primitives | Ark UI |
| Animations | GSAP + ScrollTrigger |
| Forms & validation | Formik + Yup |
| Backend / database | Supabase (Auth, Storage, Postgres) |
| File uploads | tus-js-client (resumable uploads) |
| Payments | Paddle |
| Internationalisation | next-international |
| HTTP client | Axios |
| Email | MailerSend |
| Monitoring | Grafana Faro (web SDK + tracing) |
| PWA | Workbox CLI + custom service worker |
| Web Push | web-push |
| Linting / formatting | ESLint + Prettier + lint-staged |
| Version control | Git |
| Licence | MIT |

### Project Structure

```
src/
├── app/           # Next.js App Router — pages, layouts, API routes
├── components/    # UI components (Atomic Design: atoms → molecules → organisms)
├── constants/     # Shared constants (metadata helpers, etc.)
├── helpers/       # Pure utility functions
├── languages/     # i18n translation objects (en, pl, ja)
├── locales/       # next-international server/client helpers
├── providers/     # React context providers
├── schemas        # Zod / Yup validation schemas
├── styles/        # Global CSS reset and shared styles
├── types/         # TypeScript type definitions
└── utils/         # Misc utilities
```

### Branches

| Branch | Purpose |
|---|---|
| [`main`](https://github.com/jukialen/portal_for_artists_in_next) | Stable production code |
| [`Beta`](https://github.com/jukialen/portal_for_artists_in_next/tree/Beta) | Pre-release / beta features |
| others | Feature branches |

### Getting Started

```bash
# Install dependencies
bun install

# Start the development server
bun dev

# Build for production
bun run build

# Start the production server
bun start
```

> [!IMPORTANT]
> The project requires environment variables for Supabase, Paddle, MailerSend, Grafana Faro and web-push. Copy the example file and fill in your credentials before running.

### Contributing

Contributions are welcome. Please open an issue first to discuss any significant change, follow the existing code style (Prettier + ESLint will enforce it automatically on commit via lint-staged), and use the Atomic Design conventions when adding new components.

---

## JA — 日本語

### プロジェクトについて

**Pfartists**（ピーエフアーティスツ）は、ビジュアルアーティスト専用のソーシャルプラットフォームです。週末だけ創作を楽しむアマチュアから、仮想ポートフォリオを構築するプロフェッショナルまで、幅広いクリエイターを対象としています。主なターゲットは漫画家・画家・アニメーター・映像作家・写真家ですが、将来的には作家や音楽家など他のアーティストジャンルにも拡大する可能性があります。

また本プロジェクトは、React と Next.js を使ったモダンな Web 開発の実践的な学習・技術ポートフォリオでもあります。

### プラットフォームの主な機能

- **ファイルアップロード** — 描画・写真・アニメーション・短編映像を数クリックで共有できます。
- **コンテンツフィード** — ログイン後、ホーム画面から最新の作品をすぐに閲覧できます。
- **いいね履歴** — 自分が反応したコンテンツの一覧をいつでも確認できます。
- **ユーザープロフィール** — ニックネームをクリックして、他のクリエイターのギャラリーを閲覧できます。
- **カテゴリータグ** — 投稿にタグを付けたり、種別（マンガ・写実・アニメ・コミック・写真・アニメーション・映像など）でフィルタリングできます。
- **グループ** — 既存のコミュニティに参加するか、自分でグループを作成できます。グループ管理者はモデレーターを任命し、投稿を管理できます。
- **友達機能** — 最大5名のお気に入りアーティストをフォローし、最新作をいつでも確認できます。
- **サブスクリプションプラン** — 無料の FREE プランの他、PREMIUM・GOLD プランではファイルサイズ制限の緩和とカスタマーサポートが利用できます。
- **ダークモード** — 設定ページから切り替え可能で、ユーザーごとに保存されます。
- **完全な多言語対応** — 英語・ポーランド語・日本語（ひらがな・カタカナ・漢字の入力バリデーション含む）に対応しています。
- **PWA対応** — Workbox を使ったカスタムサービスワーカーにより、Progressive Web App としてインストール可能です。
- **レスポンシブデザイン** — スマートフォンから大型テレビまで、あらゆる画面サイズに対応しています。

### 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 15（App Router・Turbopack） |
| UI ライブラリ | React 19 |
| 言語 | TypeScript 5 |
| スタイリング | CSS Modules ＋ カスタムリセット |
| コンポーネント設計 | Atomic Design |
| UI プリミティブ | Ark UI |
| アニメーション | GSAP ＋ ScrollTrigger |
| フォーム・バリデーション | Formik ＋ Yup |
| バックエンド / DB | Supabase（認証・ストレージ・Postgres） |
| ファイルアップロード | tus-js-client（再開可能アップロード） |
| 決済 | Paddle |
| 多言語対応 | next-international |
| HTTP クライアント | Axios |
| メール送信 | MailerSend |
| モニタリング | Grafana Faro（Web SDK ＋ トレーシング） |
| PWA | Workbox CLI ＋ カスタムサービスワーカー |
| Web プッシュ | web-push |
| Lint / フォーマット | ESLint ＋ Prettier ＋ lint-staged |
| バージョン管理 | Git |
| ライセンス | MIT |

### プロジェクト構成

```
src/
├── app/           # Next.js App Router — ページ・レイアウト・API ルート
├── components/    # UI コンポーネント（Atomic Design: atoms → molecules → organisms）
├── constants/     # 共通定数（メタデータヘルパーなど）
├── helpers/       # 純粋なユーティリティ関数
├── languages/     # i18n 翻訳オブジェクト（en・pl・ja）
├── locales/       # next-international のサーバー / クライアントヘルパー
├── providers/     # React コンテキストプロバイダー
├── schemas        # バリデーションスキーマ
├── styles/        # グローバル CSS リセットと共通スタイル
├── types/         # TypeScript 型定義
└── utils/         # その他ユーティリティ
```

### ブランチ

| ブランチ | 説明 |
|---|---|
| [`main`](https://github.com/jukialen/portal_for_artists_in_next) | 安定版プロダクションコード |
| [`Beta`](https://github.com/jukialen/portal_for_artists_in_next/tree/Beta) | リリース前 / ベータ機能 |
| その他 | フィーチャーブランチ |

### 開発環境のセットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev

# プロダクションビルド
bun run build

# プロダクションサーバーの起動
bun start
```

> [!IMPORTANT]
> Supabase・Paddle・MailerSend・Grafana Faro・web-push の環境変数が必要です。サンプルファイルをコピーし、実行前に認証情報を設定してください。

### コントリビューション

コントリビューションを歓迎します。大きな変更を加える場合は、まず Issue を開いて議論してください。既存のコードスタイル（Prettier ＋ ESLint がコミット時に lint-staged で自動的に適用されます）に従い、新しいコンポーネントを追加する際は Atomic Design の規約を遵守してください。

---

## PL — Polski

### O projekcie

**Pfartists** to platforma społecznościowa stworzona wyłącznie dla artystów wizualnych — od niedzielnych twórców po profesjonalistów budujących swoje wirtualne portfolio. Skierowana jest przede wszystkim do rysowników, malarzy, animatorów, filmowców i fotografów, choć w przyszłości może zostać rozszerzona o inne dziedziny twórcze, takie jak pisarstwo czy muzyka.

Projekt jest jednocześnie żywym dowodem praktyki inżynierskiej: zbudowany z użyciem nowoczesnych wzorców React i Next.js, zastosowanych w realnym kontekście produktowym.

### Co oferuje platforma

- **Wgrywanie plików** — udostępniaj rysunki, fotografie, animacje i krótkie filmy w kilku kliknięciach.
- **Feed treści** — przeglądaj najnowsze prace bezpośrednio ze strony głównej po zalogowaniu.
- **Polubione treści** — osobista historia wszystkiego, co użytkownik polubił.
- **Profile użytkowników** — kliknij w nick, by zobaczyć galerię innego twórcy.
- **Tagi kategorii** — otaguj swoje pliki i filtruj treści według typu (manga, realistyczne, anime, komiksy, fotografie, animacje, filmy…).
- **Grupy** — dołącz do istniejących społeczności lub utwórz własną; administratorzy grup mogą mianować moderatorów i zarządzać postami.
- **Znajomi** — obserwuj do pięciu ulubionych artystów i miej ich najnowsze prace zawsze pod ręką.
- **Plany subskrypcji** — plan FREE dostępny dla wszystkich; plany PREMIUM i GOLD odblokowują wyższe limity rozmiaru plików i wsparcie klienta.
- **Tryb ciemny** — przełączany ze strony Ustawień, zapamiętywany dla każdego użytkownika.
- **Pełna internacjonalizacja** — interfejs dostępny w języku angielskim, polskim i japońskim (w tym walidacja znaków Hiragany, Katakany i kanji).
- **Obsługa PWA** — aplikacja instalowalna jako Progressive Web App z własnym service workerem zbudowanym przez Workbox.
- **Responsywny design** — płynny układ od małych smartfonów po duże ekrany telewizorów.

### Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Biblioteka UI | React 19 |
| Język | TypeScript 5 |
| Style | CSS Modules + własny reset |
| Architektura komponentów | Atomic Design |
| Prymitywy UI | Ark UI |
| Animacje | GSAP + ScrollTrigger |
| Formularze i walidacja | Formik + Yup |
| Backend / baza danych | Supabase (Auth, Storage, Postgres) |
| Wgrywanie plików | tus-js-client (wznawialne przesyłanie) |
| Płatności | Paddle |
| Internacjonalizacja | next-international |
| Klient HTTP | Axios |
| Wysyłka e-mail | MailerSend |
| Monitoring | Grafana Faro (web SDK + tracing) |
| PWA | Workbox CLI + własny service worker |
| Web Push | web-push |
| Linting / formatowanie | ESLint + Prettier + lint-staged |
| Kontrola wersji | Git |
| Licencja | MIT |

### Struktura projektu

```
src/
├── app/           # Next.js App Router — strony, layouty, trasy API
├── components/    # Komponenty UI (Atomic Design: atoms → molecules → organisms)
├── constants/     # Stałe współdzielone (helpery metadanych itp.)
├── helpers/       # Czyste funkcje pomocnicze
├── languages/     # Obiekty tłumaczeń i18n (en, pl, ja)
├── locales/       # Helpery next-international (server / client)
├── providers/     # Dostawcy kontekstu React
├── schemas        # Schematy walidacji
├── styles/        # Globalny reset CSS i wspólne style
├── types/         # Definicje typów TypeScript
└── utils/         # Różne narzędzia pomocnicze
```

### Gałęzie

| Gałąź | Przeznaczenie |
|---|---|
| [`main`](https://github.com/jukialen/portal_for_artists_in_next) | Stabilny kod produkcyjny |
| [`Beta`](https://github.com/jukialen/portal_for_artists_in_next/tree/Beta) | Wersja przedpremierowa / funkcje beta |
| pozostałe | Gałęzie funkcjonalności |

### Uruchomienie lokalne

```bash
# Instalacja zależności
bun install

# Uruchomienie serwera deweloperskiego
bun dev

# Budowanie wersji produkcyjnej
bun run build

# Uruchomienie serwera produkcyjnego
bun start
```

> [!IMPORTANT]
> Projekt wymaga zmiennych środowiskowych dla Supabase, Paddle, MailerSend, Grafana Faro i web-push. Skopiuj plik przykładowy i uzupełnij swoje dane uwierzytelniające przed uruchomieniem.

### Wkład w projekt

Wkład w projekt jest mile widziany. W przypadku większych zmian prosimy o uprzednie otwarcie issue, by omówić proponowane zmiany. Należy stosować się do istniejącego stylu kodu (Prettier + ESLint wymuszają go automatycznie przy każdym commicie przez lint-staged) oraz przestrzegać konwencji Atomic Design przy dodawaniu nowych komponentów.
