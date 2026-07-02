#!/usr/bin/env bash
DRIVER=/usr/share/logstash/drivers/postgresql.jar
VERSION=42.7.4

if [ ! -f "$DRIVER" ]; then
	mkdir -p "$(dirname "$DRIVER")"
	curl -fsSL -o "$DRIVER" "https://jdbc.postgresql.org/download/postgresql-$VERSION.jar"
fi

ES=https://elasticsearch:9200
CA=/certs/ca/ca.crt
AUTH="elastic:${ELASTIC_PASSWORD}"
curl -fsS --retry 120 --retry-delay 5 --retry-connrefused \
	-o /dev/null --cacert "$CA" -u "$AUTH" "$ES"
if [ "$(curl -s -o /dev/null -w '%{http_code}' --cacert "$CA" -u "$AUTH" "$ES/events")" != "200" ]; then
	curl -fsS --cacert "$CA" -u "$AUTH" -X PUT "$ES/events" \
		-H 'Content-Type: application/json' \
		--data-binary @/usr/share/logstash/config/events-mapping.json
fi

exec /usr/local/bin/docker-entrypoint logstash -f /usr/share/logstash/config/events.conf
