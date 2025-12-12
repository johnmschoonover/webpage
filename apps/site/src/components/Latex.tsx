import React from 'react';
import katex from 'katex';

interface LatexProps {
  formula: string;
  block?: boolean;
}

export default function Latex({ formula, block = false }: LatexProps) {
  const html = katex.renderToString(formula, {
    displayMode: block,
    throwOnError: false,
  });

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={block ? 'katex-block block my-4' : 'katex-inline'}
    />
  );
}
