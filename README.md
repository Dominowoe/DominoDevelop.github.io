# DominoDevelop.github.io# Dominik Durček – portfolio

Statický web bez build kroku (HTML + CSS + vanilla JS).

## Struktura

```
index.html       obsah a struktura stránky
css/styles.css   tokeny (:root), layout, komponenty, responzivita; na konci vizuální doladění a portréty
js/main.js       téma, menu, animace, karusel, formulář, particles, skládání portrétu z částic
assets/          hero.webp, about.webp
```

## Spuštění

Nejlépe VS Code → Live Server (případně `python3 -m http.server`). Všechny cesty jsou relativní, takže web funguje i v podsložce (GitHub Pages).
Přes `file://` web funguje také, ale efekt skládání portrétu se vypne (prohlížeč tam zakazuje čtení pixelů obrázku) a portrét se jen zobrazí.

## Obrázky v assets/

| Soubor | Použití | Rozměr |
|---|---|---|
| hero.webp | portrét v hero | 1024×1280 |
| about.webp | sekce O mně | 1100×1100 |

Oba obrázky mají čistě černé pozadí. Do stránky se vkládají přes `mix-blend-mode: screen` (konec `styles.css`), takže černá splyne s pozadím. Ve světlém režimu sedí portréty na tmavém panelu.
Náhledy projektů a kostka jsou kreslené v CSS, obrázky nepotřebují. Chybějící obrázek se nezobrazí a stránka ukáže náhradní záři.

## Efekty

- Portréty se skládají z částic na canvasu (konec `main.js`): hero při načtení, O mně při doscrollování. Přeskočí se při `prefers-reduced-motion` a když prohlížeč nedovolí číst pixely.

## Před nasazením

1. `index.html`: doplnit odkazy na sociální sítě (2×, hero a patička).
2. Formulář: do `data-endpoint` vložit URL služby (Formspree, Netlify…). Prázdné = záložní odeslání přes mailto.
3. Do `<head>` přidat favicon a `og:image`.
4. Volitelně hostovat fonty lokálně (GDPR) místo Google Fonts.
5. Barvy a rozestupy se mění v `:root` na začátku `styles.css`.

