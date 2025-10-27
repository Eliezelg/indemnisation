# Test du Dashboard Admin

## Étape 1: Démarrage du backend

1. Arrêter tous les processus backend en cours :
```bash
fuser -k 3001/tcp
```

2. Démarrer le backend :
```bash
cd apps/api
npm run dev
```

3. Attendre que le message apparaisse : `🚀 API is running on: http://localhost:3001`

## Étape 2: Démarrage du frontend

1. Dans un nouveau terminal :
```bash
cd apps/web
npm run dev
```

2. Attendre que le message apparaisse : `ready started server on...`

## Étape 3: Connexion en tant qu'admin

### Note importante
Votre compte `eliezelg@gmail.com` a maintenant le rôle ADMIN dans la base de données.

### Test depuis l'interface web

1. Ouvrir le navigateur sur [http://localhost:3000](http://localhost:3000)
2. Cliquer sur "Connexion" ou aller sur [http://localhost:3000/fr/auth/login](http://localhost:3000/fr/auth/login)
3. Se connecter avec les identifiants admin ci-dessus
4. Naviguer vers le dashboard admin : [http://localhost:3000/fr/admin](http://localhost:3000/fr/admin)

### Test avec curl (optionnel)

```bash
curl -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@indemnisation.com","password":"Admin123!"}' | jq .
```

Vous devriez recevoir un token JWT avec `"role": "ADMIN"`.

## Pages disponibles

1. **Dashboard Overview** : `/fr/admin`
   - Statistiques générales
   - Graphiques (réclamations par mois, par statut, top airlines)
   - Tableau des réclamations récentes

2. **Gestion des réclamations** : `/fr/admin/claims`
   - Liste complète des réclamations
   - Recherche et filtres
   - Export CSV
   - Pagination

3. **Détail d'une réclamation** : `/fr/admin/claims/[id]`
   - Informations complètes (vol, passager, documents)
   - Actions rapides (changer le statut)
   - Historique
   - Notes internes (à venir)

## Fonctionnalités testables

### Dashboard Overview
- [ ] Les 4 cartes de statistiques s'affichent correctement
- [ ] Le graphique linéaire des réclamations par mois fonctionne
- [ ] Le graphique circulaire des statuts fonctionne
- [ ] Le graphique en barres des compagnies fonctionne
- [ ] Le tableau des réclamations récentes s'affiche

### Gestion des réclamations
- [ ] La liste des réclamations s'affiche
- [ ] La recherche fonctionne (par numéro, vol, client, email)
- [ ] Les filtres par statut fonctionnent
- [ ] La pagination fonctionne
- [ ] L'export CSV fonctionne
- [ ] Le clic sur "Voir" navigue vers le détail

### Détail d'une réclamation
- [ ] Toutes les informations s'affichent
- [ ] Les documents sont listés
- [ ] Les boutons d'action changent selon le statut
- [ ] Le changement de statut fonctionne
- [ ] L'historique s'affiche correctement

## Notes

- Le rôle `ADMIN` est maintenant inclus dans le JWT token
- Seuls les utilisateurs avec le rôle ADMIN peuvent accéder aux endpoints `/admin/stats/*`
- La protection par rôle côté frontend reste à implémenter (redirection si non admin)
- Le système de notes internes reste à implémenter

## Troubleshooting

### Erreur "Port 3001 already in use"
```bash
fuser -k 3001/tcp
```

### Prisma Client non à jour
```bash
cd apps/api
npx prisma generate
```

### Base de données non synchronisée
```bash
cd apps/api
npx prisma migrate dev
```

### Recréer l'utilisateur admin
```bash
cd apps/api
npx ts-node prisma/seed-admin.ts
```
