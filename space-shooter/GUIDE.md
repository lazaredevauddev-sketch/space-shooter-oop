# 🚀 Space Shooter — Guide Pédagogique OOP en JavaScript

> Un projet progressif pour apprendre la Programmation Orientée Objet en construisant un jeu 2D.

---

## 📁 Architecture du projet

```
space-shooter/
├── index.html            ← Structure HTML + canvas
├── style.css             ← Styles visuels
└── src/
    ├── main.js           ← Point d'entrée (3 lignes)
    ├── Game.js           ← Orchestrateur (boucle, coordination)
    ├── Entity.js         ← Classe abstraite de base
    ├── Player.js         ← Vaisseau joueur (hérite Entity)
    ├── Enemy.js          ← Ennemi (hérite Entity)
    ├── Projectile.js     ← Tir (hérite Entity)
    ├── InputHandler.js   ← Gestion clavier
    ├── CollisionManager.js ← Détection AABB
    ├── StateManager.js   ← Machine à états
    ├── UI.js             ← HUD + écrans
    └── Spawner.js        ← Générateur d'ennemis
```

---

## 🎯 Design OOP

### Diagramme de classes

```
                    ┌──────────┐
                    │  Entity  │  (classe abstraite)
                    │──────────│
                    │ x, y     │
                    │ width, h │
                    │ velocity │
                    │ isAlive  │
                    ├──────────┤
                    │ update() │
                    │ render() │
                    │ getBounds│
                    │ destroy()│
                    └────┬─────┘
            ┌────────────┼────────────┐
            ▼            ▼            ▼
       ┌────────┐  ┌──────────┐  ┌──────────┐
       │ Player │  │  Enemy   │  │Projectile│
       └────────┘  └──────────┘  └──────────┘

    ┌──────────────────────────────────┐
    │              Game                │
    │──────────────────────────────────│
    │ possède (composition) :          │
    │  ├─ InputHandler                 │
    │  ├─ StateManager                 │
    │  ├─ CollisionManager             │
    │  ├─ UI                           │
    │  ├─ Spawner                      │
    │  ├─ Player                       │
    │  ├─ Projectile[]                 │
    │  └─ Enemy[]                      │
    └──────────────────────────────────┘
```

**Héritage** → Player, Enemy, Projectile partagent position/vélocité/cycle de vie → « est un » Entity.
**Composition** → Game « possède » les systèmes → chacun a une responsabilité unique et est remplaçable.

---

## 📚 Plan d'apprentissage en 8 étapes

---

### Étape 1 — La boucle de jeu

**Objectif** : Comprendre `requestAnimationFrame`, `deltaTime`, et la structure d'une classe `Game`.

**Concepts OOP** : Classe, constructeur, méthodes, encapsulation.

**Ce que tu apprends** :
- Créer une classe `Game` avec `start()`, `loop()`, `update()`, `render()`
- Calculer `deltaTime` pour un mouvement indépendant du FPS
- Dessiner un rectangle qui bouge tout seul sur le canvas

**Exercices** :
1. Modifie la couleur du fond en fonction du temps (`hsl(time, 50%, 10%)`)
2. Fais bouger un carré en cercle au lieu d'en ligne droite
3. Affiche le FPS en temps réel dans le coin du canvas

**Critères de réussite** :
- [ ] Le rectangle se déplace à la même vitesse quelle que soit la machine
- [ ] Le FPS affiché est stable autour de 60

---

### Étape 2 — Le joueur et l'input

**Objectif** : Contrôler un vaisseau au clavier.

**Concepts OOP** : Héritage (`Player extends Entity`), composition (`Game` possède `InputHandler`), injection de dépendance.

**Ce que tu apprends** :
- Créer une classe de base `Entity` avec position/vélocité
- Hériter pour créer `Player` avec un comportement spécifique
- Séparer la gestion des inputs dans sa propre classe

**Exercices** :
1. Ajoute le mouvement vertical (haut/bas) limité à la moitié inférieure de l'écran
2. Ajoute un effet de traînée : dessine des « fantômes » semi-transparents aux positions précédentes
3. Implémente une accélération progressive au lieu d'une vitesse constante

**Critères de réussite** :
- [ ] Le joueur ne sort jamais du canvas
- [ ] Le mouvement est fluide et réactif
- [ ] `InputHandler` ne connaît pas `Player` (découplage)

---

### Étape 3 — Les projectiles

**Objectif** : Le joueur peut tirer.

**Concepts OOP** : Polymorphisme (Entity → Projectile), gestion d'un tableau d'objets, cycle de vie (création/destruction).

**Ce que tu apprends** :
- Créer `Projectile extends Entity`
- Gérer un tableau dynamique d'instances (`this.projectiles[]`)
- Nettoyer les entités mortes (`.filter(p => p.isAlive)`)
- Implémenter un cooldown de tir

**Exercices** :
1. Ajoute un tir double (deux projectiles côte à côte)
2. Limite à 5 projectiles max sur l'écran
3. Fais varier la couleur du tir selon le cooldown restant

**Critères de réussite** :
- [ ] Les projectiles se détruisent hors écran (pas de fuite mémoire)
- [ ] Le cooldown empêche le spam
- [ ] Le code de création du projectile est dans `Game`, pas dans `Player`

---

### Étape 4 — Les ennemis et le Spawner

**Objectif** : Des ennemis apparaissent et descendent.

**Concepts OOP** : Composition (`Game` possède `Spawner`), factory pattern (le Spawner crée des Enemy), encapsulation de la logique de difficulté.

**Ce que tu apprends** :
- Créer `Enemy extends Entity`
- Créer `Spawner` qui gère le timing et la difficulté
- Comprendre pourquoi séparer « quand créer » de « comment se comporter »

**Exercices** :
1. Crée 3 types d'ennemis : lent/gros (200 pts), moyen (100 pts), rapide/petit (50 pts)
2. Fais apparaître les ennemis en formation (ligne, V, diagonale)
3. Ajoute un ennemi qui change de direction quand il touche un bord

**Critères de réussite** :
- [ ] La difficulté augmente progressivement
- [ ] Les ennemis hors écran sont nettoyés
- [ ] `Spawner` est facilement modifiable sans toucher aux autres classes

---

### Étape 5 — Les collisions

**Objectif** : Les tirs détruisent les ennemis, les ennemis endommagent le joueur.

**Concepts OOP** : Responsabilité unique (`CollisionManager` ne fait que détecter), méthode statique, délégation.

**Ce que tu apprends** :
- L'algorithme AABB (Axis-Aligned Bounding Box)
- Séparer détection et résolution
- Utiliser `getBounds()` pour un couplage faible entre classes

**Exercices** :
1. Affiche visuellement les bounding boxes (debug mode avec touche `B`)
2. Implémente une détection circulaire pour les ennemis ronds
3. Ajoute un flash blanc sur l'ennemi quand il est touché

**Critères de réussite** :
- [ ] Aucune collision manquée à vitesse normale
- [ ] `CollisionManager` ne modifie pas directement les entités (il retourne un résultat, `Game` agit)
- [ ] Un projectile ne touche qu'un seul ennemi par frame

---

### Étape 6 — Score, vies et HUD

**Objectif** : Afficher le score et les vies, sauvegarder le meilleur score.

**Concepts OOP** : Séparation logique/affichage (`UI` n'a pas de logique de jeu), `localStorage` pour la persistance.

**Ce que tu apprends** :
- Créer une classe `UI` purement visuelle
- Gérer un état (score, vies) sans le dupliquer
- Utiliser `localStorage` pour persister des données

**Exercices** :
1. Anime le score qui grossit quand il augmente
2. Ajoute un combo multiplier (×2 si 3 kills en 2 secondes)
3. Affiche un tableau des 5 meilleurs scores

**Critères de réussite** :
- [ ] Le meilleur score persiste après rechargement de la page
- [ ] `UI.render()` reçoit des données en paramètres (pas d'accès global)
- [ ] Les vies s'affichent correctement et déclenchent le game over à 0

---

### Étape 7 — Machine à états

**Objectif** : Naviguer entre MENU → PLAYING ↔ PAUSE → GAMEOVER → MENU.

**Concepts OOP** : State Pattern, enum figé (`Object.freeze`), transitions explicites.

**Ce que tu apprends** :
- Pourquoi un `if/else` ne suffit pas pour gérer des états complexes
- Comment `Object.freeze` crée un enum sûr en JS
- Comment conditionner update/render selon l'état

**Exercices** :
1. Ajoute un état `COUNTDOWN` (3, 2, 1, GO !) entre MENU et PLAYING
2. Implémente un écran de victoire si le score atteint 5000
3. Log chaque transition d'état dans la console avec timestamp

**Critères de réussite** :
- [ ] Le jeu met bien en pause (plus rien ne bouge)
- [ ] On peut naviguer entre tous les états sans bug
- [ ] Aucune logique de jeu ne tourne pendant MENU ou GAMEOVER

---

### Étape 8 — Polish et effets

**Objectif** : Rendre le jeu visuellement satisfaisant.

**Concepts OOP** : Composition avancée, réutilisation de patterns.

**Ce que tu apprends** :
- Dessiner avec Canvas (paths, arcs, gradients)
- Effets visuels (clignotement, ombres, pulsation)
- Étoiles parallaxe pour le fond

**Exercices** :
1. Ajoute des explosions quand un ennemi meurt (cercle qui s'agrandit et s'efface)
2. Fais vibrer le canvas quand le joueur est touché (screen shake)
3. Ajoute un effet de ralenti (slow-motion) pendant 0.5s quand le joueur perd une vie

**Critères de réussite** :
- [ ] Le jeu a un rendu visuel soigné (pas de simples rectangles)
- [ ] Les effets ne cassent pas le gameplay
- [ ] Le code des effets est séparé dans ses propres méthodes/classes

---

## 🔧 10 Extensions pour progresser

| # | Extension | Concepts appris |
|---|-----------|----------------|
| 1 | **Power-ups** (bouclier, tir triple, vitesse) | Nouvelle sous-classe d'Entity, timer, composition |
| 2 | **Ennemis variés** (zigzag, tireurs, boss) | Héritage multiple niveaux, Strategy pattern |
| 3 | **Système de particules** | Pool d'objets, optimisation, recyclage |
| 4 | **Niveaux progressifs** | Data-driven design, fichier de config JSON |
| 5 | **Sons** (Web Audio API) | Classe `AudioManager`, Singleton pattern |
| 6 | **Sauvegarde complète** (localStorage) | Sérialisation/désérialisation, JSON |
| 7 | **Sprites animés** (spritesheet) | Classe `Animator`, frames, timing |
| 8 | **Écran titre animé** | Composition de scènes, transitions |
| 9 | **IA ennemie** (poursuite, esquive) | Comportements, vecteurs, machines à états |
| 10 | **Mode 2 joueurs local** | Refactoring, injection de config par joueur |

---

## 🎮 Règles du jeu

1. **Mouvement** : ← → (ou A/D) pour déplacer le vaisseau
2. **Tir** : Espace ou ↑ pour tirer
3. **Pause** : Échap pour pause/reprendre
4. **Score** : +100 points par ennemi détruit
5. **Vies** : 3 vies, perte d'une vie au contact ennemi
6. **Game Over** : 0 vies = fin de partie
7. **Meilleur score** : sauvegardé automatiquement

---

## ⚙️ Boucle de jeu — Explication technique

```
requestAnimationFrame(loop)
  │
  ├── deltaTime = (now - lastTime) / 1000  // en secondes
  │   └── cappé à 0.05s pour éviter les sauts
  │
  ├── update(dt)
  │   ├── Étoiles (toujours)
  │   └── switch(state)
  │       ├── MENU     → écoute Enter
  │       ├── PLAYING  → Player, Enemies, Projectiles, Spawner, Collisions
  │       ├── PAUSE    → écoute Escape
  │       └── GAMEOVER → écoute Enter
  │
  ├── render()
  │   ├── Fond + Étoiles
  │   ├── Entités (si pas MENU)
  │   └── UI overlay
  │
  └── resetJustPressed()
```

**Pourquoi `deltaTime`** : un mouvement de `vitesse * dt` garantit la même vitesse à 30 FPS et 144 FPS.

---

## 🏗️ Comment lancer le projet

Le projet utilise des ES Modules (`import`/`export`), il faut un serveur HTTP :

```bash
# Option 1 : npx serve (Node.js)
cd space-shooter
npx serve .

# Option 2 : extension VS Code "Live Server"

# Option 3 : Python
python -m http.server 8000
```

Ouvrir `http://localhost:3000` (ou le port affiché).
