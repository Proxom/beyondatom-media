# usage: enc.sh name  -> /tmp/claude-0/pl/out/name.mp4 + cover + check frames
v=$1;P=/tmp/claude-0/pl;mkdir -p $P/out/$v
ffmpeg -loglevel error -y -framerate 30 -i $P/f_$v/%04d.jpg -vf "hqdn3d=1.5:1.5:3:3,noise=alls=3:allf=t,format=yuv420p" -c:v libx264 -preset slow -b:v 6800k -maxrate 7500k -bufsize 14000k -pass 1 -passlogfile $P/out/$v/x264 -an -f null /dev/null
ffmpeg -loglevel error -y -framerate 30 -i $P/f_$v/%04d.jpg -i /tmp/claude-0/aud/$v.wav -vf "hqdn3d=1.5:1.5:3:3,noise=alls=3:allf=t,format=yuv420p" -c:v libx264 -preset slow -b:v 6800k -maxrate 7500k -bufsize 14000k -pass 2 -passlogfile $P/out/$v/x264 -c:a aac -b:a 192k -shortest -movflags +faststart $P/out/$v/$v.mp4
ffmpeg -loglevel error -y -i $P/f_$v/0000.jpg -q:v 2 $P/out/$v/cover.jpg
ls -la $P/out/$v/$v.mp4; ffmpeg -i $P/out/$v/$v.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:"
