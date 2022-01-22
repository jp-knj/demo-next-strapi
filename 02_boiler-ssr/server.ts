import fs from 'fs'
import path from 'path'
import express from 'express'
import { createServer as createViteServer } from 'vite'


async function createServer() {
    const app = express()

    // ミドルウェアモードで Vite サーバを作成します。これにより、Vite 自体のHTMLが無効になります。
    // ロジックを提供し、親サーバに制御を任せます。
    //
    // ミドルウェアモードで、Vite 自体の HTML 配信ロジックを使用したい場合は、
    // `middlewareMode` として 'html' を使用します(参照 https://ja.vitejs.dev/config/#server-middlewaremode)
    const vite = await createViteServer({
        server: { middlewareMode: 'ssr' }
    })
    // Vite の接続インスタンスをミドルウェアとして使用します。
    app.use(vite.middlewares)

    app.use('*', async (req, res) => {
        // index.html を提供します - 次にこれに取り組みます。
    })

    console.log('Hello World')
    app.listen(3000)
}

createServer()

export {}