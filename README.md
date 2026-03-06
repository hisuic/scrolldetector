# ScrollDetector

SNS やショート動画の見過ぎを防ぐための Chrome 拡張です。
Instagram / X(Twitter) / YouTube Shorts を開いたときに確認ダイアログを出し、その後は 5 分ごとに継続確認を表示します。

## 機能

- 対象ページに入ると確認を表示
  - `本当に見る必要がありますか？30分後はHH:MMです。`
- 継続を押すと視聴開始
- 視聴中は 5 分ごとに警告を表示
  - `5分経過しました。続けますか？`
- 対象ページから離れるとタイマーを停止

## 対象サイト

- `*.instagram.com`
- `*.x.com`
- `*.twitter.com`
- `*.youtube.com/shorts/*`

## インストール（開発者モード）

1. Chrome で `chrome://extensions` を開く
2. 右上の「デベロッパー モード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このフォルダ（`scrolldetector`）を選択

## ファイル構成

- `manifest.json`: 拡張機能の設定（MV3）
- `content.js`: 表示条件判定・タイマー制御・UI ロジック
- `content.css`: オーバーレイ UI スタイル

## 動作確認

1. Instagram / X / YouTube Shorts のいずれかを開く
2. 初回確認ダイアログが表示されることを確認
3. 「見る」を押して 5 分待ち、警告ダイアログが表示されることを確認
4. 対象外ページへ移動し、警告が出なくなることを確認

## カスタマイズ

- 警告間隔を変更: `content.js` の `FIVE_MINUTES`
- 初回メッセージ時間（30分後）を変更: `content.js` の `THIRTY_MINUTES`

## ライセンス

必要に応じて追記してください。
