// @ts-nocheck
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  onEnd?: () => void;
}

export function useSpeech(options: SpeechOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize voices
  useEffect(() => {
    const synth = window.speechSynthesis;

    // Function to load and set available voices
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Chrome loads voices asynchronously, so we need this event
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Function to speak text
  const speak = useCallback((text: string, speakOptions: SpeechOptions = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set options
    const mergedOptions = { ...options, ...speakOptions };
    if (mergedOptions.rate) utterance.rate = mergedOptions.rate;
    if (mergedOptions.pitch) utterance.pitch = mergedOptions.pitch;
    if (mergedOptions.volume) utterance.volume = mergedOptions.volume;
    if (mergedOptions.voice) utterance.voice = mergedOptions.voice;

    // Set event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentText('');

      // Call the onEnd callback if provided
      if (mergedOptions.onEnd) {
        mergedOptions.onEnd();
      }
    };

    utterance.onerror = (event) => {
      // console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [options]);

  // Function to pause speech
  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  // Function to resume speech
  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  // Function to cancel speech
  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText('');
  }, []);

  return {
    speak,
    pause,
    resume,
    cancel,
    voices,
    isSpeaking,
    isPaused,
    currentText
  };
}
