import { SiteLayout } from '../../components/layout/SiteLayout';
import { ButtonTertiaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';
import './not-found.css';

export function NotFoundPage() {
  return (
    <SiteLayout>
      <section className="not-found">
        <div className="container">
          <p className="not-found-eyebrow">404</p>
          <h1>PAGE EN CONSTRUCTION</h1>
          <ButtonTertiaire as={SiteLink} href="/">RETOUR À L&apos;ACCUEIL</ButtonTertiaire>
        </div>
      </section>
    </SiteLayout>
  );
}
