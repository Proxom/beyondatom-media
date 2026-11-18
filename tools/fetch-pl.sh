#!/bin/bash
# Rebuild tools/pl/<id>.jpg (900x900 planet disk crops from NASA public-domain images) used by
# p_planet-ball-drop.html, p_planet-spin-race.html and p_fly-around-planets.html. tools/pl is git-ignored.
# usage: bash tools/fetch-pl.sh [ids...]   (default: the 8 planet images)
set -e; T=$(cd "$(dirname "$0")" && pwd); mkdir -p "$T/pl/raw"; cd "$T/pl"
IDS=${@:-"PIA15162 PIA23791 as17-148-22727 PIA00407 PIA04866 PIA21046 PIA18182 PIA01492"}
for id in $IDS; do
  [ -s raw/$id.jpg ] && continue
  url=$(curl -sf "https://images-api.nasa.gov/asset/$id" | python3 -c "import sys,json;u=[i['href'] for i in json.load(sys.stdin)['collection']['items'] if i['href'].lower().endswith('~orig.jpg')];print(u[0].replace('http://','https://'))")
  curl -sfL -o raw/$id.jpg "$url"; echo "got $id"
done
python3 "$T/planet-spin-race.crop.py" $IDS
