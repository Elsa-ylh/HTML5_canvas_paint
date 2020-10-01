import { UserGuide } from './interface-guide';

export const dataUserGuide: UserGuide[] = [
    {
        title: 'Guide utilisateur',
        isTool: 'Divers',
        description:
            "Bienvenue dans le guide d'utilisation contenant les informations de bases sur l'utilisation de notre application Poly Dessin. Ici, vous trouverez comment utiliser les outils disponibles ainsi que leurs descriptions. Dans l'onglet Divers se trouvent les informations sur la base de l'application et l'onglet Dessiner couvrent les outils disponibles.  ",
        path: 'assets/test_guide_utilisation.png',
    },
    {
        title: 'Créer ou continuer dessin',
        isTool: 'Divers',
        description:
            "En tant qu'utilisateur, il vous est possible de créer un nouveau dessin en cliquant sur Créer nouveau dessin dans la page d'acceuil ou bien sur l'icône + en bas à droite de votre écran lorsque vous vous trouvez sur la vue dessin. Il est aussi possible d'utiliser le raccourci clavier Ctrl + O afin de créer un nouveau dessin. Si jamais vous pressez accidentellement le bouton créer nouveau dessin, un message de confirmation apparaitra afin de vous puissiez soit revenir à votre dessin actuel ou en recommencer un nouveau.",
        path: 'assets/giphy.gif',
    },
    {
        title: 'Caroussel de dessin',
        isTool: 'Divers',
        description:
            "Le carroussel de dessin vous permet d'accéder à vos précédents dessins sauvegardés. Cette option sera accessible plus tard dans la session.",
        path: 'assets/..',
    },
    {
        title: 'Sauvegarde automatique et manuelle',
        isTool: 'Divers',
        description: "L'outil de sauvegarde, automatique ou manuelle, sera implémenté lors du sprint 2.",
        path: 'assets/..',
    },
    {
        title: 'Exportation',
        isTool: 'Divers',
        description:
            'La fonctionnalité Exportation offre de créer une image à partir de la surface de dessin et de l’exporter dans un des formats suivants : JPG ou PNG. Il vous faudra entrer un nom pour le fichier exporté. Si vous le souhaitez, plutôt que de sauvegarder localement votre dessin exporté, il vous est possible de l’envoyer par courriel. Il vous est aussi possible d’appliquer un filtre sur l’image avant que l’exportation ne soit effectuée parmiles  cinq filtres différents disponibles',
        path: 'assets/..',
    },
    {
        title: 'Outils',
        isTool: 'Dessiner',
        description:
            'Les outils servent à modifier la surface de dessin.Vous pouvez sélectionnez un outil via la barre latérale ou grâce aux raccourcis clavier. Quand un outil est sélectionné, il devient l’outil actif contrôlé par votre souris. Le barre latérale secondaire affiche alors ses attributs configurables que vous pouvez modifier. Les outils disponibles sont : crayon, pinceau, ligne, rectangle, ellipse ou encore la palette de couleur.',
        path: 'assets/..',
    },
    {
        title: 'Outils - Crayon',
        isTool: 'Dessiner',
        description:
            "Le crayon est l’outil de base du logiciel de dessin. Il ne sert qu’à faire de simples traits sans texture particulière. Il dispose d'une pointe ronde et il est possible de modifier son épaisseur via la barre latérale secondaire.",
        path: 'assets/..',
    },
    {
        title: 'Outils - Efface',
        isTool: 'Dessiner',
        description:
            'Cet outil permet d’effacer (rendre blanc) des pixels de la surface de dessin. Lorsque le clic gauche de la souris est enfoncé, tous les pixels se trouvant sous l’icône du pointeur de la souris deviennent blancs. Pour représenter l’efface, l’icône du pointeur de la souris est représenté par un carré blanc avec une très mince bordure noire. Il est possible de modifier son épaisseur via la barre latérale secondaire.',
        path: 'assets/..',
    },
    {
        title: 'Outils - Pinceau',
        isTool: 'Dessiner',
        description:
            'Cet outil est similaire au crayon. Il n’en diffère que par la texture du trait. Il est possible de choisir parmi cinq textures différentes. On peut modifier son épaisseur et la texture via la barre latérale secondaire',
        path: 'assets/..',
    },
    {
        title: 'Outils - Ligne',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de tracer une ligne composée d’un ou plusieurs segments. Votre premier clic définit la position de départ de la ligne. Ensuite, chaque clic qui suit « connecte » avec le clic qui le précède pour former un segment de la ligne. Lorsque vous maintenez la touche Shift enfoncée, le segment temporaire s’orientera selon l’un des angles suivants : 0, 45, 90, 135, 180, 225, 270 ou 315 degrés. Afin de quitter l'outil ligne, il vous faudra effectuer un double-clique gauche.",
        path: 'assets/..',
    },
    {
        title: 'Outils - Rectangle',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de dessiner des rectangles. Il vous est possible de créer des rectangles sur la surface de dessin en faisant des glisser-déposer. Si vous souhaitez tracé un carré, appuyez sur la touche Shift pendant votre glisser-déposer. De plus, il vous est possible de choisir entre trois types de rectangles : contour (on ne dessine que les contours), plein (intérieur rempli sans contour) ou plein avec contour (on dessine l'intérieur et les contours du rectangle). Aussi, vous pouvez modifier l'épaisseur des contours via la barre latérale secondaire.",
        path: 'assets/..',
    },
    {
        title: 'Outils - Ellipse',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de dessiner des ellipses. Il vous est possible de créer des ellipses sur la surface de dessin en faisant des glisser-déposer. Si vous souhaitez tracé un cercle, appuyez sur la touche Shift pendant votre glisser-déposer. De plus, il vous est possible de choisir entre trois types d'ellipses : contour (on ne dessine que les contours), plein (intérieur rempli sans contour) ou plein avec contour (on dessine l'intérieur et les contours). Aussi, vous pouvez modifier l'épaisseur des contours via la barre latérale secondaire.",
        path: 'assets/..',
    },
    {
        title: 'Manipulation de sélection',
        isTool: 'Dessiner',
        description:
            'Les trois outils vous permettent de sélectionner une partie de la surface de dessin que vous pouvez ensuite déplacer, redimensionner ou faire pivoter. Votre sélection sera toujours accompagnée de deux types d’indicateurs visuels : un contour de sélection et une boite englobante. Le contour de votre sélection représente la frontière d’un groupe de pixels sélectionnés et sera illustré par une ligne pointillée. Aussi, des manipulations peuvent faire en sorte que la sélection se retrouve, en partie ou en tout, en dehors de la surface de dessin',
        path: 'assets/..',
    },
    {
        title: 'Palette de couleur',
        isTool: 'Dessiner',
        description:
            "La palette de couleur est un attribut partagé par tous les outils. Dans la barre latérale secondaire, vous pouvez voir que le panneau d’attributs contient deux couleurs configurables : couleurs principale et secondaire Le panneau possède un bouton permettant d’intervertir ces deux couleurs. Il vous est aussi possible de modifier l'opacité. Une couleur parfaitement opaque masquera la couleur originale. À l’opposé, une opacité nulle équivaut à l’absence de pigments. Vous pouvez sélectionner la couleur principale ou secondaire à partir d'une palette de couleurs. Une fois la couleur choisie et confirmée, la palette sera de nouveau masquée. L'outil palette de couleur vous offre aussi la possibilité d’y entrer les valeurs de rouge, vert et bleu manuellement (en hexadécimale) dans des champs texte prévus à cet effet.",
        path: 'assets/..',
    },
    {
        title: 'Annuler-refaire',
        isTool: 'Dessiner',
        description:
            "En activant la fonction annuler à répétition, vous pouvez « reculer » dans l’état de votre dessin, et ce jusqu’à en revenir à l’état de départ.À l'inverse, il vous sera possible de refaire chaque action annulée en suivant l’ordre inverse.",
        path: 'assets/..',
    },
    {
        title: 'Grille',
        isTool: 'Dessiner',
        description:
            'L’application vous permez d’afficher une grille superposée à la surface de dessin et de son contenu. Son point d’origine est le coin supérieur gauche de la surface. Il vous est possible d’activer ou de désactiver la grille, de lui assigner une valeur d’opacité et finalement de lui indiquer la taille (en pixels) des carrés la composant.',
        path: 'assets/..',
    },
    {
        title: 'Magnétisme',
        isTool: 'Dessiner',
        description: 'Cette fonctionnalité sera implémentée lors du sprint 2.',
        path: 'assets/..',
    },
];
