import type { NextConfig } from "next";

/* O GitHub Pages serve o projeto numa subpasta (/cout-group-website), então a
 * build de publicação precisa de basePath. Em desenvolvimento fica vazio, para
 * o localhost continuar em "/". Ativado por PAGES=1 no comando de build. */
const isPages = process.env.PAGES === "1";
const basePath = isPages ? "/cout-group-website" : "";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export",
        basePath,
        // sem servidor de imagem numa exportação estática
        images: { unoptimized: true },
        // /rota -> /rota/index.html, que é como o Pages resolve diretório
        trailingSlash: true,
      }
    : {}),
  env: {
    // usado no cliente para prefixar caminhos de asset escritos à mão
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
