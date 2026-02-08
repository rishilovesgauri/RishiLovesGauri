import { ReactNode } from 'react';

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section(props: SectionProps) {
  const { id, title, children } = props;
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section-inner">
        <h2 id={`${id}-title`} className="section-title">
          {title}
        </h2>
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}


