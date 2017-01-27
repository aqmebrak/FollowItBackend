SCENARIO:
-
Un utilisateur veut se rendre à un magasin le plus vite possible. 
Il rentre son point de départ en sélectionnant un magasin à proximité de lui, 
puis sélectionne le magasin ou il veut aller.
L'application lui renvoie des instructions. On dispose sur le chemin de Beacon qui vont détecter
au passage de la personne si celle ci est au bon endroit ou non. Ces beacon peuvent aussi déclencher
des notifications pour des promotions sur les magasins à proximité, si l'utilisateur l'a autorisé.
L'utilisateur peut aussi choisir les notifications qu'il veut recevoir en filtrant les magasins par type
(supermarché, textile, jouets, cosmétique, chaussures etc).
Pendant ce temps, l'administrateur du centre commercial ferme un allée pour cause de nettoyage.
L'utilisateur devant passer par ce chemin, l'application recoit une notification et change le chemin.



BUGS:
- 
- le service qui doit redemander un chemin
- application plante quand on ferme
- pas possible de redemander un chemin
- mettre offset pour determiner si cest tout droit ou pas 
- CORS

MONTRE:
- 
- notifs quand chemin changé
- tuiles persistantes
- synchro données

MOBILE:
- 
- changer automatique étape quand beacon rencontré

WEB:
-
- Editer un noeud


BDD
-
Tables :

|   POI  | name | opening_hours | type     |         |         |
|:------:|------|---------------|----------|---------|---------|
| Node   | v    | beacon_id     | poi_list | coord_x | coord_y |
| Edge   | v    | w             | weight   |         |         |
| Promo  | text | poi_id        |          |         |         |
| Beacon | name | uuid          | major    | minor   |         |
