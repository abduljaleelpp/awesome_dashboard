/** @odoo-module */
import { Component, onWillStart, useRef, onWillUpdateProps } from "@odoo/owl";
import { useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class DataTable extends Component {
    static template = "awesome_dashboard.DataTable";
    static props = {
        data: { type: [Object, Array, { value: null }], optional: true }, // Accept object, array, or null
        label: { type: String, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.tableRef = useRef("unitTable");

        this.state = useState({
            unitTypeData: [],
            totalCount: 0,
            totalSalesPrice: 0,
        });

        onWillStart(() => this.fetchData(this.props.data));
        onWillUpdateProps((nextProps) => this.fetchData(nextProps.data));
    }

    async fetchData(data) {
        console.log("Received data:", data);

        // Handle invalid or empty data
        if (!data || (Array.isArray(data) && !data.length) || (typeof data === 'object' && !Object.keys(data).length)) {
            console.warn("DataTable received invalid or empty data:", data);
            this.state.unitTypeData = [];
            this.state.totalCount = 0;
            this.state.totalSalesPrice = 0;
            return;
        }

        let totalCount = 0;
        let totalSalesPrice = 0;
        let unitTypeData = [];

        // Handle dictionary format from controller (e.g., unit_type_summary)
        if (!Array.isArray(data)) {
            unitTypeData = Object.entries(data).map(([unitType, values]) => {
                const count = values.x_studio_unit_type_count || 0;
                const salesPrice = values.amount_total || 0;
                totalCount += count;
                totalSalesPrice += salesPrice;

                return {
                    unit_type: unitType || "Unknown",
                    count,
                    sales_price: salesPrice,
                };
            });
        } else {
            // Handle array format (if ever used)
            unitTypeData = data.map((row) => {
                const count = row.x_studio_unit_type_count || 0;
                const salesPrice = row.amount_total || 0;
                totalCount += count;
                totalSalesPrice += salesPrice;

                return {
                    unit_type: row.x_studio_unit_type?.[1] || "Unknown",
                    count,
                    sales_price: salesPrice,
                };
            });
        }

        this.state.unitTypeData = unitTypeData;
        this.state.totalCount = totalCount;
        this.state.totalSalesPrice = totalSalesPrice;

        console.log("Processed unitTypeData:", this.state.unitTypeData);
    }

    /**
     * Formats a number into a human-readable format (e.g., 1.5M, 2.5B).
     * @param {number} num - The number to format.
     * @param {string} [currencySymbol=''] - Optional currency symbol to prepend.
     * @returns {string} - The formatted number.
     */
    formatNumber(num, currencySymbol = '') {
        if (typeof num !== 'number' || isNaN(num)) return `${currencySymbol}0`;
        if (num >= 1e9) return `${currencySymbol}${(num / 1e9).toFixed(2)}B`; // Billion
        if (num >= 1e6) return `${currencySymbol}${(num / 1e6).toFixed(2)}M`; // Million
        if (num >= 1e3) return `${currencySymbol}${(num / 1e3).toFixed(2)}K`; // Thousand
        return `${currencySymbol}${num.toFixed(2)}`; // Default with 2 decimal places
    }
}