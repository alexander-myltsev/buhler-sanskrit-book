# Санскрит: элементарный курс Бюлера — упражнения

Электронное издание упражнений из **«Руководства к элементарному курсу санскритского
языка»** Г. Бюлера (Стокгольм, 1923), собранное как сайт на
[Docusaurus](https://docusaurus.io/) и опубликованное на
[GitHub Pages](https://alexander-myltsev.github.io/buhler-sanskrit-book/).

Каждый урок содержит два упражнения — перевод с санскрита и перевод на санскрит
(в уроках 43–47 дан только перевод на санскрит). Санскрит показан в деванагари с
латинской транслитерацией (IAST); грамматические термины размечены, по всему тексту
работает локальный полнотекстовый поиск.

## Источник

- **Оригинал:** Г. Бюлер, «Руководство к элементарному курсу санскритского языка»,
  Стокгольм, 1923.
- **Электронная версия 2.0:** подготовлена **Н. П. Лихушиной**, апрель 2008 г. —
  исправленные переводы отдельных слов, глагольные корни в ступени *guṇa*, приложенный
  русско-санскритский словарик. Полный текст благодарностей и предисловия —
  в [`docs/intro.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/intro.mdx).

## Охват

Оцифровано **20 из 48 уроков** —
[`docs/lesson1.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/lesson1.mdx) …
[`docs/lesson20.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/lesson20.mdx)
плюс [`docs/intro.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/intro.mdx).
Уроки 21–48 пока не оцифрованы.

Словарь к упражнениям — четыре TSV-файла (глаголы / существительные / прилагательные /
прочее) в [`src/dictionary/`](https://github.com/alexander-myltsev/buhler-sanskrit-book/tree/main/src/dictionary),
схема `id⇥word⇥gender⇥translation⇥lesson⇥tag`, рендерится компонентом
[`Dictionary.tsx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/src/components/Dictionary.tsx).

## Разметка в MDX

Уроки пишутся в MDX с несколькими проектными соглашениями:

| Конструкция | Назначение |
|---|---|
| `<Sanscript text="…" from="slp1" to="devanagari"/>` | транслитерация из SLP1 в деванагари ([`Sanscript.tsx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/src/components/Sanscript.tsx)) |
| `<Latin text="…"/>` | латинская транслитерация IAST курсивом ([`Latin.tsx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/src/components/Latin.tsx)) |
| `<Dictionary/>` | таблицы словаря из TSV ([`Dictionary.tsx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/src/components/Dictionary.tsx)) |
| `__GT_термин__` | стилизованный грамматический термин ([`grammaticalTermShorthand`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/src/remark/grammaticalTermShorthand.ts)) |
| `__GTS_slp1__` | «देवनागरी (IAST)» из SLP1 ([`grammaticalTermSanskritShorthand`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/src/remark/grammaticalTermSanskritShorthand.ts)) |

Транслитерация выполняется через
[`@indic-transliteration/sanscript`](https://github.com/indic-transliteration/sanscript.js).

## Сборка

Требуется Node.js 18+. Зависимости зафиксированы в `package-lock.json`, поэтому команды — через npm:

```bash
npm install       # установить зависимости
npm start         # локальный сервер разработки с горячей перезагрузкой
npm run build     # собрать статический сайт в build/
npm run serve     # локально проверить готовую сборку
```

Публикация на GitHub Pages выполняется из ветки `gh-pages` (`npm run deploy`).

## Лицензия и атрибуция

Текст уроков и упражнений и словарные данные (каталоги
[`docs/`](https://github.com/alexander-myltsev/buhler-sanskrit-book/tree/main/docs) и
[`src/dictionary/`](https://github.com/alexander-myltsev/buhler-sanskrit-book/tree/main/src/dictionary))
распространяются по лицензии
[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.ru) —
см. [`LICENSE`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/LICENSE).

При использовании текста указывайте:

> Г. Бюлер, «Руководство к элементарному курсу санскритского языка» (Стокгольм, 1923);
> электронное издание v2.0 © Н. П. Лихушина, апрель 2008;
> редактор исправленного текста — Марцис Гасюнс (Mārcis Gasūns).

Исходный код сайта и его оформление лицензией CC BY 4.0 не охватываются: права на них
принадлежат сопровождающему репозитория.
