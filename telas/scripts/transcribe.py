import sys, json
from faster_whisper import WhisperModel
model_dir, audio, out = sys.argv[1], sys.argv[2], sys.argv[3]
import os
PROMPT=os.environ.get("PROMPT","Trinta dias, trinta experimentos com Claude. Segue o cobaia.")
m = WhisperModel(model_dir, device="cpu", compute_type="int8")
import wave, numpy as np
wf=wave.open(audio); a=np.frombuffer(wf.readframes(wf.getnframes()),dtype=np.int16).astype(np.float32)/32768
segs, info = m.transcribe(a, language="pt", word_timestamps=True, beam_size=5, vad_filter=False,
    initial_prompt=PROMPT)
words=[]
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    for w in s.words:
        words.append({"w": w.word.strip(), "s": round(w.start,3), "e": round(w.end,3), "p": round(w.probability,3)})
json.dump(words, open(out,"w"), ensure_ascii=False, indent=1)
for w in words: print(f"{w['s']:6.2f} {w['e']:6.2f} {w['p']:.2f} {w['w']}")
