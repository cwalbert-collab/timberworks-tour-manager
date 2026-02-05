import { useEffect, useCallback } from 'react';
import './ConfirmModal.css';

/**
 * Reusable confirmation modal component
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} props.title - Modal title
 * @param {string|React.ReactNode} props.message - Main message content
 * @param {string} props.warning - Optional warning text (displayed in red)
 * @param {string} props.confirmLabel - Label for confirm button (default: "Confirm")
 * @param {string} props.cancelLabel - Label for cancel button (default: "Cancel")
 * @param {string} props.confirmVariant - Button style: "danger" | "primary" (default: "danger")
 * @param {Function} props.onConfirm - Called when confirm is clicked
 * @param {Function} props.onCancel - Called when cancel is clicked or modal is dismissed
 */
export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message,
  warning,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel
}) {
  // Handle escape key to close modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Handle overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal-content" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <h3 id="confirm-modal-title" className="confirm-modal-title">{title}</h3>

        <div className="confirm-modal-body">
          {typeof message === 'string' ? <p>{message}</p> : message}
          {warning && <p className="confirm-modal-warning">{warning}</p>}
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-btn confirm-modal-btn-cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal-btn confirm-modal-btn-${confirmVariant}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to create delete confirmation props
 * @param {string} itemType - Type of item being deleted (e.g., "venue", "contact")
 * @param {string} itemName - Name of the item
 * @param {string} extraWarning - Additional warning text
 * @returns {object} - Props for ConfirmModal
 */
export function getDeleteConfirmProps(itemType, itemName, extraWarning = null) {
  return {
    title: `Delete ${itemType}?`,
    message: (
      <>
        Are you sure you want to delete <strong>{itemName}</strong>?
      </>
    ),
    warning: extraWarning || 'This action cannot be undone.',
    confirmLabel: 'Delete',
    confirmVariant: 'danger'
  };
}
