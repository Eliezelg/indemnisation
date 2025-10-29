# 📘 Guide Administrateur - Plateforme d'Indemnisation

**Version**: 1.0.0
**Dernière mise à jour**: 28 Octobre 2025
**Public cible**: Administrateurs de la plateforme

---

## 🎯 Vue d'Ensemble

Ce guide explique comment utiliser l'interface d'administration de la plateforme d'indemnisation pour les vols perturbés. En tant qu'administrateur, vous pouvez gérer les réclamations, valider les documents, consulter les statistiques et administrer les utilisateurs.

---

## 🔐 1. Connexion

### Accès à l'interface admin

1. Accédez à la page de connexion : `https://votresite.com/fr/login`
2. Entrez vos identifiants admin :
   - **Email**: votre.email@example.com
   - **Mot de passe**: votre mot de passe sécurisé
3. Cliquez sur **Se connecter**

### Vérification du rôle admin

- Seuls les comptes avec le rôle `ADMIN` peuvent accéder à l'interface d'administration
- Si vous voyez une erreur "Accès refusé", contactez un super-administrateur

### Première connexion

Lors de votre première connexion :
- Changez immédiatement votre mot de passe temporaire
- Configurez l'authentification à deux facteurs (si disponible)
- Familiarisez-vous avec l'interface via le dashboard

---

## 📊 2. Dashboard Admin

### Accès

Après connexion, cliquez sur **Admin** dans la navigation ou allez à `/fr/admin`

### Statistiques principales

Le dashboard affiche 4 cartes de statistiques :

1. **Total Claims** (Total des réclamations)
   - Nombre total de réclamations dans le système
   - Toutes périodes confondues

2. **Pending Review** (En attente de révision)
   - Nombre de réclamations nécessitant votre attention
   - Statut: `SUBMITTED` ou `IN_REVIEW`

3. **Approved This Month** (Approuvées ce mois)
   - Réclamations approuvées durant le mois en cours
   - Indicateur de productivité

4. **Avg. Amount** (Montant moyen)
   - Montant d'indemnisation moyen recommandé
   - En euros (€)

### Graphiques

**1. Claims by Month (Réclamations par mois)**
- Graphique linéaire sur 6 mois
- Montre l'évolution du nombre de réclamations
- Permet d'identifier les tendances saisonnières

**2. Claims by Status (Réclamations par statut)**
- Graphique circulaire (pie chart)
- Répartition des statuts:
  - 🔵 SUBMITTED (Soumis)
  - 🟡 IN_REVIEW (En révision)
  - 🟢 APPROVED (Approuvé)
  - 🔴 REJECTED (Rejeté)
  - 🟣 PAID (Payé)

**3. Top 5 Airlines (Top 5 compagnies)**
- Graphique en barres
- Compagnies aériennes avec le plus de réclamations
- Utile pour identifier les partenaires problématiques

**4. Recent Claims (Réclamations récentes)**
- Tableau des 10 dernières réclamations
- Colonnes: Numéro, Vol, Client, Statut, Montant, Date
- Clic sur une ligne pour voir les détails

---

## 📋 3. Gestion des Réclamations

### 3.1 Liste des réclamations

**Accès**: Menu **Réclamations** ou `/fr/admin/claims`

**Fonctionnalités**:

1. **Recherche**
   - Recherchez par :
     - Numéro de réclamation (CLM-2025-000001)
     - Numéro de vol (AF123)
     - Nom du client
     - Email du client

2. **Filtres**
   - Filtrez par statut :
     - Tous
     - DRAFT (Brouillon)
     - SUBMITTED (Soumis)
     - IN_REVIEW (En révision)
     - APPROVED (Approuvé)
     - REJECTED (Rejeté)
     - PAID (Payé)

3. **Pagination**
   - 10 réclamations par page
   - Naviguez avec les boutons < Précédent | Suivant >

4. **Export CSV**
   - Cliquez sur **Export CSV**
   - Télécharge toutes les réclamations filtrées
   - Format : claim_number, flight_number, client_name, status, amount, date

### 3.2 Détail d'une réclamation

**Accès**: Cliquez sur une réclamation dans la liste

**Informations affichées**:

1. **En-tête**
   - Numéro de réclamation
   - Statut actuel (badge coloré)
   - Date de création

2. **Informations du vol**
   - Numéro de vol
   - Date du vol
   - Aéroport de départ
   - Aéroport d'arrivée
   - Compagnie aérienne

3. **Détails de la perturbation**
   - Type : Retard / Annulation / Refus d'embarquement
   - Minutes de retard (si applicable)

4. **Informations passager**
   - Nom complet
   - Email
   - Téléphone
   - Langue préférée

5. **Calcul indemnisation**
   - Montant UE (Règlement 261/2004)
   - Montant Israël (si applicable)
   - Montant recommandé
   - Juridiction applicable

6. **Documents**
   - Liste des documents téléversés
   - Types : Carte d'embarquement, Confirmation, ID, etc.
   - Bouton **Télécharger** pour chaque document

7. **Historique**
   - Timeline des changements de statut
   - Qui a fait quoi et quand

### 3.3 Actions sur une réclamation

**Actions disponibles** (selon le statut actuel):

1. **DRAFT → SUBMITTED**
   - Bouton: **Soumettre**
   - Soumet la réclamation au nom du client
   - Déclenche le workflow de révision

2. **SUBMITTED → IN_REVIEW**
   - Bouton: **Mettre en révision**
   - Indique que vous examinez la réclamation
   - Verrouille pour éviter les doublons de traitement

3. **IN_REVIEW → APPROVED**
   - Bouton: **Approuver**
   - Valide la réclamation
   - Génère une notification au client
   - Prépare pour le paiement

4. **IN_REVIEW → REJECTED**
   - Bouton: **Rejeter**
   - Demande une raison de rejet
   - Notifie le client avec la raison

5. **APPROVED → PAID**
   - Bouton: **Marquer comme payé**
   - Indique que le paiement a été effectué
   - Clôture la réclamation

**⚠️ Attention**:
- Ces actions sont **irréversibles**
- Assurez-vous d'avoir vérifié tous les documents avant d'approuver
- Documentez vos décisions dans les notes internes

---

## 📄 4. Validation des Documents

### 4.1 Liste des documents en attente

**Accès**: Menu **Documents** ou `/fr/admin/documents`

**Affichage**:
- Tous les documents avec statut `PENDING`
- Colonnes:
  - Numéro de réclamation
  - Type de document
  - Client
  - Date de téléversement
  - Actions

### 4.2 Vérification d'un document

**Processus**:

1. **Télécharger le document**
   - Cliquez sur **Télécharger**
   - Le document s'ouvre dans un nouvel onglet
   - Formats supportés : PDF, JPG, PNG

2. **Vérifier le contenu**
   - ✅ Le document est lisible
   - ✅ Les informations correspondent à la réclamation
   - ✅ Le document n'est pas falsifié
   - ✅ Toutes les informations requises sont présentes

3. **Valider ou rejeter**

   **Pour valider**:
   - Cliquez sur **Valider**
   - Le document passe au statut `VALIDATED`
   - Devient disponible pour traitement de la réclamation

   **Pour rejeter**:
   - Cliquez sur **Rejeter**
   - Entrez la raison du rejet (obligatoire)
   - Exemples:
     - "Document illisible"
     - "Informations incorrectes"
     - "Document expiré"
   - Le client sera notifié et pourra réuploader

**Critères de validation**:

- **Carte d'embarquement**:
  - Nom du passager visible
  - Numéro de vol correspond
  - Date correspond
  - Code-barres ou QR code présent

- **Confirmation de réservation**:
  - Numéro de réservation (PNR)
  - Numéro de vol
  - Date de vol
  - Nom du passager

- **Pièce d'identité**:
  - Document valide (non expiré)
  - Photo claire
  - Nom correspond à la réclamation

- **Preuve de retard**:
  - Certificat de la compagnie aérienne
  - Ou capture d'écran du tableau d'affichage
  - Heure de retard visible

---

## 📈 5. Statistiques Avancées

### Accès

Menu **Statistiques** ou `/fr/admin/statistics`

### Métriques disponibles

**1. Claims Overview (Vue d'ensemble)**
- Total réclamations
- Taux d'approbation
- Montant total approuvé
- Montant moyen par réclamation

**2. Claims by Disruption Type (Par type de perturbation)**
- Retard (DELAY)
- Annulation (CANCELLATION)
- Refus d'embarquement (DENIED_BOARDING)
- Graphique circulaire

**3. Top Airlines (Compagnies aériennes)**
- Top 10 compagnies avec le plus de réclamations
- Montant moyen par compagnie
- Taux d'approbation par compagnie

**4. Monthly Trends (Tendances mensuelles)**
- Évolution sur 12 mois
- Nombre de réclamations
- Montants approuvés
- Tendances saisonnières

**5. Geographic Distribution (Distribution géographique)**
- Aéroports de départ les plus fréquents
- Aéroports d'arrivée les plus fréquents
- Routes les plus problématiques

**6. Processing Time (Temps de traitement)**
- Temps moyen par statut
- Réclamations les plus anciennes
- Délai moyen de résolution

### Utilisation des statistiques

**Pour améliorer le service**:
- Identifiez les compagnies problématiques
- Détectez les périodes de forte demande
- Optimisez les ressources

**Pour les rapports**:
- Exportez les graphiques (capture d'écran)
- Utilisez les données pour les rapports mensuels
- Partagez avec les partenaires

---

## 👥 6. Gestion des Utilisateurs

### 6.1 Liste des utilisateurs

**Accès**: Menu **Utilisateurs** ou `/fr/admin/users`

**Statistiques affichées**:
- Total utilisateurs
- Nouveaux ce mois
- Utilisateurs actifs
- Taux de conversion (users avec réclamations)

**Tableau des utilisateurs**:
- Nom complet
- Email
- Rôle (USER / ADMIN)
- Date d'inscription
- Nombre de réclamations

**Filtres**:
- Tous les utilisateurs
- Utilisateurs seulement
- Administrateurs seulement

**Recherche**:
- Par nom
- Par email

### 6.2 Actions utilisateur

**Consulter les réclamations d'un utilisateur**:
- Cliquez sur le nom de l'utilisateur
- Voir toutes ses réclamations
- Accéder aux détails

**Promouvoir en admin** (réservé super-admin):
- Bouton **Promouvoir**
- Change le rôle de USER à ADMIN
- ⚠️ Action sensible, vérifiez l'identité

---

## ⚙️ 7. Paramètres Admin

### Accès

Menu **Paramètres** ou `/fr/admin/settings`

### Sections disponibles

**1. General Settings (Paramètres généraux)**
- Nom de la plateforme
- Email de contact
- Fuseau horaire
- Devise par défaut

**2. Email Templates (Modèles d'email)**
- Template de confirmation
- Template d'approbation
- Template de rejet
- Template de paiement

**3. Compensation Rules (Règles d'indemnisation)**
- Montants UE par distance
- Montants Israël par distance
- Exceptions et cas particuliers

**4. Document Types (Types de documents)**
- Documents requis
- Documents optionnels
- Formats acceptés

**5. Notification Settings (Paramètres de notification)**
- Notifications par email
- Notifications push (si activé)
- Fréquence des rappels

**6. System Maintenance (Maintenance système)**
- Mode maintenance
- Message de maintenance
- URL de redirection

---

## 🔔 8. Notifications

### Types de notifications

**Vous recevez une notification quand**:
- ✉️ Nouvelle réclamation soumise
- 📄 Nouveau document uploadé
- ⚠️ Réclamation en attente > 48h
- 🎯 Objectif mensuel atteint
- 🛠️ Maintenance planifiée

### Gérer vos notifications

1. Cliquez sur l'icône 🔔 en haut à droite
2. Voir toutes les notifications non lues
3. Marquer comme lu / Tout marquer comme lu
4. Configurer les préférences (dans Paramètres)

---

## 🚪 9. Déconnexion

### Procédure

1. Cliquez sur votre nom dans la sidebar
2. Cliquez sur **Déconnexion** ou **Logout**
3. Vous êtes redirigé vers la page de connexion

**Bonne pratique**:
- Déconnectez-vous toujours après utilisation
- Ne laissez pas votre session ouverte sur un poste partagé
- Fermez le navigateur après déconnexion

---

## 🆘 10. Aide et Support

### FAQ

**Q: Je ne vois pas le menu Admin après connexion**
R: Vérifiez que votre compte a bien le rôle `ADMIN`. Contactez un super-administrateur si besoin.

**Q: Une réclamation est bloquée dans un statut**
R: Vérifiez que tous les documents sont validés. Certaines actions nécessitent des documents valides.

**Q: Comment annuler une action (approbation/rejet) ?**
R: Les actions sont irréversibles par design. Contactez le support technique si nécessaire.

**Q: Le bouton Export CSV ne fonctionne pas**
R: Assurez-vous d'autoriser les téléchargements dans votre navigateur. Vérifiez que des réclamations correspondent aux filtres.

**Q: Les graphiques ne s'affichent pas**
R: Rafraîchissez la page. Si le problème persiste, videz le cache du navigateur (Ctrl+F5).

### Contacter le support

**Email**: support@flightclaim.com
**Téléphone**: +33 1 XX XX XX XX
**Horaires**: Lundi - Vendredi, 9h - 18h CET

**En cas d'urgence** (hors horaires):
- Contactez l'astreinte technique: +33 6 XX XX XX XX

---

## 📝 11. Bonnes Pratiques

### Traitement des réclamations

✅ **À FAIRE**:
- Vérifier tous les documents avant approbation
- Documenter vos décisions dans les notes
- Traiter les réclamations par ordre d'arrivée
- Respecter les délais légaux (14 jours)
- Communiquer clairement les raisons de rejet

❌ **À ÉVITER**:
- Approuver sans vérification complète
- Rejeter sans raison claire
- Laisser des réclamations en attente trop longtemps
- Traiter vos propres réclamations (conflit d'intérêts)

### Sécurité

✅ **À FAIRE**:
- Changer votre mot de passe régulièrement
- Utiliser un mot de passe fort (12+ caractères)
- Se déconnecter après chaque session
- Ne jamais partager vos identifiants
- Signaler tout comportement suspect

❌ **À ÉVITER**:
- Noter votre mot de passe
- Utiliser un ordinateur public
- Laisser votre session ouverte sans surveillance
- Partager des captures d'écran avec données sensibles

### Performance

✅ **À FAIRE**:
- Utiliser les filtres pour réduire les résultats
- Exporter régulièrement les statistiques
- Archiver les réclamations closes
- Nettoyer les anciens documents

### Communication

✅ **À FAIRE**:
- Être courtois et professionnel
- Expliquer clairement les décisions
- Répondre dans les 24-48h
- Utiliser les templates d'email

---

## 📚 12. Annexes

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| Ctrl + K | Recherche globale |
| Ctrl + N | Nouvelle réclamation |
| Ctrl + / | Afficher les raccourcis |
| Esc | Fermer modal |

### Codes de statut

| Code | Description | Couleur |
|------|-------------|---------|
| DRAFT | Brouillon | Gris |
| SUBMITTED | Soumis | Bleu |
| IN_REVIEW | En révision | Jaune |
| APPROVED | Approuvé | Vert |
| REJECTED | Rejeté | Rouge |
| PAID | Payé | Violet |

### Montants d'indemnisation UE

| Distance | Retard < 3h | Retard 3-4h | Retard > 4h / Annulation |
|----------|-------------|-------------|--------------------------|
| < 1500 km | 0€ | 125€ | 250€ |
| 1500-3500 km | 0€ | 200€ | 400€ |
| > 3500 km | 0€ | 300€ | 600€ |

---

**Document créé le**: 28 Octobre 2025
**Version**: 1.0.0
**Auteur**: Équipe Plateforme d'Indemnisation
**Prochaine révision**: 28 Novembre 2025

---

**🎓 Formation supplémentaire**: Contactez training@flightclaim.com pour organiser une session de formation personnalisée.
