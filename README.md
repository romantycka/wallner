# Petra Wallner — web

Nová, ručně kódovaná verze webu [petrawallner.eu](https://www.petrawallner.eu/) (původně Wix).
Čistě statický web — HTML + CSS + JS, bez build kroku a bez závislostí.

## Struktura

```
index.html            úvodní stránka (CS)
o-mne.html            O mně
diskografie.html      Diskografie
fan-shop.html         Fan Shop
foto-video.html       Foto & video
nove-album.html       Nové album – objednávka CD (190,- Kč)
impressum.html        Impressum (německy, jako na původním webu)
datenschutz.html      Datenschutzerklärung
de/                   německá verze (stejné názvy souborů)
assets/css/style.css  kompletní styly
assets/js/main.js     menu, animace, přehrávače, lightbox, formuláře
assets/img/           obrázky stažené z původního webu + covery ze Spotify/YouTube
assets/fonts/         self-hostované fonty (Fraunces, Jost, Great Vibes) – kvůli GDPR
```

## Jak to funguje

- **Texty** jsou 1:1 převzaté z původního webu (CS i DE verze). Neměnit bez podkladů od Petry.
- **Spotify / YouTube přehrávače** se načítají až po kliknutí na obálku
  (žádné cookies třetích stran při načtení stránky → není potřeba cookie lišta).
  YouTube běží přes youtube-nocookie.com.
- **Formuláře** (kontakt, objednávka CD, objednávka triček) otevřou e-mailového
  klienta s předvyplněnou zprávou na petra.w.musik@gmail.com (mailto).
  Až bude potřeba „opravdové“ odesílání, dá se zapojit např. Formspree.
- **Audio ukázka** „Věř srdci svému (Album mix)“ z původního webu je nahrazena
  Spotify přehrávačem alba. Pokud Petra dodá mp3, dá se vrátit vlastní přehrávač.

## Lokální náhled

Stačí otevřít `index.html` v prohlížeči, nebo:

```
python3 -m http.server 8000
```

a otevřít http://localhost:8000

## Práce na dvou počítačích (Mac mini ⇄ MacBook)

Repo je na GitHubu: `romantycka/wallner`. Postup vždy:

1. Před začátkem práce: `git pull`
2. Po práci: `git add -A && git commit -m "popis" && git push`

Na MacBooku poprvé: `git clone https://github.com/romantycka/wallner.git`

Náhled běží na GitHub Pages (větev `main`, kořen).
Za ~4 měsíce převod na vlastní doménu přes Cloudflare (stejně jako ostatní weby).
