import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const newsData = [
  {
    id: "1",
    title: "Conférence Internationale sur l'Éducation Durable",
    date: "15 Mai 2023",
    image: "/images/1.jpg",
    content: (
      <>
        <p>
          La Conférence Internationale sur l'Éducation au Développement Durable a réuni des experts, des éducateurs et des décideurs du monde entier pour discuter des meilleures pratiques et des innovations dans le domaine de l'éducation durable. Les participants ont partagé des stratégies pour intégrer les Objectifs de Développement Durable (ODD) dans les programmes scolaires et ont souligné l'importance de la coopération internationale.
        </p>
        <p>
          Pour en savoir plus, consultez le site officiel de l'UNESCO :
          <Link href="https://fr.unesco.org/themes/education-au-developpement-durable" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">Education au Développement Durable - UNESCO</Link>
        </p>
      </>
    ),
  },
  {
    id: "2",
    title: "Nouveau Partenariat pour l'Éducation Climatique",
    date: "3 Avril 2023",
    image: "/images/2.jpg",
    content: (
      <>
        <p>
          Un nouveau partenariat a été établi entre plusieurs organisations internationales pour renforcer l'éducation climatique dans les écoles. Ce partenariat vise à fournir des ressources pédagogiques, des formations pour les enseignants et à sensibiliser les élèves aux enjeux du changement climatique.
        </p>
        <p>
          Plus d'informations sur :
          <Link href="https://en.unesco.org/news/unesco-and-partners-launch-new-initiative-climate-education" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">UNESCO and partners launch new initiative on climate education</Link>
        </p>
      </>
    ),
  },
  {
    id: "3",
    title: "Lancement du Programme de Certification Verte",
    date: "28 Mars 2023",
    image: "/images/3.jpg",
    content: (
      <>
        <p>
          Le nouveau programme de certification verte est désormais disponible pour les établissements scolaires souhaitant valoriser leurs actions en faveur du développement durable. Ce programme encourage les écoles à adopter des pratiques écologiques et à impliquer les élèves dans des projets environnementaux.
        </p>
        <p>
          Pour plus de détails, visitez :
          <Link href="https://www.ecoschools.global/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">Eco-Schools Global</Link>
        </p>
      </>
    ),
  },
  {
    id: "4",
    title: "Atelier sur les Objectifs de Développement Durable",
    date: "15 Mars 2023",
    image: "/images/4.jpg",
    content: (
      <>
        <p>
          Cet atelier a permis aux enseignants et aux élèves de découvrir des méthodes innovantes pour intégrer les ODD dans les programmes scolaires. Des outils interactifs et des ressources pédagogiques ont été présentés pour faciliter l'apprentissage et l'engagement des jeunes.
        </p>
        <p>
          Ressources complémentaires :
          <Link href="https://www.un.org/sustainabledevelopment/fr/objectifs-de-developpement-durable/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">Objectifs de Développement Durable - ONU</Link>
        </p>
      </>
    ),
  },
];

export default function ActualitePage({ params }: { params: { id: string } }) {
  const article = newsData.find((item) => item.id === params.id);
  if (!article) return notFound();

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <Image src={article.image} alt={article.title} width={800} height={400} className="rounded-lg object-cover w-full h-64" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="text-gray-500 mb-6">{article.date}</div>
      <div className="prose prose-lg mb-8">{article.content}</div>
      <Link href="/" className="text-blue-600 underline">← Retour à l'accueil</Link>
    </main>
  );
} 