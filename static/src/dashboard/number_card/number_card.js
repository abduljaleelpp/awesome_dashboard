/** @odoo-module */

import { Component } from "@odoo/owl";

export class NumberCard extends Component {
    static template = "awesome_dashboard.NumberCard";
    static props = {
        title: {
            type: String,
        },
        value: {
            type: Number,
        }
    }
     /**
     * Formats a number into a human-readable format (e.g., 1.5M, 2.5B).
     * @param {number} num - The number to format.
     * @param {string} [currencySymbol=''] - Optional currency symbol to prepend.
     * @returns {string} - The formatted number.
     */
     formatNumber(num, currencySymbol = '') {
        if (num >= 1e9) { // Billion
            return `${currencySymbol}${(num / 1e9).toFixed(2)}B`;
        } else if (num >= 1e6) { // Million
            return `${currencySymbol}${(num / 1e6).toFixed(2)}M`;
        } else if (num >= 1e3) { // Thousand
            return `${currencySymbol}${(num / 1e3).toFixed(2)}K`;
        } else {
            return `${currencySymbol}${num.toString()}`; // Return as is for smaller numbers
        }
    }
    
}
