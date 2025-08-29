import { useState } from 'react';

interface BorrowDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (returnDate: string) => void;
  bookTitle: string;
  loading?: boolean;
}

export default function BorrowDateModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bookTitle,
  loading = false 
}: BorrowDateModalProps) {
  const [selectedDate, setSelectedDate] = useState('');

  // Calculate min and max dates (today to 30 days from now)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const minDateStr = today.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleConfirm = () => {
    if (!selectedDate) {
      alert('Please select a return date');
      return;
    }
    onConfirm(selectedDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Borrow Book</h2>
        
        <p className="text-sm text-gray-600 mb-4">
          <strong>{bookTitle}</strong>
        </p>

        <label className="block text-sm font-medium mb-2">Return Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={minDateStr}
          max={maxDateStr}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          disabled={loading}
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !selectedDate}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Borrowing...' : 'Borrow'}
          </button>
        </div>
      </div>
    </div>
  );
}