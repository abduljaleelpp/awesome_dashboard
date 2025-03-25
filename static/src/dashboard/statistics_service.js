/** @odoo-module */

import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

const statisticsService = {
    dependencies: ["rpc"],
    start(env, { rpc }) {
        const statistics = reactive({ isReady: false });
        const filters = reactive({
            project: "",
            unitType: "",
            salesperson: "",
        });

        const filterOptions = reactive({
            projects: [],
            unitTypes: [],
            salespersons: [],
        });

        async function loadData() {
            const updates = await rpc("/awesome_dashboard/statistics", {
                filters: { ...filters },
            });
            console.log(filters)
            Object.assign(statistics, updates, { isReady: true });
            filterOptions.projects = updates.projects || [];
            filterOptions.unitTypes = updates.unit_types || [];
            filterOptions.salespersons = updates.salespersons || [];
        }
        
        loadData();

        return {
            statistics,
            filters,
            filterOptions,
            loadData,
        };
    },
};

registry.category("services").add("awesome_dashboard.statistics", statisticsService);