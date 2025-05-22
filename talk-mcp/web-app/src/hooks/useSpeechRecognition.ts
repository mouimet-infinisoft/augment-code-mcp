'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setHasRecognitionSupport(true);
        const recognitionInstance = new SpeechRecognition();

        // Configure recognition
        recognitionInstance.continuous = false; // Changed to false to avoid accumulating text
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 1;

        // Set up event handlers
        recognitionInstance.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          // Process results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          // Only update with final results or the latest interim result
          if (finalTranscript) {
            setTranscript(finalTranscript);
          } else if (interimTranscript) {
            setTranscript(interimTranscript);
          }
        };

        recognitionInstance.onerror = (event) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          // If we're still in listening state but recognition ended,
          // it might have auto-stopped after silence
          if (isListening) {
            // Try to restart if we're still supposed to be listening
            try {
              recognitionInstance.start();
            } catch (err) {
              // If we can't restart, update the state
              setIsListening(false);
              setError(`Recognition ended: ${err}`);
            }
          } else {
            setIsListening(false);
          }
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (recognition) {
      try {
        // Make sure we're not already listening
        if (isListening) {
          recognition.stop();
        }

        // Clear previous transcript and errors
        setTranscript('');
        setError(null);

        // Start after a small delay to ensure clean state
        setTimeout(() => {
          recognition.start();
          setIsListening(true);
        }, 100);
      } catch (err) {
        setError(`Failed to start speech recognition: ${err}`);
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
    error
  };
}

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
