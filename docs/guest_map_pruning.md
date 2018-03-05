# Guest Map Pruning

Every day a script is ran to prune guest maps older than 7 days.

Deleted maps are backed up in this Discord channel: `https://discord.gg/n76eAdZ` (it is private)

The script is located in `/var/www/node_server/tools/prune-guest-maps`

The cron entry is in the crontab (`crontab -e`) and should be something like this:
`@daily /usr/bin/node /var/www/node_server/tools/prune-guest-maps/index.js &>> /var/www/node_server/tools/prune-guest-maps/output.log`
