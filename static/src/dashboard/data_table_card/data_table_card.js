/** @odoo-module */
import { Component, useState, onWillUpdateProps } from "@odoo/owl";
import { DataTable } from "../data_table/data_table";

export class DataTableCard extends Component {
    static template = "awesome_dashboard.DataTableCard";
    static components = { DataTable };
    static props = {
        title: { type: String },
        values: { type: Object },
    };

    setup() {
        this.state = useState({
            values: this.props.values,
        });

        // Update state when props change due to filter application
        onWillUpdateProps((nextProps) => {
            this.state.values = nextProps.values;
        });
    }
}