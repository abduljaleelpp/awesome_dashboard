/** @odoo-module */
import { loadJS } from "@web/core/assets";
import { getColor } from "@web/core/colors/colors";
import { Component, onWillStart, useRef, onMounted, onWillUpdateProps, onWillUnmount } from "@odoo/owl";

export class PieChart extends Component {
    static template = "awesome_dashboard.PieChart";
    static props = {
        label: String,
        data: Object,
    };

    setup() {
        this.canvasRef = useRef("canvas");
        this.chart = null;

        onWillStart(() => loadJS(["/web/static/lib/Chart/Chart.js"]));
        onMounted(() => this.renderChart());

        // Update chart when props change
        onWillUpdateProps((nextProps) => {
            if (this.chart) {
                this.chart.destroy(); // Destroy the old chart
            }
            this.renderChart(nextProps.data);
        });

        onWillUnmount(() => {
            if (this.chart) {
                this.chart.destroy();
            }
        });
    }

    renderChart(data = this.props.data) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        const colors = labels.map((_, index) => getColor(index));

        this.chart = new Chart(this.canvasRef.el, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: this.props.label,
                        data: values,
                        backgroundColor: colors,
                    },
                ],
            },
        });
    }
}