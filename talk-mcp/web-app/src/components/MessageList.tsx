'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSpeech } from '@/hooks/useSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { stripMarkdown } from '@/utils/textUtils';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  role: 'user' | 'assistant';
  spoken?: boolean;
}

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  // We'll use isListening from the hook instead of a separate state
  const { speak, voices, isSpeaking, cancel } = useSpeech();
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition();

  // Reference to message container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from the API - only get new messages from MCP tool
  const fetchMessages = async () => {
    try {
      // Only get new messages from MCP tool (not marked as sent on the server)
      const response = await axios.get('/api/mcp/speak');

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

          // Strip markdown for speech
          const plainText = stripMarkdown(messageToSpeak.text);

          speak(plainText, {
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

  // Fetch all messages for initial load
  const fetchAllMessages = async () => {
    try {
      setLoading(true);
      // Get all messages (both user and assistant)
      const response = await axios.get('/api/mcp/speak?all=true');

      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching all messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a user message
  const sendUserMessage = async () => {
    if (!userInput.trim()) return;

    try {
      setSendingMessage(true);

      // Create a temporary message to show immediately
      const tempMessage: Message = {
        id: 'temp-' + Date.now(),
        text: userInput,
        timestamp: new Date().toISOString(),
        role: 'user',
        spoken: true // User messages don't need to be spoken
      };

      // Add to local messages
      setMessages(prev => [...prev, tempMessage]);

      // Send to API
      await axios.post('/api/user/speak', { text: userInput });

      // Clear input
      setUserInput('');
    } catch (error) {
      console.error('Error sending user message:', error);
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== 'temp-' + Date.now()));
    } finally {
      setSendingMessage(false);
    }
  };

  // Initial fetch and polling for new messages
  useEffect(() => {
    // Fetch all messages for initial load
    fetchAllMessages();

    // Set up polling every 2 seconds for new messages
    const intervalId = setInterval(fetchMessages, 2000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [/* Empty dependency array to run only once */]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update user input when speech recognition transcript changes
  useEffect(() => {
    if (isListening && transcript) {
      setUserInput(transcript);
    }
  }, [transcript, isListening]);

  // Reset transcript when stopping listening
  useEffect(() => {
    if (!isListening) {
      resetTranscript();
    }
  }, [isListening, resetTranscript]);

  // Set default voice to Microsoft Jenny Online (Natural) - English (United States)
  useEffect(() => {
    if (voices.length > 0) {
      const jennyVoice = voices.find(voice =>
        voice.name.includes('Microsoft Jenny Online (Natural)') &&
        voice.lang.includes('en-US')
      );

      if (jennyVoice) {
        setSelectedVoice(jennyVoice);
        console.log('Set default voice to Microsoft Jenny Online (Natural)');
      } else {
        // Fallback to first English voice if Jenny is not available
        const englishVoice = voices.find(voice => voice.lang.includes('en'));
        if (englishVoice) {
          setSelectedVoice(englishVoice);
          console.log('Fallback to first English voice:', englishVoice.name);
        }
      }
    }
  }, [voices]);

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

    // Strip markdown for speech
    const plainText = stripMarkdown(message.text);

    // Speak immediately
    speak(plainText, {
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
      <div style={{
        backgroundColor: 'var(--settings-bg)',
        borderColor: 'var(--settings-border)',
        color: 'var(--settings-text)'
      }} className="p-4 rounded-lg mb-4 shadow-sm border">
        <h2 className="text-lg font-semibold mb-2">Speech Settings</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Voice
            </label>
            <select
              style={{
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--input-text)'
              }}
              className="w-full p-2 border rounded-md"
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
              <p className="text-xs text-amber-500 mt-1 font-medium">
                Loading voices... If no voices appear, your browser may not support speech synthesis.
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
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
              <span className="text-sm font-medium">
                Auto-speak new messages
              </span>
            </label>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-dark)'
        }}
        className="flex-1 overflow-y-auto mb-4 border rounded-lg shadow-sm"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mb-2"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p style={{ color: 'var(--text-dark)' }} className="font-medium">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center">
            <p style={{ color: 'var(--text-dark)' }} className="mb-2 font-medium text-lg">No messages yet</p>
            <p style={{ color: 'var(--text-light)' }}>When the MCP tool sends text, it will appear here and be spoken aloud.</p>
          </div>
        ) : (
          <ul style={{ borderColor: 'var(--card-border)' }} className="divide-y">
            {messages.slice(-20).map((message) => (
              <li
                key={message.id}
                style={{
                  borderColor: message.role === 'assistant'
                    ? message.spoken ? 'var(--primary-dark)' : 'var(--primary)'
                    : 'var(--primary)'
                }}
                className={`p-4 hover:opacity-90 ${
                  message.role === 'assistant'
                    ? message.spoken ? 'border-l-4 pl-3' : ''
                    : 'border-r-4 pr-3'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span
                        style={{
                          backgroundColor: message.role === 'assistant' ? 'var(--primary-light)' : 'var(--primary-light)',
                          color: message.role === 'assistant' ? 'var(--primary-dark)' : 'var(--primary-dark)'
                        }}
                        className="text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {message.role === 'assistant' ? 'Assistant' : 'You'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-dark)' }} className="font-medium prose prose-sm max-w-none">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center mt-1">
                      <p style={{ color: 'var(--text-light)' }} className="text-sm">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.role === 'assistant' && message.spoken && (
                        <span style={{ color: 'var(--primary-dark)' }} className="ml-2 text-xs flex items-center font-medium">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Spoken
                        </span>
                      )}
                    </div>
                  </div>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(message)}
                      style={{ color: 'var(--primary)' }}
                      className="ml-2 p-2 rounded-full hover:opacity-80"
                      title={message.spoken ? "Speak this message again" : "Speak this message"}
                    >
                      🔊
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* User input form */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-dark)'
        }}
        className="mb-4 border rounded-lg shadow-sm p-4"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendUserMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message here..."
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--input-text)'
            }}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sendingMessage || isListening}
          />

          {/* Speech-to-text button */}
          {hasRecognitionSupport && (
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  resetTranscript();
                  startListening();
                }
              }}
              style={{
                backgroundColor: isListening ? 'var(--primary-dark)' : 'var(--primary-light)',
                color: isListening ? 'white' : 'var(--primary-dark)'
              }}
              className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2`}
              title={isListening ? "Stop recording" : "Start speech-to-text"}
              disabled={sendingMessage}
            >
              {isListening ? (
                <span className="flex items-center">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </span>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}

          {/* Send button */}
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white'
            }}
            className={`px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              sendingMessage || isListening || !userInput.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={sendingMessage || isListening || !userInput.trim()}
          >
            {sendingMessage ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send'
            )}
          </button>
        </form>

        {/* Speech recognition status */}
        {isListening && (
          <div className="mt-2 text-sm flex items-center" style={{ color: 'var(--text-light)' }}>
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Recording... Speak now
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'var(--settings-bg)',
          borderColor: 'var(--settings-border)',
          color: 'var(--settings-text)'
        }}
        className="text-center p-2 rounded-lg border flex justify-center items-center space-x-4"
      >
        <p>
          {autoSpeak ? (
            <span style={{ color: 'var(--primary-dark)' }} className="font-medium">✓ Auto-speak is enabled</span>
          ) : (
            <span style={{ color: 'var(--text-dark)' }}>Auto-speak is disabled</span>
          )}
        </p>

        {isSpeaking && (
          <div className="flex items-center">
            <div className="flex items-center font-medium mr-3" style={{ color: 'var(--primary)' }}>
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--primary-light)' }}></span>
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--primary)' }}></span>
              </span>
              Speaking...
            </div>
            <button
              onClick={cancel}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Stop speaking"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
