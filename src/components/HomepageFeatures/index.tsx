import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Классический учебник',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Упражнения из «Руководства к элементарному курсу санскритского языка»
        Г.&nbsp;Бюлера (Стокгольм, 1923) — перевод с санскрита и на санскрит
        для каждого урока.
      </>
    ),
  },
  {
    title: 'Электронное издание',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Версия&nbsp;2.0, подготовленная Н.&nbsp;П.&nbsp;Лихушиной (2008):
        исправленные переводы, корни в ступени <em>guṇa</em> и приложенный
        русско-санскритский словарик.
      </>
    ),
  },
  {
    title: 'Деванагари и IAST',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Санскрит показан в деванагари с латинской транслитерацией (IAST),
        грамматические термины размечены, а по всему тексту работает поиск.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
