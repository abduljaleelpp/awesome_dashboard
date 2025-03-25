from odoo import http
from odoo.http import request

class AwesomeDashboardController(http.Controller):

    @http.route("/awesome_dashboard/statistics", type="json", auth="user")
    def get_statistics(self, filters=None, **kwargs):
        """
        Returns dashboard statistics, top performers, and available filter options.
        Filters are applied dynamically based on selected project, unit type, and salesperson.
        Expects filters as a dictionary: {'project': value, 'unitType': value, 'salesperson': value}
        """
        # Default domain for sale orders
        domain = [
            ('state', 'not in', ('draft', 'sent', 'cancel')),
            ('sh_sale_process_state', 'in', ('reservation', 'spa', 'registration', 'payment_clearance'))
        ]

        # Ensure filters is a dictionary, default to empty dict if not provided
        filters = filters or {}

        # Extract filter values (convert to int where necessary, handle empty strings)
        project = filters.get('project') if filters.get('project') else None
        unit_type = filters.get('unitType') if filters.get('unitType') else None
        salesperson = filters.get('salesperson') if filters.get('salesperson') else None

        # Fetch filter options (available projects, unit types, salespersons)
        projects = request.env['sale.order'].sudo().read_group(
            domain, ['sh_re_project_id'], ['sh_re_project_id']
        )
        projects_list = [
            {"value": str(proj['sh_re_project_id'][0]), "formattedValue": proj['sh_re_project_id'][1]}
            for proj in projects if proj['sh_re_project_id']
        ]

        unit_types = request.env['sale.order'].sudo().read_group(
            domain, ['x_studio_unit_type'], ['x_studio_unit_type']
        )
        unit_types_list = [
            {"value": str(unit['x_studio_unit_type'][0]), "formattedValue": unit['x_studio_unit_type'][1]}
            for unit in unit_types if unit['x_studio_unit_type']
        ]

        salespersons = request.env['sale.order'].sudo().read_group(
            domain, ['user_id'], ['user_id']
        )
        salespersons_list = [
            {"value": str(sp['user_id'][0]), "formattedValue": sp['user_id'][1]}
            for sp in salespersons if sp['user_id']
        ]

        # Log received filters for debugging
        print("Received Filters:", filters)

        # Apply filters to the domain if they exist and are not empty
        if project:
            domain.append(('sh_re_project_id', '=', int(project)))
        if unit_type:
            domain.append(('x_studio_unit_type', '=', int(unit_type)))
        if salesperson:
            domain.append(('user_id', '=', int(salesperson)))

        print("Applied Domain:", domain)

        # Fetch top customers based on filtered domain
        top_customers = request.env['sale.order'].read_group(
            domain, ['partner_id', 'amount_total'], ['partner_id'],
            orderby='amount_total desc', limit=10
        )
        top_customers_dict = {
            customer['partner_id'][1]: customer['amount_total']
            for customer in top_customers if customer['partner_id']
        }

        # Fetch top salespersons by deal count
        top_salespeople = request.env['sale.order'].read_group(
            domain, fields=['user_id', 'amount_total'], groupby=['user_id'],
            orderby='amount_total desc', limit=10
        )
        sales_dict = {
            record['user_id'][1]: record['amount_total']
            for record in top_salespeople if record['user_id']
        }

        # Fetch top agencies based on filtered domain
        top_agencies = request.env['sale.order'].read_group(
            domain, ['sh_re_agency_name_id', 'amount_total'], ['sh_re_agency_name_id'],
            orderby='amount_total desc', limit=10
        )
        top_agencies_dict = {
            agency['sh_re_agency_name_id'][1]: agency['amount_total']
            for agency in top_agencies if agency['sh_re_agency_name_id']
        }

        # Fetch top salespersons by sales amount
        top_salespersons = request.env['sale.order'].read_group(
            domain, ['user_id', 'amount_total'], ['user_id'],
            orderby='amount_total desc', limit=10
        )
        top_salespersons_dict = {
            sp['user_id'][1]: sp['amount_total']
            for sp in top_salespersons if sp['user_id']
        }

        # Get total active deals count based on filters
        active_deals = request.env['sale.order'].search_count(domain)
        agencies = request.env['sale.order'].read_group(domain, ['sh_re_agency_name_id'], ['sh_re_agency_name_id'])
        unit_type_summary = request.env['sale.order'].read_group(
            domain, ['x_studio_unit_type', 'amount_total'], ['x_studio_unit_type']
        )

        total_sales = request.env['sale.order'].read_group(domain, ['amount_total:sum'], [])[0].get('amount_total', 0)
        customer_count_data = request.env['sale.order'].read_group(domain, ['partner_id'], ['partner_id'])
        distinct_customer_count = len(customer_count_data)
        distinct_agencies_count = len(agencies)
        """ nationality_data = request.env['sale.order'].sudo().read_group(
            domain,
            fields=[],                          # No aggregation needed, just count
            groupby=['partner_id.country_id'],  # Group by partner's country
            orderby='__count desc',             # Sort by count descending
            limit=10                            # Limit to top 10
        )
        top_nationalities = {
            record['partner_id.country_id'][1]: record['__count']
            for record in nationality_data if record['partner_id.country_id']
        } """
        # Sales price by state
        result = request.env['sale.order'].read_group(
            domain, ['sh_sale_process_state', 'amount_total:sum'], ['sh_sale_process_state']
        )
        state_count_dict = {res['sh_sale_process_state']: res['amount_total'] for res in result}

        # Return the response dictionary
        return {
            'total_sales': total_sales or 0,
            'active_deals': active_deals,
            'agencies': distinct_agencies_count,
            'sales_price_by_state': state_count_dict,
            'customers': distinct_customer_count,
            'top_customers': top_customers_dict,
            'top_agencies': top_agencies_dict,
            'top_salespersons': top_salespersons_dict,
            'unit_type_summary': unit_type_summary,
            'top_salespersons_by_deals': sales_dict,
            'projects': projects_list,
            'unit_types': unit_types_list,
            'salespersons': salespersons_list,
            # 'top_nationalities_by_count': top_nationalities
        }