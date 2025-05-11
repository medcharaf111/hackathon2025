import Image from "next/image";
import { notFound } from "next/navigation";

const programData = {
  "education-au-changement-climatique": {
    title: "Éducation au Changement Climatique",
    description:
      "L'éducation au changement climatique vise à sensibiliser et à former les citoyens sur les causes, les conséquences et les solutions au réchauffement climatique. Elle encourage l'adoption de comportements responsables et la participation à des actions pour un avenir durable.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    moreInfo:
      "Le changement climatique est l'un des plus grands défis de notre époque. Selon le GIEC, il est urgent d'agir pour limiter le réchauffement à 1,5°C. L'éducation joue un rôle clé pour informer, motiver et mobiliser les jeunes et les adultes. Pour en savoir plus, consultez le site de l'UNESCO sur l'éducation au changement climatique : https://en.unesco.org/themes/education-sustainable-development/cce.",
  },
  "biodiversite-ecosystemes": {
    title: "Biodiversité et Écosystèmes",
    description:
      "La biodiversité désigne la variété des êtres vivants sur Terre, essentielle au bon fonctionnement des écosystèmes. Protéger la biodiversité, c'est préserver la santé de notre planète et notre propre bien-être.",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    moreInfo:
      "Les écosystèmes fournissent des services vitaux comme la purification de l'eau, la pollinisation, la régulation du climat et la fertilité des sols. Selon l'IPBES, un million d'espèces animales et végétales sont menacées d'extinction. L'éducation à la biodiversité vise à sensibiliser à l'importance de la nature et à encourager des actions pour sa préservation. Pour approfondir, consultez le site de l'UICN : https://www.iucn.org/fr.",
  },
  "economie-circulaire": {
    title: "Économie Circulaire",
    description:
      "L'économie circulaire est un modèle de production et de consommation qui vise à prolonger la durée de vie des produits, à réduire les déchets et à optimiser l'utilisation des ressources.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    moreInfo:
      "Contrairement à l'économie linéaire (produire, consommer, jeter), l'économie circulaire favorise le recyclage, la réutilisation et la réparation. Elle contribue à la lutte contre le changement climatique et la préservation des ressources naturelles. Pour en savoir plus, visitez le site de la Fondation Ellen MacArthur : https://ellenmacarthurfoundation.org/fr.",
  },
};

type ProgramSlug = keyof typeof programData;

export default async function ProgramPage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const program = programData[slug as ProgramSlug];

  if (!program) return notFound();

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <Image
        src={program.image}
        alt={program.title}
        fill
        className="object-cover object-center z-0"
        style={{ filter: 'brightness(0.5)' }}
        priority
      />
      {/* Overlay for darkening */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Content */}
      <main className="relative z-20 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-white text-center drop-shadow-lg">{program.title}</h1>
        <p className="text-lg mb-4 text-white text-center max-w-2xl drop-shadow-lg">{program.description}</p>
        <div className="prose max-w-none text-white bg-black/40 rounded-lg p-6 drop-shadow-lg">
          {program.moreInfo}
        </div>
      </main>
    </div>
  );
} 