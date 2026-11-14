# Retall de caselles per entrenar models

Aplicació web (HTML + JavaScript, sense servidor propi) que, a partir d'una foto d'un full amb una graella de caselles,
**detecta cada casella, la retalla i l'envia** a una carpeta del seu nom (`A1/`, `A2/`…). Pensada per recollir
imatges de lletres o números escrits a mà i construir un dataset d'entrenament entre diverses persones.

## Fitxers

| Fitxer | Per a què serveix |
|---|---|
| `index.html` | **Versió 2.** Pàgina que fan servir les persones participants: foto → caselles → enviament |
| `descarregar.html` | Pàgina d'administració: baixa un ZIP amb totes les imatges rebudes |
| `config.js` | URL i clau pública del projecte Supabase |
| `supabase-setup.sql` | Configuració del cub i de la seguretat a Supabase (s'executa una vegada) |
| `descarregar.mjs` | Alternativa per línia d'ordres (Node 18+) per baixar el dataset a disc |
| `plantilla-caselles-A5.pdf` | Full A5 horitzontal amb graella de 9 × 6 caselles de 2 × 2 cm, per imprimir al 100 % |
| `index_v1.html` | **Versió 1** (enfocament amb marques als cantons; no envia al servidor) |
| `plantilla-graella-A5-orientada.pdf` | Plantilla de la versió 1 |

## Funcionalitats de la versió 2

**Captura**
- Càmera del navegador o botó **«Càmera del mòbil»** (obre l'app de càmera del telèfon, amb millor enfocament i resolució).
- També es pot carregar una imatge existent.
- No cal que es vegin les vores del full ni cap marca: només la graella.

**Detecció de caselles**
- Detecta cada casella com un forat tancat entre les línies; les lletres escrites a dins no la molesten.
- Tolera ombres, poca llum, perspectiva, inclinació i caselles que falten.
- Cada casella es redreça individualment (correcció de perspectiva) i es retalla amb una mida uniforme.
- Ajustos: sensibilitat, tancar buits a les línies i retall intern (%).
- Es pot fixar el **nombre de files i columnes**: l'aplicació prova paràmetres fins a trobar-ne exactament aquest nombre
  i **no envia res si el recompte no quadra**, per no barrejar noms.

**Noms**
- El nom depèn només de la posició, mai del contingut: **A1, A2… (primera fila), B1, B2… (segona)**, des de dalt a l'esquerra.
- Botons de gir de 90° per orientar la foto: la casella de dalt a l'esquerra és sempre la A1.
- A cada fitxer s'hi afegeix un número aleatori (`A1_483920.png`) per evitar col·lisions entre persones.

**Caselles buides**
- Es marquen en **vermell** i no es generen ni s'envien.
- Es detecten pel traç que tenen a dins, de manera relativa a la llum local i filtrant el soroll, així que no depèn de la il·luminació.
- Llindar ajustable i possibilitat de desactivar-ho.
- Un clic o toc sobre qualsevol casella la inclou o l'exclou manualment.

**Visualització**
- Vista ajustada perquè la graella es vegi sencera; zoom amb lliscador, botons, roda del ratolí o pessic, i desplaçament arrossegant.
- Adaptada al mòbil: gestos tàctils, botons grans i camps que no provoquen zoom a iOS.

**Enviament**
- Un sol botó, **«Enviar imatges»**: retalla i puja cada imatge a la carpeta de la seva casella, amb progrés
  i botó per reintentar les que fallin. Si dos noms coincideixen, en prova un altre.
- No es demana cap dada personal.

**Descàrrega (`descarregar.html`)**
- L'administrador entra amb correu i contrasenya, veu el recompte d'imatges per casella i baixa un ZIP
  amb una carpeta per casella.

## Posada en marxa

1. Publica el repositori amb **GitHub Pages** (*Settings > Pages > Deploy from a branch > `main` / root*).
   La càmera del navegador necessita HTTPS.
2. Crea un projecte gratuït a [Supabase](https://supabase.com) i executa `supabase-setup.sql` a *SQL Editor*.
3. Copia la **Project URL** i la clau pública (*Project Settings > API Keys*) a `config.js`.
4. Per a la descàrrega: a *Authentication > Users* crea un usuari administrador (*Auto confirm user*)
   i **desactiva «Allow new users to sign up»** a *Authentication > Sign In / Providers*.

## Seguretat

- La clau de `config.js` és pública per disseny. Amb les polítiques de `supabase-setup.sql`, el públic **només pot pujar**
  PNG amb el nom exacte `A1/A1_123456.png` (màx. 3 MB): no pot llegir, llistar, sobreescriure ni esborrar res.
- Només l'usuari administrador pot llegir les imatges. **No posis mai la clau `service_role` ni cap clau secreta al repositori.**
- El pla gratuït de Supabase pausa el projecte després d'una setmana sense activitat: reactiva'l abans d'una sessió.

## Consells de captura

- Enfoca la graella sencera, amb la càmera ben perpendicular al full i bona llum (les ombres no són problema).
- Totes les fotos han de tenir la mateixa orientació perquè cada casella correspongui sempre al mateix contingut.
- Revisa que les caselles verdes siguin les esperades abans d'enviar.

## Tecnologia

HTML i JavaScript purs, [OpenCV.js](https://docs.opencv.org/4.9.0/opencv.js) per a la detecció i
[Supabase Storage](https://supabase.com/docs/guides/storage) per a l'emmagatzematge. Tot el processament de la imatge es fa al navegador.
