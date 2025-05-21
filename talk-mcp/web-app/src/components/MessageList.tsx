'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpeech } from '@/hooks/useSpeech';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  spoken?: boolean;
}

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [loading, setLoading] = useState(true);
  const { speak, voices, isSpeaking, cancel } = useSpeech();

  // Fetch messages from the API - only get new messages
  const fetchMessages = async () => {
    try {
      // Only get new messages (not marked as sent on the server)
      const response = await axios.get('/api/speak');

      if (response.data && response.data.messages && response.data.messages.length > 0) {
        // Add new messages to our list
        const newMessages = response.data.messages;
        setMessages(prev => [...prev, ...newMessages]);

        // Get current state values to avoid closure issues
        const currentAutoSpeak = autoSpeak;
        const currentIsSpeaking = isSpeaking;
        const currentVoice = selectedVoice;
        const currentRate = rate;

        // If auto-speak is enabled, speak the new messages
        if (currentAutoSpeak && !currentIsSpeaking && newMessages.length > 0) {
          // Only speak the first message if there are multiple
          const messageToSpeak = newMessages[0];
          speak(messageToSpeak.text, {
            voice: currentVoice,
            rate: currentRate,
            onEnd: () => {
              // Mark the message as spoken
              setMessages(prevMessages =>
                prevMessages.map(msg =>
                  msg.id === messageToSpeak.id ? { ...msg, spoken: true } : msg
                )
              );
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling for new messages
  useEffect(() => {
    // Fetch messages immediately
    fetchMessages();

    // Set up polling every 2 seconds
    const intervalId = setInterval(fetchMessages, 2000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [/* Empty dependency array to run only once */]);

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Handle voice selection
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex = parseInt(e.target.value);
    setSelectedVoice(voices[voiceIndex] || null);
  };

  // Handle rate change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  };

  // Speak a specific message
  const speakMessage = (message: Message) => {
    // Cancel any ongoing speech
    if (isSpeaking) {
      cancel();
    }

    // Speak immediately
    speak(message.text, {
      voice: selectedVoice,
      rate,
      onEnd: () => {
        // Mark the message as spoken
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === message.id ? { ...msg, spoken: true } : msg
          )
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-50 p-4 rounded-lg mb-4 shadow-sm border border-blue-100">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">Speech Settings</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Voice
            </label>
            <select
              className="w-full p-2 border border-blue-200 rounded-md bg-white text-black"
              onChange={handleVoiceChange}
              value={voices.indexOf(selectedVoice as SpeechSynthesisVoice)}
              disabled={voices.length === 0}
            >
              <option value="-1">Default Voice</option>
              {voices.map((voice, index) => (
                <option key={voice.name} value={index}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
            {voices.length === 0 && (
              <p className="text-xs text-amber-600 mt-1 font-medium">
                Loading voices... If no voices appear, your browser may not support speech synthesis.
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Speed: {rate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={handleRateChange}
              className="w-full accent-blue-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={() => setAutoSpeak(!autoSpeak)}
                className="mr-2 accent-blue-500 w-4 h-4"
              />
              <span className="text-sm font-medium text-blue-700">
                Auto-speak new messages
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-800 font-medium">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center">
            <p className="mb-2 text-gray-800 font-medium text-lg">No messages yet</p>
            <p className="text-gray-600">When the MCP tool sends text, it will appear here and be spoken aloud.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`p-4 hover:bg-blue-50 ${message.spoken ? 'border-l-4 border-green-500 pl-3' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{message.text}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-600">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.spoken && (
                        <span className="ml-2 text-xs text-green-600 flex items-center font-medium">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Spoken
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => speakMessage(message)}
                    className={`ml-2 p-2 rounded-full hover:bg-blue-100 ${
                      message.spoken ? 'text-blue-400 hover:text-blue-600' : 'text-blue-500 hover:text-blue-700'
                    }`}
                    title={message.spoken ? "Speak this message again" : "Speak this message"}
                  >
                    🔊
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100 flex justify-center items-center space-x-4">
        <p>
          {autoSpeak ? (
            <span className="text-green-600 font-medium">✓ Auto-speak is enabled</span>
          ) : (
            <span className="text-gray-700">Auto-speak is disabled</span>
          )}
        </p>

        {isSpeaking && (
          <div className="flex items-center text-blue-600 font-medium">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Speaking...
          </div>
        )}
      </div>
    </div>
  );
}
