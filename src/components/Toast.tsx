import { motion, AnimatePresence } from "framer-motion";
import type { Toast } from "@/hooks/useToast";

export function ToastView({ toast }: { toast: Toast | null }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-ink px-4 py-2 text-sm text-background shadow-sm"
          role="status"
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
