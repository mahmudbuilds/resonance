import { InworldTTS } from '@inworld/tts';
import fs from 'fs';

const tts = InworldTTS();

const audio = await tts.generate({
    text: 'What a wonderful day to be a text-to-speech model!',
    voice: 'Sarah',
    model: "inworld-tts-1.5-mini"
});

fs.writeFileSync('output.mp3', audio);
console.log('Audio saved to output.mp3');