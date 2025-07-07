from flask import Blueprint, request, jsonify
from database.feedback_logger  import submit_feedback_to_db
from reports_Apis.view_feedback import     get_all_feedbacks_sorted_by_station,     get_feedback_report_from_db
from reports_Apis.stations import  get_station_list,    get_total_stations
from reports_Apis.occupancy_report import get_occupancy_report_from_db
from reports_Apis.working_report import get_working_report_from_db
from reports_Apis.activity_report import     get_activity_summary_from_db
from Access.control import token_required



report_bp = Blueprint('report_bp', __name__)

@report_bp.route("/api/submit-feedback", methods=["POST"])

def submit_feedback():
    data = request.json
    result = submit_feedback_to_db(data)
    return jsonify(result)

@report_bp.route("/api/occupancy-summary/<station_id>/<period>", methods=["GET"])

def occupancy_summary(station_id, period):
    selected_date = request.args.get('date')
    if not selected_date:
        return jsonify({"error": "Missing date parameter"}), 400

    report = get_occupancy_report_from_db(station_id, period, selected_date)

    if "error" in report:
        return jsonify(report), 400

    return jsonify(report)

@report_bp.route("/api/working-report/<station_id>/<period>", methods=["GET"])

def get_working_report(station_id, period):
    date = request.args.get("date")
    result = get_working_report_from_db(station_id, period, date)
    return jsonify(result)

@report_bp.route("/api/feedback-report/<station_id>", methods=["GET"])

def feedback_report(station_id):
    result = get_feedback_report_from_db(station_id)
    return jsonify(result)

@report_bp.route("/api/feedback-report/all", methods=["GET"])

def feedbacks():
    result = get_all_feedbacks_sorted_by_station()
    return jsonify(result)

@report_bp.get("/api/stations/total")

def total_stations():
    return {"total_stations": get_total_stations()}

@report_bp.get("/api/stations/list")

def station_list():
    return {"station_ids": get_station_list()}

@report_bp.route('/api/activity_summary', methods=['GET'])

def activity_summary():
    station_id = request.args.get('station_id')
    period = request.args.get('period')

    if not station_id or not period:
        return jsonify({
            "success": False,
            "message": "Missing required parameters: 'station_id' and 'period'."
        }), 400

    try:
        summary = get_activity_summary_from_db(station_id, period)
        return jsonify({
            "success": True,
            "data": summary
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
