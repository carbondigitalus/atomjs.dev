import type { ReactNode } from 'react';
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
        title: 'Class Components',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                We will only use class-based components. We prefer them over functional components, with the added
                benefits of classes being well-defined and highly structured.
            </>
        ),
    },
    {
        title: 'The Best of Both Worlds',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                With AtomJS, we aim to build a class-based framework that takes the benefits of JSX, React and Vue, and
                combines them into the best possible version.
            </>
        ),
    },
    {
        title: 'Powered by JSX',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Extend or customize your website layout by reusing JSX with our AtomJS framework. Because of this, many
                principles behind React will carry over. Making it an easy transition.
            </>
        ),
    },
];

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className='text--center'>
                <Svg
                    className={styles.featureSvg}
                    role='img'
                />
            </div>
            <div className='text--center padding-horiz--md'>
                <Heading as='h3'>{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className='container'>
                <div className='row'>
                    {FeatureList.map((props, idx) => (
                        <Feature
                            key={idx}
                            {...props}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
