/** @odoo-module */

import { NumberCard } from "./number_card/number_card";
import { PieChartCard } from "./pie_chart_card/pie_chart_card";
import { registry } from "@web/core/registry";
import { BarChartCard } from "./bar_chart_card/bar_chart_card";
import { DataTableCard } from "./data_table_card/data_table_card";
import { TextFilterValue } from "./filter_text_value/filter_text_value";

const items = [

   /*  {
        id: "project_selection",
        description: "Project",
        Component: SelectionField,
        props: (data) => ({
            title: "Projects",
            value: data.projects,
        })
    }, */

    {
        id: "total_sales",
        description: "Sales",
        Component: NumberCard,
        props: (data) => ({
            title: "Sales",
            value: data.total_sales,
        })
    },
    {
        id: "active_deals",
        description: "No of Active Deals",
        Component: NumberCard,
        size: 0.95,
        props: (data) => ({
            title: "Active Deals",
            value: data.active_deals,
        })
    },
    {
        id: "agencies",
        description: "No of agencies",
        Component: NumberCard,
        size: 0.95,
        props: (data) => ({
            title: "Agencies",
            value: data.agencies,
        })
    },
    /* {
        id: "cancelled_orders",
        description: "Cancelled orders this month",
        Component: NumberCard,
        props: (data) => ({
            title: "Number of cancelled orders this month",
            value: data.nb_cancelled_orders,
        })
    }, */
    {
        id: "active_customers",
        description: "active customers",
        Component: NumberCard,
        size: 1,
        props: (data) => ({
            title: "Customers",
            value: data.customers,
        })
    } ,
    {
        id: "bar_chart",
        description: "Customers",
        Component: BarChartCard,
        size: 2,
        props: (data) => ({
            title: "Top 10 Customers by Sales Price",
            values: data.top_customers,
            yAxisLabel:"Customers",
            displayMillions:true
        })
    },
    {
        id: "top_agency_bar_chart",
        description: "Agency Name",
        Component: BarChartCard,
        size: 2,
        props: (data) => ({
            title: "Top 10 Agencies by Sales Price",
            values: data.top_agencies,
            yAxisLabel:"Agency Name",
            displayMillions:true
        })
    }, 
     {
        id: "top_sales_persons_bar_chart",
        description: "Sales Person",
        Component: BarChartCard,
        size: 2,
        props: (data) => ({
            title: "Top 10 Sales Persons by Sales Price",
            values: data.top_salespersons,
            yAxisLabel:"Sales Person",
            displayMillions:true
        })
    },
    {
        id: "pie_chart",
        description: "Sum of Sales Price by State",
        Component: PieChartCard,
        size: 1,
        props: (data) => ({
            title: "Sum of Sales Price by State",
            values: data.sales_price_by_state,
        })
    }, 
     {
        id: "data_table",
        description: "Details by Unit Type",
        Component: DataTableCard,
        size:2,
        props: (data) => ({
            title: "Sales by Unit Type ",
            values: data.unit_type_summary,
        })
    } 
     
]

/* const global_filters = [
    {
        id: "project_filter",
        description: "Filter by Project",
        Component: TextFilterValue,
        props: (data) => ({
            title: "Sales",
            value: data.projects,
        })
    },
] */
const items_count = [
         {
             id: "total_sales_count",
             description: "Sales",
             Component: NumberCard,
             props: (data) => ({
                 title: "Sales",
                 value: data.total_sales,
             })
         },
         {
             id: "active_deals_count",
             description: "No of Active Deals",
             Component: NumberCard,
             size: 0.95,
             props: (data) => ({
                 title: "Active Deals",
                 value: data.active_deals,
             })
         },
         {
             id: "agencies_count",
             description: "No of agencies",
             Component: NumberCard,
             size: 0.95,
             props: (data) => ({
                 title: "Agencies",
                 value: data.agencies,
             })
         },
         {
             id: "active_customers",
             description: "active customers",
             Component: NumberCard,
             size: 1,
             props: (data) => ({
                 title: "Customers",
                 value: data.customers,
             })
         },
         /* {
            id: "topCustomerByDeals",
            description: "Top Customer by Deals Count",
            Component: BarChartCard,
            size: 2,
            props: (data) => ({
                title: "Top Customers by Deals Count",
                values: data.top_customer_by_deals,
            })
        },
        {
            id: "top_agency_by_deal",
            description: "Agency Name",
            Component: BarChartCard,
            size: 2,
            props: (data) => ({
                title: "Top 10 Agencies by Sales Price",
                values: data.top_agencies_by_deals,
            })
        },  */
         {
            id: "top_sales_persons_by_deal",
            description: "Sales Person",
            Component: BarChartCard,
            size: 2,
            props: (data) => ({
                title: "Top 10 Sales Persons by Sales Price",
                values: data.top_salespersons_by_deals,
                yAxisLabel:"Sales Persons",
                displayMillions:false
                
            })
        }, 
         {
            id: "data_table",
            description: "Details by Unit Type",
            Component: DataTableCard,
            size: 2,
            props: (data) => ({
                title: "Sales by Unit Type ",
                values: data.unit_type_summary,
            })
        }, 
         {
            id: "pie_chart",
            description: "Sum of Sales Price by State",
            Component: PieChartCard,
            size: 2,
            props: (data) => ({
                title: "Sum of Sales Price by State",
                values: data.sales_price_by_state,
                
            })
        }

]
items.forEach(item => {
    registry.category("awesome_dashboard").add(item.id, item);
});
items_count.forEach(item => {
    registry.category("active_deals_count").add(item.id, item);
});