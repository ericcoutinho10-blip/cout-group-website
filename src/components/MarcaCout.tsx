/* A marca entra como MÁSCARA CSS, não como imagem colorida: o alfa do PNG
 * define a forma e a cor vem do `currentColor`. Assim o mesmo arquivo serve
 * branco sobre o filme e navy sobre o Universo, acompanhando a inversão do
 * header sem precisar de dois arquivos nem de troca de src. */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const RAZAO = 232 / 160; // proporção do arquivo original

export default function MarcaCout({
  altura = "1.5rem",
  className = "",
}: {
  altura?: string;
  className?: string;
}) {
  const mascara = `url(${BASE}/brand/cout-mark.png) no-repeat center / contain`;
  return (
    <span
      role="img"
      aria-label="COUT"
      className={className}
      style={{
        display: "inline-block",
        height: altura,
        width: `calc(${altura} * ${RAZAO})`,
        backgroundColor: "currentColor",
        WebkitMask: mascara,
        mask: mascara,
        flexShrink: 0,
      }}
    />
  );
}
