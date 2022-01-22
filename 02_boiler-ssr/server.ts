import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url';
import express from 'express'
import { createServer as createViteServer } from 'vite'


const createServer = async () => {
    const app = express()

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const resolve = (url: string) => path.resolve(__dirname, url);

    // ミドルウェアモードで Vite サーバを作成します。これにより、Vite 自体のHTMLが無効になります。
    // ロジックを提供し、親サーバに制御を任せます。
    //
    // ミドルウェアモードで、Vite 自体の HTML 配信ロジックを使用したい場合は、
    // `middlewareMode` として 'html' を使用します(参照 https://ja.vitejs.dev/config/#server-middlewaremode)
    const vite = await createViteServer({
        server: {
            middlewareMode: 'ssr',
            // テスト中にファイルを頻繁に編集すると、chokidar が変更イベントを見落とすことがあるため、一貫性を保つためにポーリングを行う。
            watch: {
                usePolling: true,
                interval: 100,
            },
        },
    })

    // Vite の接続インスタンスをミドルウェアとして使用します。
    app.use(vite.middlewares)

    app.use('*', async ({originalUrl}, res) => {
        try {
            const url = originalUrl

            // 1. index.html を読み込む
            let template = fs.readFileSync(
                resolve('index.html'),
                'utf-8'
            )

            // 2. Vite を使用して HTML への変換を適用します。これにより Vite の HMR クライアントが定義され
            //    Vite プラグインからの HTML 変換も適用します。 e.g. global preambles
            //    from @vitejs/plugin-react
            template = await vite.transformIndexHtml(url, template)

            // 3. サーバサイドのエントリポイントを読み込みます。 vite.ssrLoadModule は自動的に
            //    ESM を Node.js で使用できるコードに変換します! ここではバンドルは必要ありません
            //    さらに HMR と同様に効率的な無効化を提供します。
            // const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

            let render = (await vite.ssrLoadModule("/src/client/entry-server.tsx")).render;

            // 4. アプリケーションで HTML をレンダリングします。これは entry-server.js からエクスポートされた `render` を使用しています。
            //    関数は適切なフレームワーク SSR API を呼び出します。
            //    e.g. ReactDOMServer.renderToString()
            const appHtml = await render(url)

            // 5. アプリケーションでレンダリングされた HTML をテンプレートに挿入します。
            const html = template.replace(`<!--ssr-outlet-->`, appHtml)

            // 6. レンダリングされた HTML をクライアントに送ります。
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e:any) {
            // エラーが検出された場合は、Vite に stracktrace を修正させて、次のようにマップします。
            // 実際のソースコード
            vite.ssrFixStacktrace(e)
            console.error(e)
            res.status(500).end(e.message)
        }

    })
    const port = process.env.PORT || 1234
    app.listen(Number(port), "0.0.0.0", () => {
        console.log(`App is listening on port ${port}`);
    });
}

createServer()

export {}