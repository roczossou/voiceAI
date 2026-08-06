// Bascule Link (react-router) / <a> classique selon la cible : les fichiers
// (PDF, etc.) et les URLs externes ne doivent jamais passer par le router client.
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const EXTERNAL_RE = /^(https?:)?\/\//;
const FILE_RE = /\.[a-z0-9]+$/i;

export const SiteLink = forwardRef(function SiteLink({ href, ...rest }, ref) {
  const isExternalOrFile = EXTERNAL_RE.test(href) || FILE_RE.test(href.split('?')[0]);

  if (isExternalOrFile) {
    return <a ref={ref} href={href} {...rest} />;
  }

  return <Link ref={ref} to={href} {...rest} />;
});
