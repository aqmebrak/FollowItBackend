API REST
-------
- POST ==> /graph == renvoie le chemin
- GET ==> /graph == renvoie le graphe total
- POST ==> /updateGraph == met à jour le graphe
- GET ==> /getAllBeacons == renvoie la liste des beacons dispo
- GET ==> /getAllNodes == renvoie la liste des nodes
- POST ==> /updateBeancons == met à jour la liste des beacons passés en parametre


API SOCKETIO
------------
- (client)askPath ==> (server)emit('path')
- (client)getPOI ==> (server)emit('POIList')
- (client)getAllBeancons ==> (server)emit('beaconList')
- (client)getAllNodes ==> (server)emit('nodeList')




SCENARIO:
--------
Un utilisateur veut se rendre à un magasin le plus vite possible. 
Le beacon à proximité le détecte, et lui propose un point de départ, mais il a le choix
de rentrer son point de départ en sélectionnant un magasin à proximité de lui.
Puis il sélectionne le magasin ou il veut aller.
L'application lui renvoie des instructions. On dispose de Beacon sur le chemin  qui vont détecter
le passage de la personne, pour savoir si celle ci est au bon endroit ou non. Ces beacon peuvent aussi déclencher
des notifications pour des promotions sur les magasins à proximité, si l'utilisateur l'a autorisé.
L'utilisateur peut aussi choisir les notifications qu'il veut recevoir en filtrant les magasins par type
(supermarché, textile, jouets, cosmétique, chaussures etc).
Pendant ce temps, l'administrateur du centre commercial ferme une allée pour cause de nettoyage.
L'utilisateur devant passer par ce chemin, l'application recoit une notification et change le chemin.
L'utilisateur arrive à destination.

MINIMAL:
-------
SANS POINT DE DEPART AUTO,
SANS PARAMETRAGE PROFIL

BUGS:
-----
- le service qui doit redemander un chemin
- application plante quand on ferme
- pas possible de redemander un chemin

MONTRE:
------
- notifs quand chemin changé
- tuiles persistantes
- synchro données

MOBILE:
-------
- changer automatique étape quand beacon rencontré

WEB:
-----
- Editer un noeud

BDD
---
Tables :

|   Collection  | attribut | attribut      | attribut     |         |
|:-------------:|----------|---------------|--------------|---------|
| Promo         |   text   |  poi_id       |              |         |
| Beacon        |   name   |   uuid        |  major       |   minor |
| Temp          |   json   |               |              |         |
| Graph         |   json   |               |              |         |
|   POI         |   name   | opening_hours |   type       |         |
