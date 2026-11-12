# Makes the "needs you" sound the notification plays: a soft knock of two quick A5 bell notes, then a rising E6, sine tones with a
# light octave partial, a 5 ms fade in and an exponential fade out, peak at -12 dBFS, 0.9 s. Unlike sounds/ready.wav, which only
# rises, it calls twice before it rises. build.sh runs it: python3 sound.py <out.wav>
import sys, wave, struct, math
RATE = 44100
LENGTH = 0.9
PEAK = 10 ** (-12 / 20)
notes = [(880.0, 0.0, 0.8), (880.0, 0.13, 0.8), (1318.5, 0.26, 1.0)]  # frequency, start in seconds, loudness
n = int(RATE * LENGTH)
samples = [0.0] * n
for freq, at, loud in notes:
    s0 = int(at * RATE)
    for i in range(s0, n):
        t = (i - s0) / RATE
        attack = min(1.0, t / 0.005)
        decay = math.exp(-t / 0.15)
        tail = min(1.0, (LENGTH - i / RATE) / 0.05)
        v = math.sin(2 * math.pi * freq * t) + 0.18 * math.sin(2 * math.pi * 2 * freq * t) * math.exp(-t / 0.06)
        samples[i] += loud * attack * decay * tail * v
top = max(abs(v) for v in samples)
samples = [v / top * PEAK for v in samples]
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE)
    w.writeframes(b''.join(struct.pack('<h', int(round(v * 32767))) for v in samples))
