/** @odoo-module */
import { loadJS } from "@web/core/assets";
import { getColor } from "@web/core/colors/colors";
import { Component, onWillStart, useRef, onMounted, onWillUpdateProps, onWillUnmount } from "@odoo/owl";

export class BarChart extends Component {
    static template = "awesome_dashboard.BarChart";
    static props = {
        label: String,
        data: Object,
        yAxisLabel: String,
        displayMillions: Boolean,
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
            this.renderChart(nextProps.data, nextProps.yAxisLabel, nextProps.displayMillions);
        });

        onWillUnmount(() => {
            if (this.chart) {
                this.chart.destroy();
            }
        });
    }

    renderChart(data = this.props.data, yAxisLabel = this.props.yAxisLabel, displayMillions = this.props.displayMillions) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        const colors = labels.map((_, index) => getColor(index));

        this.chart = new Chart(this.canvasRef.el, {
            type: "bar",
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
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Sum of Sales Price",
                        },
                        ticks: {
                            callback: function (value) {
                                if (displayMillions) {
                                    return value / 1_000_000 + "M";
                                }
                                return value;
                            },
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxisLabel,
                        },
                    },
                },
                plugins: {
                    legend: { display: false },
                },
            },
        });
    }
}