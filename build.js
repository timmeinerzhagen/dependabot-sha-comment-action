#!/usr/bin/env node

(async () => {
    let esbuild = require('esbuild')

    let result = await esbuild.build({
        logLevel: "info",
        entryPoints: [
            'src/index.ts'
        ],
        bundle: true,
        platform: 'node',
        sourcemap: true,
        sourcesContent: false,
        minify: true,
        legalComments: "linked",
        outdir: 'dist',
        metafile: true
    })

    const fs = require('fs')
    fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile, null, 4))
})()
