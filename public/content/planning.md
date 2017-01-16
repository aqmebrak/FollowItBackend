PLANNING:

Scenario: CAMPUS

- Un utilisateur va de Templier Est à Amphi Forum. Il sélectionne donc dans la liste déroulante 'Amphi Forum'
- Il sélectionne son point de départ: L'IUT CLIO
- Il appuie sur le bouton "Chemin le plus court"
- Chargement...
- Son itinéraire lui est renvoyé sous forme de MAterial-Stepper List
- Sa montre connectée lui affiche par tuile les différentes étapes
|--------------------------------------------------------------------------|
- A un moment, un gérant modifie la cartographie du campus. Un chemin est inacessible pour cause de réparation.
Il désactive le chemin en question et soumet le nouveau plan au serveur.
- Le serveur récupère le plan et notifie le changement à tous les utilisateurs connectés.
- L'application mobile vérifie rapidement si le chemin désactivé fait partie de l'itinéraire. Si non, il continue de proposer l'itinéraire.
Si oui, il demande à nouveau l'itinéraire en prenant pour départ la position actuelle de l'utilisateur (dernier noeud passé/validé)
- le nouvel itinéraire est récupéré.



- algo chemin avec itineraire ecrit a envoyer
- appli mobile integrer stepper recevoir les ecrits les afficher
- 