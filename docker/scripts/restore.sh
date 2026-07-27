#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1

echo "⚠️  Cette opération va ÉCRASER la base de données actuelle."
read -p "Continuer ? (yes/no) " confirm

if [ "$confirm" != "yes" ]; then
  exit 0
fi

gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"

echo "✅ Restauration terminée."