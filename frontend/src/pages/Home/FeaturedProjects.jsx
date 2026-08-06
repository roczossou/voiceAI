// R04 — Projets en avant. Spec §D.1 — les trois entrées et leurs tags de
// domaine sont donnés littéralement par la spec ; les résumés d'AndroCréa et
// des AWARDS sont reconstruits uniquement à partir des mots déjà donnés par
// le dossier (mission, tags), sans ajouter de fait non fourni.
import { useConductorSection } from '../../components/layout/useConductor';
import { SectionCartouche } from '../../components/ui/SectionCartouche';
import { Card } from '../../components/ui/Card';
import { ButtonTertiaire } from '../../components/ui/Button';
import { SiteLink } from '../../components/ui/SiteLink';

const PROJECTS = [
  {
    title: 'ANDROCRÉA',
    href: '/androcrea',
    tags: ['FORMATION', 'DIGITAL', 'CRÉATIVITÉ MOBILE'],
    summary: "Former une nouvelle génération de créatifs capables d'utiliser les technologies numériques pour développer leur carrière.",
    stencil: false,
  },
  {
    title: "DIGIT'S CRÉA AWARDS",
    href: '/digits-crea-awards',
    tags: ['ÉVÉNEMENTIEL', 'DIGITAL', 'VALORISATION DES TALENTS'],
    summary: 'Événement dédié à la valorisation des talents créatifs à travers un dispositif digital et événementiel.',
    stencil: true,
  },
  {
    title: 'MAIRIE DES JEUNES DE COVÈ',
    href: '/leadership',
    tags: ['LEADERSHIP', 'ENGAGEMENT CITOYEN'],
    summary: 'Mandat citoyen au service de la jeunesse de Covè : actions communautaires, initiatives citoyennes et dialogue avec les institutions.',
    stencil: false,
  },
];

export function FeaturedProjects() {
  const sectionRef = useConductorSection('projets-avant', 'Projets en avant');

  return (
    <section ref={sectionRef} id="projets-avant" className="featured-projects">
      <div className="container">
        <SectionCartouche label="PROJETS EN AVANT" />
        <div className="featured-projects-grid">
          {PROJECTS.map((project) => (
            <Card key={project.href} visual={<div className="media-placeholder"><span>VISUEL — </span></div>}>
              <div className="featured-projects-tags">
                {project.tags.map((tag) => <span key={tag} className="featured-projects-tag">{tag}</span>)}
              </div>
              <h3 className={`featured-projects-title${project.stencil ? ' is-stencil' : ''}`}>
                {project.title}
              </h3>
              <p className="featured-projects-summary">{project.summary}</p>
              <ButtonTertiaire as={SiteLink} href={project.href}>EN SAVOIR PLUS</ButtonTertiaire>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
