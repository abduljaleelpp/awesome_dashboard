from odoo import http
from odoo.http import request

class AwesomeDashboardController(http.Controller):

    @http.route("/awesome_dashboard/statistics", type="json", auth="user")
    def get_statistics(self, filters=None, **kwargs):
        """
        Returns dashboard statistics, top performers, and filter options with minimal database queries.
        Filters are applied dynamically based on selected project, unit type, and salesperson.
        Expects filters as a dictionary: {'project': value, 'unitType': value, 'salesperson': value}
        """
        # Base domain for sale orders
        base_domain = [
            ('state', 'not in', ('draft', 'sent', 'cancel')),
            ('sh_sale_process_state', 'in', ('reservation', 'spa', 'registration', 'payment_clearance'))
        ]

        # Ensure filters is a dictionary
        filters = filters or {}
        project = filters.get('project')
        unit_type = filters.get('unitType')
        salesperson = filters.get('salesperson')

        # Apply filters to the domain
        domain = base_domain.copy()
        if project:
            domain.append(('sh_re_project_id', '=', int(project)))
        if unit_type:
            domain.append(('x_studio_unit_type', '=', int(unit_type)))
        if salesperson:
            domain.append(('user_id', '=', int(salesperson)))

        # Log for debugging
        print("Received Filters:", filters)
        print("Applied Domain:", domain)

        # Fetch all required grouped data in a single read_group call
        aggregated_data = request.env['sale.order'].sudo().read_group(
            domain,
            fields=[
                'amount_total:sum',           # For total_sales and sales_price_by_state
                'partner_id',                 # For customers and top_customers
                'user_id',                    # For top_salespersons and top_salespersons_by_deals
                'sh_re_agency_name_id',       # For agencies and top_agencies
                'x_studio_unit_type',         # For unit_type_summary
                'sh_sale_process_state',      # For sales_price_by_state
            ],
            groupby=[
                'partner_id', 'user_id', 'sh_re_agency_name_id',
                'x_studio_unit_type', 'sh_sale_process_state'
            ],
            lazy=False  # Fetch all groupby results in one query
        )

        # Process aggregated data
        total_sales = 0
        active_deals = 0
        customers = set()
        agencies = set()
        top_customers_dict = {}
        top_agencies_dict = {}
        top_salespersons_dict = {}
        top_salespersons_by_deals = {}
        unit_type_summary = {}
        sales_price_by_state = {}

        for record in aggregated_data:
            # Total sales and active deals
            total_sales += record['amount_total']
            active_deals += record['__count']

            # Distinct customers
            if record['partner_id']:
                customers.add(record['partner_id'][0])
                top_customers_dict[record['partner_id'][1]] = record['amount_total']

            # Distinct agencies
            if record['sh_re_agency_name_id']:
                agencies.add(record['sh_re_agency_name_id'][0])
                top_agencies_dict[record['sh_re_agency_name_id'][1]] = record['amount_total']

            # Top salespersons by amount and count
            if record['user_id']:
                top_salespersons_dict[record['user_id'][1]] = record['amount_total']
                top_salespersons_by_deals[record['user_id'][1]] = record['__count']

            # Unit type summary with count and sales price
            if record['x_studio_unit_type']:
                unit_type_summary[record['x_studio_unit_type'][1]] = {
                    'amount_total': record['amount_total'],
                    'x_studio_unit_type_count': record['__count']
                }

            # Sales price by state
            if record['sh_sale_process_state']:
                sales_price_by_state[record['sh_sale_process_state']] = record['amount_total']

        # Sort and limit top performers
        top_customers_dict = dict(sorted(top_customers_dict.items(), key=lambda x: x[1], reverse=True)[:10])
        top_agencies_dict = dict(sorted(top_agencies_dict.items(), key=lambda x: x[1], reverse=True)[:10])
        top_salespersons_dict = dict(sorted(top_salespersons_dict.items(), key=lambda x: x[1], reverse=True)[:10])
        top_salespersons_by_deals = dict(sorted(top_salespersons_by_deals.items(), key=lambda x: x[1], reverse=True)[:10])

        # Fetch filter options (optimized to run on base domain only once)
        filter_options = {}
        for field, output_key in [
            ('sh_re_project_id', 'projects'),
            ('x_studio_unit_type', 'unit_types'),
            ('user_id', 'salespersons')
        ]:
            options = request.env['sale.order'].sudo().read_group(
                base_domain, [field], [field]
            )
            filter_options[output_key] = [
                {"value": str(rec[field][0]), "formattedValue": rec[field][1]}
                for rec in options if rec[field]
            ]

        # Return optimized response
        return {
            'total_sales': total_sales or 0,
            'active_deals': active_deals,
            'agencies': len(agencies),
            'sales_price_by_state': sales_price_by_state,
            'customers': len(customers),
            'top_customers': top_customers_dict,
            'top_agencies': top_agencies_dict,
            'top_salespersons': top_salespersons_dict,
            'unit_type_summary': unit_type_summary,
            'top_salespersons_by_deals': top_salespersons_by_deals,
            'projects': filter_options['projects'],
            'unit_types': filter_options['unit_types'],
            'salespersons': filter_options['salespersons'],
        }