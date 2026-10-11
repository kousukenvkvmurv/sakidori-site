# 結婚相談所サキドリ ホームページ

GitHub に置いて Netlify で公開するためのファイル一式です。
公開後は `https://（あなたのドメイン）/admin` の管理画面から、スマホでもブログ・文章・料金・写真・文字サイズを変更できます。保存すると、数分でサイトに反映されます。

## ファイルの中身

| 場所 | 内容 |
|---|---|
| `content/site.json` | ホームページの文章・料金・写真・文字サイズ（管理画面から編集） |
| `content/blog/` | ブログ記事（1記事 = 1ファイル。管理画面から作成） |
| `images/` | 写真とロゴ。管理画面から追加した写真は `images/uploads/` に入ります |
| `src/template.html` | デザイン（レイアウト・色・動き）。変更は Claude に頼んでください |
| `admin/` | 管理画面（Sveltia CMS）とその設定 |
| `build.mjs` / `netlify.toml` | Netlify が公開時に自動で使う設定 |

## 公開までの手順

### 1. GitHub にファイルを置く
1. https://github.com でアカウントを作ります（無料）。
2. 右上の「＋」→「New repository」。名前を `sakidori-site` にして作成します（Private で構いません）。
3. 「uploading an existing file」から、この ZIP を展開した**中身すべて**（`admin` `content` `images` `src` `build.mjs` `netlify.toml` など）をドラッグして「Commit changes」。
4. （設定済み）`admin/config.yml` には `kousukenvkvmurv/sakidori-site` が入っています。

### 2. Netlify で公開する
1. https://www.netlify.com で「Sign up」→ GitHub でログインします。
2. 「Add new project」→「Import an existing project」→ GitHub →`sakidori-site` を選びます。
3. 設定は `netlify.toml` から自動で入るので、そのまま「Deploy」。1〜2分で `○○.netlify.app` のアドレスで公開されます。

### 3. 管理画面のログインを設定する（最初の1回だけ）
1. GitHub の右上アイコン →「Settings」→ 左下「Developer settings」→「OAuth Apps」→「New OAuth App」。
   - Application name：`サキドリ管理画面`
   - Homepage URL：Netlify のサイトアドレス（例 `https://○○.netlify.app`）
   - Authorization callback URL：`https://api.netlify.com/auth/done`
2. 作成後に表示される「Client ID」と、「Generate a new client secret」で出る「Client secret」を控えます。
3. Netlify のプロジェクト画面 →「Project configuration」→「Security（Access & security）」→「OAuth」→「Install provider」→ GitHub を選び、2 の 2つを貼り付けて保存します。
4. `https://○○.netlify.app/admin` を開き、「GitHub でサインイン」できれば完了です。

### 4. 独自ドメインをつなぐ
1. Netlify のプロジェクト画面 →「Domain management」→「Add a domain」。
2. Netlify でそのまま購入するか、お名前.com などで買ったドメインを入力し、画面の案内どおりに DNS を設定します。
3. HTTPS（鍵マーク）は Netlify が自動で設定します。
4. ドメインを変えたら、GitHub の OAuth App の「Homepage URL」も新しいドメインに直しておきます。

### 5. Google に登録する
1. https://search.google.com/search-console で「プロパティを追加」→ ドメインを登録します。
2. 数日〜数週間で検索結果に出るようになります。

## ほかの人も編集できるようにする（例：美和さん）
1. 美和さんに GitHub アカウントを作ってもらいます。
2. GitHub の `sakidori-site` →「Settings」→「Collaborators」→「Add people」で招待します。
3. 招待を承認すると、`/admin` から同じようにログインして編集できます。

## 管理画面の使い方
- **ブログ**：「新規作成」→ タイトル・日付・本文を書いて保存。「サイトに公開する」を外すと下書き（サイトには出ません）。
- **ホームページ**：トップ、お悩み、特徴、料金、活動の流れ、カウンセラー紹介、よくあるご質問、予約先、写真、文字サイズを変更できます。
- 保存すると GitHub に記録され、Netlify が自動で公開し直します（反映まで1〜3分）。
- 変更の履歴は GitHub に残るので、前の状態に戻すこともできます。

## メモ
- IBJ バナーの画像は IBJ のサーバーから読み込みます。
- フォント（しっぽり明朝・Noto Sans JP）は Google Fonts から読み込みます。
