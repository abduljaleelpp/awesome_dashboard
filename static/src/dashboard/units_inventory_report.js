/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { TextFilterValue } from "./filter_text_value/filter_text_value";


class UnitsInventoryReport extends Component {
    static template = "awesome_dashboard.UnitsInventoryReport";
    static components = { Layout, DashboardItem, TextFilterValue };

    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        this.rpc = useService("rpc");
        this.items = registry.category("awesome_dashboard").getAll();
        this.state = useState({
            selectedFilters: {
                project: "",
                unitType: "",
                salesperson: "",
            },
            statistics: {},
            filtersData: {
                projects: [],
                unit_types: [],
                salespersons: []
            },
            isReady: false,
        });

        this.initializeDashboard();
    }

    async initializeDashboard() {
        try {
            const data = await this.rpc("/awesome_dashboard/statistics", this.state.selectedFilters);
            this.state.statistics = data;
            this.state.filtersData = data.map(project => project.formattedValue); // Extract filters from the response
            console.log(this.state.filterType)
            this.state.isReady = true;
        } catch (error) {
            console.error("Error initializing dashboard:", error);
        }
    }

    async onFilterChange(filterType, value) {
        this.state.selectedFilters[filterType] = value;
        await this.initializeDashboard();
    }
}
registry.category("lazy_components").add("UnitsInventoryReport", UnitsInventoryReport);

