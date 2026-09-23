#!/usr/bin/env bash
set -euo pipefail

# CMS backup: dumps the database and archives the uploads folder (product
# photos, gallery images, etc.) into a new timestamped folder under
# BACKUP_DIR, then deletes only its OWN past timestamped folders older than
# BACKUP_RETENTION_DAYS. It never reads or writes anything inside the app
# itself (apps/cms) other than the database and uploads it is backing up, so
# it cannot affect what's currently live.
#
# Usage (run from anywhere — it cds to the CMS app root itself):
#   ./scripts/backup.sh
#
# Cron (cPanel "Cron Jobs" UI), once a day at 02:00 server time:
#   0 2 * * * /home/asfagrrx/asf/apps/cms/scripts/backup.sh >> /home/asfagrrx/asf-backups/backup.log 2>&1
#
# To restore from a backup:
#   mysql:    gunzip -c database.sql.gz | mysql -h HOST -u USER -p DBNAME
#   postgres: pg_restore -h HOST -U USER -d DBNAME --clean database.dump
#   sqlite:   stop the app, then copy data.db back over apps/cms/.tmp/data.db
#   uploads:  tar -xzf uploads.tar.gz -C apps/cms/public
# Always restore into a fresh/staging database first and verify before
# pointing production at it.

CMS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$CMS_DIR"

# Load DB credentials the same way the app does.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

BACKUP_DIR="${BACKUP_DIR:-$HOME/asf-backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$BACKUP_DIR/$STAMP"
mkdir -p "$OUT_DIR"

echo "[$(date)] Starting backup into $OUT_DIR"

case "${DATABASE_CLIENT:-sqlite}" in
  mysql)
    mysqldump \
      --host="${DATABASE_HOST:-localhost}" \
      --port="${DATABASE_PORT:-3306}" \
      --user="${DATABASE_USERNAME}" \
      --password="${DATABASE_PASSWORD}" \
      --single-transaction --quick --routines \
      "${DATABASE_NAME}" | gzip > "$OUT_DIR/database.sql.gz"
    ;;
  postgres)
    PGPASSWORD="${DATABASE_PASSWORD}" pg_dump \
      --host="${DATABASE_HOST:-localhost}" \
      --port="${DATABASE_PORT:-5432}" \
      --username="${DATABASE_USERNAME}" \
      --dbname="${DATABASE_NAME}" \
      --format=custom \
      --file="$OUT_DIR/database.dump"
    ;;
  sqlite|*)
    DB_FILE="${DATABASE_FILENAME:-.tmp/data.db}"
    cp "$CMS_DIR/$DB_FILE" "$OUT_DIR/data.db"
    ;;
esac

if [ -d "$CMS_DIR/public/uploads" ]; then
  tar -czf "$OUT_DIR/uploads.tar.gz" -C "$CMS_DIR/public" uploads
fi

echo "[$(date)] Backup complete: $(du -sh "$OUT_DIR" | cut -f1) at $OUT_DIR"

# Prune only this backup directory's own past timestamped folders.
find "$BACKUP_DIR" -maxdepth 1 -mindepth 1 -type d -mtime "+$RETENTION_DAYS" -exec rm -rf {} \;

echo "[$(date)] Done."
