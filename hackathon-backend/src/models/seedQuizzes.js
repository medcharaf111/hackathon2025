const mongoose = require('mongoose');
const Quiz = require('./Quiz');
const { mongoUri } = require('../config');

async function seed() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await Quiz.deleteMany({});
  await Quiz.insertMany([
    {
      title: 'Quiz sur le Développement Durable',
      description: 'Testez vos connaissances sur le développement durable.',
      questions: [
        {
          question: "Quel est l'objectif principal du développement durable ?",
          options: [
            'Assurer la croissance économique uniquement',
            "Protéger l'environnement uniquement",
            'Répondre aux besoins du présent sans compromettre ceux des générations futures',
            'Augmenter la production industrielle'
          ],
          answer: 2
        },
        {
          question: "Combien y a-t-il d'Objectifs de Développement Durable (ODD) adoptés par l'ONU ?",
          options: ['10', '17', '20', '25'],
          answer: 1
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: 'Quiz Biodiversité',
      description: 'Vérifiez vos connaissances sur la biodiversité.',
      questions: [
        {
          question: "Qu'est-ce que la biodiversité ?",
          options: [
            'La diversité des espèces vivantes',
            'La variété des écosystèmes',
            'La diversité génétique',
            'Toutes les réponses ci-dessus'
          ],
          answer: 3
        },
        {
          question: "Quel est le principal facteur de perte de biodiversité ?",
          options: [
            'La pollution lumineuse',
            'La déforestation',
            'Le tourisme',
            'La pêche artisanale'
          ],
          answer: 1
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: 'Quiz Changement Climatique',
      description: 'Évaluez vos connaissances sur le changement climatique.',
      questions: [
        {
          question: "Quel gaz est le principal responsable de l'effet de serre ?",
          options: [
            'Oxygène',
            'Dioxyde de carbone',
            'Azote',
            'Hydrogène'
          ],
          answer: 1
        },
        {
          question: "Quel secteur émet le plus de gaz à effet de serre dans le monde ?",
          options: [
            'Transports',
            'Industrie',
            'Agriculture',
            "Production d'énergie"
          ],
          answer: 3
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: "Quiz Économie Circulaire",
      description: "Testez vos connaissances sur l'économie circulaire.",
      questions: [
        {
          question: "Quel est le principe fondamental de l'économie circulaire ?",
          options: [
            'Produire, consommer, jeter',
            'Recycler, réutiliser, réduire',
            'Extraire, transformer, éliminer',
            'Importer, exporter, consommer'
          ],
          answer: 1
        },
        {
          question: "Quel matériau est le plus couramment recyclé dans le monde ?",
          options: [
            'Plastique',
            'Verre',
            'Papier',
            'Aluminium'
          ],
          answer: 2
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: "Quiz Océans et Pollution",
      description: "Découvrez l'état des océans et les enjeux de la pollution marine.",
      questions: [
        {
          question: "Quel est le principal polluant des océans ?",
          options: [
            'Plastique',
            'Pétrole',
            'Métaux lourds',
            'Engrais agricoles'
          ],
          answer: 0
        },
        {
          question: "Quel pourcentage de la surface de la Terre est recouvert par les océans ?",
          options: [
            '50%',
            '60%',
            '70%',
            '80%'
          ],
          answer: 2
        }
      ],
      type: 'standard',
      level: 'all'
    },
    // New quizzes below
    {
      title: "Quiz Énergies Renouvelables",
      description: "Testez vos connaissances sur les énergies renouvelables.",
      questions: [
        {
          question: "Quelle est la source d'énergie renouvelable la plus utilisée dans le monde ?",
          options: [
            'Solaire',
            'Éolienne',
            'Hydroélectrique',
            'Biomasse'
          ],
          answer: 2
        },
        {
          question: "Quel pays est le leader mondial de la production d'énergie solaire ?",
          options: [
            'États-Unis',
            'Chine',
            'Allemagne',
            'Inde'
          ],
          answer: 1
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: "Quiz Gestion des Déchets",
      description: "Vérifiez vos connaissances sur la gestion des déchets.",
      questions: [
        {
          question: "Quel type de déchet met le plus de temps à se décomposer ?",
          options: [
            'Papier',
            'Verre',
            'Plastique',
            'Déchets organiques'
          ],
          answer: 2
        },
        {
          question: "Quel est le meilleur moyen de réduire la quantité de déchets ?",
          options: [
            'Recycler',
            'Réutiliser',
            'Réduire à la source',
            'Composter'
          ],
          answer: 2
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: "Quiz Eau et Ressources Hydrauliques",
      description: "Testez vos connaissances sur l'eau et sa gestion durable.",
      questions: [
        {
          question: "Quel pourcentage de l'eau sur Terre est potable ?",
          options: [
            '10%',
            '2,5%',
            '1%',
            '5%'
          ],
          answer: 2
        },
        {
          question: "Quel secteur consomme le plus d'eau douce dans le monde ?",
          options: [
            'Industrie',
            'Agriculture',
            'Usage domestique',
            'Énergie'
          ],
          answer: 1
        }
      ],
      type: 'standard',
      level: 'all'
    },
    {
      title: "Quiz Urbanisation Durable",
      description: "Découvrez les enjeux de l'urbanisation durable.",
      questions: [
        {
          question: "Quel est l'objectif principal d'une ville durable ?",
          options: [
            'Augmenter la densité urbaine',
            'Réduire la pollution et améliorer la qualité de vie',
            'Construire plus de routes',
            'Développer les zones industrielles'
          ],
          answer: 1
        },
        {
          question: "Quel moyen de transport est le plus écologique en ville ?",
          options: [
            'Voiture individuelle',
            'Bus diesel',
            'Vélo',
            'Moto'
          ],
          answer: 2
        }
      ],
      type: 'standard',
      level: 'all'
    }
  ]);
  console.log('Seeded quizzes!');
  process.exit();
}

seed(); 