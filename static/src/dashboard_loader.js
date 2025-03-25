/** @odoo-module */

import { registry } from "@web/core/registry";
import { LazyComponent } from "@web/core/assets";
import { Component, xml } from "@odoo/owl";

class AwesomeDashboardLoader extends Component {
    static components = { LazyComponent };
    static template = xml`
        <LazyComponent bundle="'awesome_dashboard.dashboard'" Component="'AwesomeDashboard'" props="props"/>
    `;
}


class ActiveDealsCount extends Component {
    static components = { LazyComponent };
    static template = xml`
        <LazyComponent bundle="'awesome_dashboard.dashboard'" Component="'ActiveDealsCount'" props="props"/>
    `;
}

class UnitsInventoryReport extends Component {
    static components = { LazyComponent };
    static template = xml`
        <LazyComponent bundle="'awesome_dashboard.dashboard'" Component="'UnitsInventoryReport'" props="props"/>
    `;
}
registry.category("actions").add("awesome_dashboard.dashboard", AwesomeDashboardLoader);
registry.category("actions").add("awesome_dashboard.active_deals_count", ActiveDealsCount);
registry.category("actions").add("awesome_dashboard.units_inventory_report", UnitsInventoryReport);