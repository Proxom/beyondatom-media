#!/bin/bash
# compose.sh PICTURE.mp4 TEXTDIR BED.wav OUT.mp4  -> final 1080x1920 30 fps H.264 CRF 18 + AAC
P=$1; T=$2; A=$3; O=$4
ffmpeg -v error -y -i "$P" -f concat -safe 0 -i "$T/text.txt" -i "$A" -filter_complex "
[0:v]setpts=N/30/TB,fps=30,scale=1080:1920:flags=lanczos,setsar=1,
eq=contrast=1.06:saturation=1.12:gamma=0.98,
hue=s='if(between(t,12.0,14.5),0.3,1)',
eq=brightness='if(between(t,18.0,18.3),0.45*(1-(t-18.0)/0.3),0)':eval=frame,
vignette=angle=0.55,
noise=alls=2:allf=t[v];
[1:v]fps=30,format=rgba[tx];
[v][tx]overlay=0:0:shortest=0:eof_action=pass,format=yuv420p[out]" \
-map "[out]" -map 2:a -t 35.0 -r 30 -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p \
-c:a aac -b:a 192k -ar 48000 -movflags +faststart "$O"
