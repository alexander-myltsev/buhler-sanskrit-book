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

Оцифровано **40 из 48 уроков** —
[`docs/lesson1.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/lesson1.mdx) …
[`docs/lesson40.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/lesson40.mdx)
плюс [`docs/intro.mdx`](https://github.com/alexander-myltsev/buhler-sanskrit-book/blob/main/docs/intro.mdx).
Уроки 41–48 пока не оцифрованы.

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

## Лицензия

Лицензия на текст и код готовится отдельно (см. открытый вопрос об атрибуции
электронного издания). До её принятия репозиторий распространяется без явной лицензии;
все права на электронную версию упражнений принадлежат Н. П. Лихушиной (2008), на сайт
и разметку — сопровождающему репозитория.
