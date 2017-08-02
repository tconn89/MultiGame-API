# Mongo Backups

Backups are compressed and stored here:
`/backups/terrium`

The script that creates the backup is here:
`/etc/cron.weekly/mongo_dumps.sh`

Currently the cron job dumps a copy of the db every Wednesday at 5am.

