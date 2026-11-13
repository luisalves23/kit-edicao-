#!/bin/bash
# Encode final: vídeo do HyperFrames + mix -> HQ (para postar) e leve (< 25 MB). x264 dois passes, bt709, faststart.
# uso (na pasta do projeto): bash assets/scripts/encode.sh render/video.mp4 mix/mix_final.wav NN
set -e; IN=$1; AU=$2; NN=$3; mkdir -p entrega; cd entrega
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ../$AU)
V="-c:v libx264 -preset slow -profile:v high -level 4.2 -pix_fmt yuv420p -g 60 -r 30"; C="-color_primaries bt709 -color_trc bt709 -colorspace bt709"
enc(){ ffmpeg -y -v error -i ../$IN $V -b:v $1 -maxrate $2 -bufsize $3 -pass 1 -passlogfile p$4 -an -t $T -f mp4 /dev/null
       ffmpeg -y -v error -i ../$IN -i ../$AU -map 0:v -map 1:a $V -b:v $1 -maxrate $2 -bufsize $3 -pass 2 -passlogfile p$4 $C -c:a aac -b:a $5 -ar 48000 -ac 2 -t $T -movflags +faststart $6; }
enc 8000k 12000k 16000k hq 256k cobaia-dia$NN-final.mp4
B=$(python3 -c "print(int(192000/$T-160))")
enc ${B}k $((B*3/2))k $((B*2))k lv 160k cobaia-dia$NN-final-leve.mp4
rm -f p*.log*; ls -la; ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames,width,height,r_frame_rate -of csv=p=0 cobaia-dia$NN-final.mp4
