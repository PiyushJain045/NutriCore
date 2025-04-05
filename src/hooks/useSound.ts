
/**
 * A custom hook that provides text-to-speech functionality for exercise feedback
 */
import { useCallback } from 'react';

export const useSound = () => {
  const playSound = useCallback((text: string) => {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
      // Create a new SpeechSynthesisUtterance instance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure the utterance
      utterance.volume = 1; // 0 to 1
      utterance.rate = 1.0; // 0.1 to 10
      utterance.pitch = 1.0; // 0 to 2
      utterance.lang = 'en-US';
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a female English voice (often best for instruction)
      const femaleVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        voice.name.toLowerCase().includes('female')
      );
      
      // Or any English voice as fallback
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en')
      );
      
      // Set the voice if found, otherwise use default
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
      
      console.log('Playing sound:', text);
      return true;
    } else {
      console.warn('Browser does not support speech synthesis');
      return false;
    }
  }, []);

  // Handle for when we need voices that might not be loaded immediately
  const ensureVoicesLoaded = useCallback((callback: () => void) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      callback();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        callback();
      };
    }
  }, []);

  return { playSound, ensureVoicesLoaded };
};
