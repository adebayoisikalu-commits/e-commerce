import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-card"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="modal-actions">
              <button className="button button--ghost" onClick={onCancel}>
                Cancel
              </button>
              <button className="button button--primary" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
