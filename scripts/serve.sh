#!/bin/bash
# Starts the ajwoo.com dev server detached, so it keeps running after the
# terminal (or a Claude session) goes away.
#
#   ./scripts/serve.sh          start (no-op if already running)
#   ./scripts/serve.sh stop     stop it
#   ./scripts/serve.sh status   is it up?
#   ./scripts/serve.sh log      tail the log
#
# launchd/nvm note: PATH is set explicitly so this works from any context.

set -uo pipefail

PROJECT="/Users/alexwoo/Desktop/desktop files/Development/www.ajwoo.com minimal system"
PORT=4321
PIDFILE="$PROJECT/logs/dev.pid"
LOG="$PROJECT/logs/dev.log"

export PATH="/Users/alexwoo/.nvm/versions/node/v24.18.0/bin:/usr/local/bin:/usr/bin:/bin"
export NEXT_DIST_DIR=.next-dev

mkdir -p "$PROJECT/logs"

# An HTTP probe is the real question ("is it serving?"), and unlike a sleep-loop
# it works in restricted shells where `sleep` is unavailable.
listening() {
  curl -s -o /dev/null --max-time 2 "http://127.0.0.1:$PORT/" 2>/dev/null
}
wait_until_up() {
  curl -s -o /dev/null --max-time 60 \
    --retry 30 --retry-delay 1 --retry-all-errors --retry-connrefused \
    "http://127.0.0.1:$PORT/" 2>/dev/null
}

case "${1:-start}" in
  run)
    # Foreground mode, for launchd: it must supervise `next` itself, so this
    # never forks. `exec` replaces the shell so KeepAlive tracks the real process.
    cd "$PROJECT" || exit 1
    exec npm run dev
    ;;
  start)
    if listening; then
      echo "already running → http://localhost:$PORT"
      exit 0
    fi
    cd "$PROJECT" || exit 1
    # nohup + & detaches from the calling shell's lifetime; setsid isn't on macOS.
    nohup npm run dev >>"$LOG" 2>&1 &
    echo $! > "$PIDFILE"
    if wait_until_up; then
      echo "started → http://localhost:$PORT"
      exit 0
    fi
    echo "failed to come up; see $LOG" >&2
    exit 1
    ;;
  stop)
    lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | xargs -r kill 2>/dev/null
    [ -f "$PIDFILE" ] && kill "$(cat "$PIDFILE")" 2>/dev/null
    rm -f "$PIDFILE"
    echo "stopped"
    ;;
  status)
    if listening; then echo "up → http://localhost:$PORT"; else echo "down"; fi
    ;;
  log)
    tail -f "$LOG"
    ;;
  *)
    echo "usage: $0 {start|stop|status|log}" >&2; exit 2
    ;;
esac
