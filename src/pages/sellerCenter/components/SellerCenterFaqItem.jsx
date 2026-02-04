import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SC_FAQ } from "@/constants/sellerCenterStyles";

/**
 * Satıcı Merkezi SSS accordion öğesi
 */
const SellerCenterFaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div className={SC_FAQ.item}>
    <button
      type="button"
      onClick={onToggle}
      className={`${SC_FAQ.trigger} group`}
      aria-expanded={isOpen}
    >
      <span className="text-base font-semibold text-slate-900 pr-4 group-hover:text-emerald-700 transition-colors">
        {question}
      </span>
      <span className={SC_FAQ.iconBtn}>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </span>
    </button>
    {isOpen && (
      <div className={SC_FAQ.content}>
        <div className={SC_FAQ.contentInner}>
          <p className="text-slate-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    )}
  </div>
);

export default SellerCenterFaqItem;
