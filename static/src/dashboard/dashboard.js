/** @odoo-module **/

import { Component, useState} from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Layout } from "@web/search/layout";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { DropDown} from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";

class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem, DropDown, DropdownItem };

    setup() {
        this.statisticsService = useState(useService("awesome_dashboard.statistics"));
        this.items = registry.category("awesome_dashboard").getAll();
        this.statistics = this.statisticsService.statistics;
        this.state = this.statistics.isReady;
        if (this.state) {
            this.filters = this.statisticsService.filters;
        }
        this.filterOptions = this.statisticsService.filterOptions;

        // Method to handle filter changes
        this.onFilterChange = (filterType, value) => {
            this.statisticsService.filters[filterType] = value; // Update reactive filters
            this.statisticsService.loadData(); // Reload data with new filters
        };
    }
}

registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);