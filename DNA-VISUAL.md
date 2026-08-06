# DNA visual da COUT

Toda imagem do site nasce daqui. Não é sugestão de estilo — é a regra que
faz o conjunto parecer **fotografado pela mesma pessoa, no mesmo dia**.

É isso que separa um site caro de um bonito. O Rolex não impressiona por
resolução; impressiona porque nada ali parece ter vindo de lugares
diferentes. Um site com três origens visuais lê como colagem, por melhor
que seja cada peça isolada.

---

## O prompt-base

Cole isto em qualquer geração e troque **apenas** a linha do assunto.

```
[ASSUNTO — o que acontece na cena, em uma frase]

Bright modern clinical environment, immaculate white surfaces, tall glass
partitions. Soft natural daylight raking in from the left. Deep navy and
soft blue accents, cool shadows against warm light. Generous empty space,
restrained composition, shallow depth of field.

Shot on ARRI Alexa with a 50mm prime lens, real photography — not a 3D
render. Restrained luxury editorial aesthetic.

No text, no signage, no logos, no legible typography anywhere in frame.
```

## As sete regras

1. **Luz natural, sempre da esquerda.** Fonte única e suave. Nada de luz
   dura, nada de contraluz dramático — a marca opera em silêncio.
2. **Branco imaculado como base**, navy e azul como acento. Nunca o azul
   dominando a cena; ele aparece em tela, em sombra fria, em detalhe.
3. **Fotografia, não render.** A frase `real photography — not a 3D render`
   é obrigatória. Sem ela o modelo entrega plástico brilhante — foi o que
   aconteceu com as primeiras artes e é o que denuncia IA na hora.
4. **Espaço vazio generoso.** Sempre um terço da imagem sem nada, para o
   texto pousar. Quadro cheio força caixa atrás do texto, e caixa mata a
   elegância.
5. **Nenhum texto dentro da imagem.** Rótulo de interface é sempre
   micro-tipografia ilegível. Texto queimado não reflui no celular, leitor
   de tela não alcança, e o modelo escreve errado.
6. **Humanoide sempre em casco cerâmico branco**, olhar gentil e atento —
   nunca severo. Descrever positivamente (`fully clad in ceramic shell
   panels`); descrição negativa de anatomia derruba no filtro.
7. **Profundidade de campo rasa.** O que importa em foco, o resto suave. É
   o que faz o olho saber para onde olhar sem ninguém mandar.

## O que denuncia amadorismo — e como evitar

| Sintoma | Causa | Correção |
|---|---|---|
| Parece render 3D | falta a frase de fotografia | incluir ARRI + `not a 3D render` |
| Azul-lilás plastificado | modelo sem âncora de luz | `soft natural daylight from the left` |
| Texto inventado na tela | pedir interface legível | `unreadable micro-typography` |
| Cena cheia demais | falta de instrução de espaço | `generous empty space` |
| Faces distorcidas ao ampliar | upscale agressivo | 1080p em vez de 4K a partir de 720p |

## Formato de entrega

- **Capa de seção:** 2560×1440, sangrando de ponta a ponta
- **Card de matéria:** 1920×1080
- **Produto:** 1920×1080, 16:9
- Sempre **WebP**, qualidade 82–88. PNG só como intermediário.
- Nunca SVG do Canva: são dezenas de camadas rasterizadas com máscaras que
  não achatam sem renderizador. **PNG resolve tudo.**

## Grade de cor

Mesmo com origens diferentes, alinhar temperatura e contraste faz o
conjunto virar coleção. Referência: as sombras puxam para navy frio, as
luzes ficam neutras, e o meio-tom nunca satura.
