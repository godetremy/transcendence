#!/bin/bash

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
RETENTION_DAYS=7

mkdir -p $BACKUP_DIR

pg_dump "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$DATABASE_PORT}/$POSTGRES_DB" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup created: $BACKUP_FILE"
else
  echo "Backup failed!"
  exit 1
fi

find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
