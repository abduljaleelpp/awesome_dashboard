/** @odoo-module **/

import { Component, useState,onMounted,reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { TextFilterValue } from "./filter_text_value/filter_text_value";
import { BarChart } from "./bar_chart/bar_chart";

class ActiveDealsCount extends Component {
    static template = "awesome_dashboard.ActiveDealsCount";
    static components = { Layout, DashboardItem, TextFilterValue,BarChart };

    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        this.rpc = useService("rpc");
        this.items = registry.category("active_deals_count").getAll();
        this.state = useState({
            statistics: {},
            selectedFilters: {
                project: "",
                unitType: "",
                salesperson: "",
            },
            isReady: false,
        });
        this.filtersData= {
            projects: [],
            unit_types: [],
            salespersons: []
        };
        onMounted(this.initializeDashboard);
    }

    async initializeDashboard() {
        try {
            const data = await this.rpc("/awesome_dashboard/statistics", this.state.selectedFilters);
            this.state.statistics = data;
            this.top_customer = data.top_customers;
            this.filtersData.projects = data.projects;
            this.filtersData.unit_types = data.unit_types;
            this.filtersData.salespersons= data.salespersons;
            this.project_keys = Object.keys(this.filtersData.projects).toString();
            this.unit_types_keys= Object.keys(this.filtersData.unit_types).toString();
            this.salespersons_keys = Object.keys(this.filtersData.salespersons).toString
            console.log(this.project_keys);
            console.log(this.unit_types_keys);
            console.log(this.salespersons_keys);
            this.state.isReady = true;
        } catch (error) {
            console.error("Error initializing dashboard:", error);
        }
    }

    onFilterChange = async (filterType, value) => { // Use arrow function here
        console.log(filterType, value);
        this.state.selectedFilters[filterType] = value;
        await this.initializeDashboard();
    };
}

registry.category("lazy_components").add("ActiveDealsCount", ActiveDealsCount);

