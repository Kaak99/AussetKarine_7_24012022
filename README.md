# Projet 7 : Groupomania
Création d'un réseau social d'entreprise
Formation developpeur web d'OpenClassrooms  

--------------------------------------
  
Utilisation de Vue.js2 pour le frontend
Utilisation de NodeJs, npm, Express et Mysql pour le backend
  
-----------
## Pour installer le projet :

Installer le Systême de gestion de base de données mySql
installer node js , qui contieny le gestionnaire de paquets npm

### Frontend:
AussetKarine_7_24012022 > frontend
```npm install```

### Backend:
AussetKarine_7_24012022 > backend
```npm install```

### Bdd:
La base de donnée se trouve dans le dossier 
AussetKarine_7_24012022 > frontend

-----------
## Pour lancer le projet :

### Frontend:
AussetKarine_7_24012022 > frontend
Pour lancer le server, tapez ```npm run serve```

### Backend:
AussetKarine_7_24012022 > backend
Pour lancer le server, tapez ```npm run start```

### Base de donnée :
root/bddProjet7
Il y a un seul compte administrateur, provisoire (login:god, mot de passe:mdp)

-----------
## Présentation du projet :


Version mars 2022 :
[Créez un réseau social d’entreprise](https://course.oc-static.com/projects/DWJ_FR_P7/DW+P7+-+Creez+un+reseau+social+d%E2%80%99entreprise+-+Scenario.pdf) 

> La soutenance, d’une durée maximum de 30 minutes, se déroulera en deux parties :

> * Présentation des livrables (20 minutes)
En simulant une réunion professionnelle, l’évaluateur jouera le rôle de Stéphanie, la directrice de l’agence (il pourra vous interrompre pour vous poser des questions).
Vous réaliserez une présentation de votre site en mettant en avant les fonctionnalités améliorées.
L’évaluateur doit être capable de cloner l’application et de la lancer.

> * Discussion (5 minutes)
Échange de questions/réponses : l’évaluateur pourra revenir sur certains points pour vous questionner sur vos choix.

> * Débriefing (5 minutes)
À la fin de la session, l'évaluateur cessera de jouer le rôle de la directrice de l'agence afin que vous puissiez débriefer ensemble


> La seule contrainte est que le client utilise une base de données relationnelles qui se manipule avec le langage SQL pour le stockage de données.
> Il faudra donc en tenir compte lorsque tu construiras ton application.
> Tu devras t’assurer que l’utilisateur puisse requêter les données requises depuis SQL et puisse soumettre ces changements à la base de données SQL.
> Les données de connexion doivent également être sécurisées. 

Tu vas devoir :
> * choisir la fonctionnalité que tu vas développer,
> * estimer le temps que tu passeras sur le développement de chaque fonctionnalité,
> * développer la première version de l'application.

> Tu devras faire en sorte que la web app puisse se connecter et se déconnecter à l’application et que la session de l’utilisateur persiste pendant qu’il est connecté.

> Pour ce projet, il faut que tu utilises un framework Front-End. Tu peux utiliser celui que tu préfères (React, Vue, Angular, Ember, Meteor, Aurelia...).
> Par contre, le projet doit être codé en Javascript, donc n'utilise pas le framework Symfony par exemple. Enfin, tes pages devront respecter les standards WCAG.

Compétences évaluées :
> * Authentifier un utilisateur et maintenir sa session
> * Personnaliser le contenu envoyé à un client web
> * Gérer un stockage de données à l'aide de SQL
> * Implémenter un stockage de données sécurisé en utilisant SQL



Spécifications fonctionnelles : 
[Groupomania_Specs_FR_DWJ_VF.pdf](https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P7/Groupomania_Specs_FR_DWJ_VF.pdf)

Le projet consiste à construire un réseau social interne pour les employés de Groupomania.
Le but de cet outil est de faciliter les interactions entre collègues. 

Voici les exigences émises par le comité de pilotage :
> * la présentation des fonctionnalités doit être simple ;
> * la création d’un compte doit être simple et possible depuis un téléphone mobile ;
> * le profil doit contenir très peu d’informations pour que sa complétion soit rapide ;
> * la suppression du compte doit être possible ;
> * l’accès à un forum où les salariés publient des contenus multimédias doit être présent ;
> * l’accès à un forum où les salariés publient des textes doit être présent ;
> * les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés ;
> * le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre salariés ;