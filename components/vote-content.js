'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

// --- CONSTANTS ---
// Contract owner's address
const contractOwnerAddress = '0x2990Cde01ad74DEB84045aC2026284ED02E76dA2';

// --- COMPONENT ---
export default function VoteContent() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [pollsState, setPollsState] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to manage modal visibility
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [pollName, setPollName] = useState('');

  // New state to manage notifications
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { address, isConnected } = useAccount();

  // Check for contract owner
  const isOwner = address && address.toLowerCase() === contractOwnerAddress.toLowerCase();

  // Function to display notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000); // Notification will disappear after 3 seconds
  };

  // Function to fetch data from API (moved up)
  const fetchLocalPolls = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vote');
      if (response.ok) {
        const pollsData = await response.json();
        setPollsState(pollsData.reverse());
      } else {
        console.error('Failed to fetch polls data');
        setPollsState([]);
      }
    } catch (error) {
      console.error('Error fetching polls data:', error);
      setPollsState([]);
    } finally {
      setLoading(false);
    }
  };

  // Logic for submitting a vote to the server
  const submitVoteToServer = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteId: selectedAnswers.id,
          selectedOption: selectedAnswers.option,
          voterAddress: address,
        }),
      });

      if (response.ok) {
        showNotification('Your vote has been successfully cast!', 'success');
        fetchLocalPolls(); // Refresh data after a successful vote
      } else {
        const result = await response.json();
        showNotification(`Error submitting vote: ${result.message}`, 'error');
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
      showNotification('An error occurred while submitting the vote.', 'error');
    } finally {
      setSelectedAnswers({}); // Reset selected answer
      setLoading(false);
    }
  };

  // Function to create a new poll on the server
  const handleCreatePoll = async () => {
    if (!pollName) {
      showNotification('Please enter a poll name.', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/create-poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: pollName }),
      });
      if (response.ok) {
        showNotification('Poll successfully created!', 'success');
        setShowCreatePollModal(false);
        setPollName('');
        fetchLocalPolls(); // Refresh data after creating a poll
      } else {
        showNotification('Error creating poll.', 'error');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      showNotification('An error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a poll on the server
  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/delete-poll', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: pollId }),
      });
      if (response.ok) {
        showNotification('Poll successfully deleted!', 'success');
        fetchLocalPolls(); // Refresh data after deleting a poll
      } else {
        showNotification('Error deleting poll.', 'error');
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      showNotification('An error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalPolls();
  }, []);

  const handleConfirmVote = () => {
    if (!isConnected) {
      showNotification('Please connect your wallet.', 'error');
      return;
    }

    if (!selectedAnswers.id || !selectedAnswers.option) {
      showNotification('Please select an option to vote.', 'error');
      return;
    }

    submitVoteToServer();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p className="text-xl text-gray-400">Loading poll data...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* Notification section */}
      {notification.message && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 rounded-lg px-6 py-3 text-white shadow-lg transition-all duration-300 z-50
            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          `}
          style={{ animation: 'slideDownFadeIn 0.5s ease-out' }}
        >
          {notification.message}
        </div>
      )}

      {/* Container with semi-transparent background and rounded corners */}
      <div className="max-w-3xl mx-auto px-6 py-32 lg:px-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-gray-700/50 mt-16 shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Community Votes
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">
            Take part in shaping the future of our ecosystem.
          </p>
          <div className="mt-8">
            <ConnectButton accountStatus="full" />
          </div>
        </div>

        {isOwner && (
          <section className="mt-16 flex flex-col items-center">
            <button
              className="rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors"
              onClick={() => setShowCreatePollModal(true)}
            >
              Create New Poll (Owner only)
            </button>
          </section>
        )}

        {/* Modal window for creating a poll */}
        {isOwner && showCreatePollModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowCreatePollModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-semibold mb-4 text-white">Create New Poll</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Poll question text"
                  className="w-full rounded-md bg-gray-700 px-4 py-2 text-gray-300"
                  value={pollName}
                  onChange={(e) => setPollName(e.target.value)}
                />
                <button
                  className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors"
                  onClick={handleCreatePoll}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="mt-16 flex flex-col items-center">
          {pollsState.map((vote) => {
            const totalVotes = vote.yes + vote.no;
            const isSelected = selectedAnswers.id === vote.id;
            const hasVoted = vote.voters && vote.voters.includes(address);

            return (
              <div key={vote.id} className="w-full max-w-2xl rounded-lg bg-white/5 p-8 shadow-xl mb-8 relative">
                <h3 className="text-xl font-semibold mb-4">{vote.question}</h3>
                {isOwner && (
                  <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-400"
                    onClick={() => handleDeletePoll(vote.id)}
                  >
                    Delete
                  </button>
                )}
                <div className="flex flex-col gap-4">
                  {Object.entries({ yes: vote.yes, no: vote.no }).map(([optionKey, optionValue]) => {
                    const percentage = totalVotes > 0 ? ((optionValue / totalVotes) * 100).toFixed(1) : 0;
                    const optionLabels = { yes: 'Yes', no: 'No' };
                    const isOptionSelected = isSelected && selectedAnswers.option === optionKey;

                    return (
                      <button
                        key={optionKey}
                        className={`
                          w-full rounded-md px-4 py-2 font-medium flex justify-between items-center
                          ${isOptionSelected ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                          transition-colors
                        `}
                        onClick={() => {
                          if (!isConnected) {
                            showNotification('Please connect your wallet.', 'error');
                            return;
                          }
                          setSelectedAnswers({
                            id: vote.id,
                            option: optionKey,
                          });
                        }}
                        disabled={hasVoted}
                      >
                        <span>{optionLabels[optionKey]}</span>
                        <span className="text-gray-400">
                          {optionValue} ({percentage}%)
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-center sm:gap-4">
                  <button
                    className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors disabled:bg-gray-800"
                    disabled={!isConnected || !isSelected || hasVoted}
                    onClick={handleConfirmVote}
                  >
                    {/* CHANGE: dynamic button text */}
                    {hasVoted ? 'Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}