# ELK Stack — Guide complet

Ce guide couvre l'utilisation de la stack **Elasticsearch + Logstash + Kibana + Filebeat** (ELK) dans le projet Transcendence.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Sources       │     │    Filebeat     │     │    Logstash     │
│  - Nginx logs   │────▶│  mTLS output    │────▶│  mTLS input     │
│  - Docker logs  │     │  :5044          │     │  :5044          │
│  - App stdout   │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │ Elasticsearch   │
                    │  HTTPS :9200    │
                    │  Alias:         │
                    │  "transcendence"│
                    │  ILM rollover   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Kibana      │
                    │  HTTPS :5601    │
                    │  /kibana        │
                    └─────────────────┘
```

## URLs d'accès

| Service | Dev (`make dev`) | Prod (`make prod`) |
|---------|------------------|--------------------|
| **App** | `http://localhost:8080` | `https://localhost` |
| **Kibana** | `http://kibana.localhost:8080` | `https://kibana.localhost` |
| **Grafana** | `http://grafana.localhost:8080` | `https://grafana.localhost` |
| **Vault** | `http://127.0.0.1:8200/ui` | `http://127.0.0.1:8200/ui` |
| **Portainer** | `https://127.0.0.1:9443` | `https://127.0.0.1:9443` |
| **Prometheus** | `http://127.0.0.1:9090` | `http://127.0.0.1:9090` |

> **Note macOS** : `*.localhost` résout automatiquement vers `127.0.0.1`. Sur Linux, ajoutez dans `/etc/hosts` :
> ```
> 127.0.0.1 kibana.localhost grafana.localhost app.localhost
> ```

## Démarrage

```bash
# Mode développement (hot reload, debug)
make dev

# Mode production (build optimisé, SSL auto-signé)
make prod

# Arrêter tout
make down

# Nettoyer volumes + images (DESTRUCTIF)
make prune
```

## Sécurité — mTLS full mesh

Tous les composants ELK communiquent via **TLS mutuel** (mTLS) avec des certificats individuels :

| Connexion | Certificat client | Vérification |
|-----------|-------------------|--------------|
| Filebeat → Logstash | ✅ filebeat.crt | `force_peer` |
| Logstash → Elasticsearch | ✅ logstash.crt | `optional` (HTTP) |
| Kibana → Elasticsearch | ✅ kibana.crt | `full` |

Les certificats sont générés automatiquement au premier démarrage d'Elasticsearch dans `./docker/elasticsearch/certs/`.

## Gestion des logs

### Indexation

Tous les logs sont indexés dans un **alias unique** `transcendence` avec **ILM** (Index Lifecycle Management) :

- **Hot** : rollover à 1 GB ou 7 jours
- **Warm** : après 3 jours (read-only)
- **Delete** : après 30 jours

### Niveaux de log traduits

Si votre application émet des logs JSON structurés (Pino), Logstash traduit automatiquement les niveaux numériques :

| Valeur | Label |
|--------|-------|
| 10 | TRACE |
| 20 | DEBUG |
| 30 | INFO |
| 40 | WARN |
| 50 | ERROR |
| 60 | FATAL |

### Parsing par service

Logstash parse automatiquement les logs de :
- **Nginx** (access + error)
- **PostgreSQL**
- **Next.js**
- **ModSecurity** (WAF)
- **Vault / Vault-Agent**
- **Elasticsearch** (JSON structuré)

## Kibana — Premiers pas

### 1. Connexion

Ouvrez `https://kibana.localhost` (prod) ou `http://kibana.localhost:8080` (dev).

### 2. Créer un index pattern

1. **Stack Management** → **Index Patterns**
2. Cliquez **Create index pattern**
3. Pattern : `transcendence*`
4. Time field : `@timestamp`
5. **Create index pattern**

### 3. Explorer les logs

1. **Analytics** → **Discover**
2. Sélectionnez l'index pattern `transcendence*`
3. Filtrez par `service.keyword: nginx` ou `log_level: ERROR`

### 4. Dashboards importés

Un dashboard **"Transcendence Overview"** est importé automatiquement au démarrage. Vous le trouverez dans **Analytics → Dashboard**.

Pour ajouter vos propres dashboards :
1. Créez-les dans Kibana
2. **Stack Management → Saved Objects**
3. Exportez en `.ndjson`
4. Placez le fichier dans `docker/kibana/dashboards/`
5. Redémarrez le conteneur `kibana-dashboards`

## Grafana + Prometheus

### Métriques ELK via Telegraf

Un service **Telegraf** scrape en continu :
- **Logstash** API (`:9600`) → JVM, events, pipeline stats
- **Filebeat** API (`:5066`) → events, harvesters
- **Elasticsearch** (`:9200`) → cluster health, nodes, indices

Tout est exposé sur `http://telegraf:9273/metrics` pour Prometheus.

### Dashboards Grafana pré-installés

3 dashboards sont provisionnés automatiquement :
- **Infrastructure Overview** — CPU, mémoire, réseau
- **Nginx Overview** — requêtes, erreurs, latence
- **PostgreSQL Health** — connexions, slow queries, deadlocks

Accès : `https://grafana.localhost` (login dans `.env`)

## Commandes utiles

```bash
# Voir les conteneurs actifs
make status

# Logs en temps réel
docker compose logs -f elasticsearch logstash kibana filebeat

# Forcer la régénération des certificats
rm -rf docker/elasticsearch/certs/*
docker compose restart elasticsearch

# Tester la connexion Elasticsearch
curl -k -u elastic:changeme https://localhost:9200

# Voir les index
curl -k -u elastic:changeme https://localhost:9200/_cat/indices?v

# Voir l'état ILM
curl -k -u elastic:changeme https://localhost:9200/_ilm/policy/logs-policy

# Forcer un rollover manuel
curl -k -u elastic:changeme -X POST https://localhost:9200/transcendence/_rollover
```

## Dépannage

### Elasticsearch ne démarre pas

```bash
docker logs transcendence-elasticsearch-1 --tail 50
```

**Cause fréquente** : permissions sur `docker/elasticsearch/certs/`. Supprimez le dossier et redémarrez.

### Kibana affiche "Kibana server is not ready yet"

Attendez 30–60s après le démarrage d'Elasticsearch. Kibana s'enregistre auprès d'ES au boot.

### Filebeat ne connecte pas à Logstash

```bash
docker logs transcendence-filebeat-1 | grep -i error
docker logs transcendence-logstash-1 | grep -i beats
```

Vérifiez que les certificats mTLS sont générés (`docker/elasticsearch/certs/filebeat.crt`).

### Pas de logs dans Kibana

1. Vérifiez que Logstash est healthy
2. Vérifiez que l'alias `transcendence` existe :
   ```bash
   curl -k -u elastic:changeme https://localhost:9200/_cat/aliases?v
   ```
3. Vérifiez que Filebeat envoie bien :
   ```bash
   docker logs transcendence-filebeat-1 | grep -i "publish"
   ```

### Telegraf ne scrape pas

```bash
docker logs transcendence-telegraf-1
curl http://127.0.0.1:9273/metrics | grep elasticsearch
```

## Schéma réseau

| Réseau | Services | Exposé publiquement |
|--------|----------|---------------------|
| `edge` | Nginx, Portainer | ✅ Nginx (443/8080) |
| `app` | Node, Postgres, Nginx | ❌ Interne |
| `monitoring` | Prometheus, Grafana, Alertmanager, Telegraf | ❌ Interne |
| `elk` | ES, Kibana, Logstash, Filebeat, Telegraf | ❌ Interne |
| `vault_net` | Vault, Vault-Agent | ✅ Vault (8200) |
