export function onRequest(context) {
  const code = context.params.code; // /r/<code> の <code>
  const url = new URL(context.request.url);
  const origin = url.origin;

  // OG用（とりあえず固定画像でOK）
  const ogImage = `${origin}/og.png`;
  const shareUrl = `${origin}/r/${encodeURIComponent(code)}`;

  // 人間向け：あなたの既存の結果URL形式に合わせてここを調整
  // 例: /?s=... だけで結果が開く設計ならこれでOK
  const redirectTo = `${origin}/?s=${encodeURIComponent(code)}`;

  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />

  <title>non-IQ 診断結果</title>

  <meta property="og:title" content="non-IQ 診断結果" />
  <meta property="og:description" content="non-IQ 6軸レーダー（プロトタイプ）" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${shareUrl}" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${ogImage}" />

  <meta http-equiv="refresh" content="0;url=${redirectTo}" />
</head>
<body>
  <noscript>
    <p>結果ページへ移動: <a href="${redirectTo}">${redirectTo}</a></p>
  </noscript>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // 共有リンクは更新頻度が低い想定なので、いったん短めキャッシュ推奨
      "cache-control": "public, max-age=300",
    },
  });
}
