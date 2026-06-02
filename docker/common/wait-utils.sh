#!/bin/bash
#===============================================================================
# Wait utilities for Docker bootstrap scripts
# Replaces hard-coded sleep loops with conditional polling.
#===============================================================================

wait_for_file() {
	local path="$1"
	local timeout="${2:-120}"
	local elapsed=0

	while [ ! -f "$path" ]; do
		if [ "$elapsed" -ge "$timeout" ]; then
			echo "ERROR: Timeout waiting for file: $path (after ${timeout}s)" >&2
			return 1
		fi
		echo "Waiting for file: $path (${elapsed}s/${timeout}s)"
		sleep 2
		elapsed=$((elapsed + 2))
	done
	echo "File ready: $path"
}

wait_for_tcp() {
	local host="$1"
	local port="$2"
	local timeout="${3:-120}"
	local elapsed=0

	while ! nc -z "$host" "$port" >/dev/null 2>&1; do
		if [ "$elapsed" -ge "$timeout" ]; then
			echo "ERROR: Timeout waiting for TCP ${host}:${port} (after ${timeout}s)" >&2
			return 1
		fi
		echo "Waiting for TCP ${host}:${port} (${elapsed}s/${timeout}s)"
		sleep 2
		elapsed=$((elapsed + 2))
	done
	echo "TCP ready: ${host}:${port}"
}

wait_for_http() {
	local url="$1"
	local timeout="${2:-120}"
	local expected_code="${3:-200}"
	shift 3
	local elapsed=0

	while true; do
		local code
		code=$(curl -sSf -o /dev/null -w "%{http_code}" "$@" "$url" 2>/dev/null || true)
		if [ "$code" = "$expected_code" ]; then
			echo "HTTP ${expected_code} reached: ${url}"
			return 0
		fi
		if [ "$elapsed" -ge "$timeout" ]; then
			echo "ERROR: Timeout waiting for HTTP ${expected_code} on ${url} (after ${timeout}s)" >&2
			return 1
		fi
		echo "Waiting for ${url} ... (${elapsed}s/${timeout}s) [last code: ${code:-none}]"
		sleep 2
		elapsed=$((elapsed + 2))
	done
}
