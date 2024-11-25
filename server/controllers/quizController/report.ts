import { RequestHandler } from "express";

import ProjectError from "../../helper/error";
import Report from "../../models/report";
import { ReturnResponse } from "../../utils/interfaces";
import apiResponse from "../../utils/apiResponse";

const getReport: RequestHandler = async (req, res, next) => {
  try {
    let report;
    if (!!req.params.reportId) {
      const reportId = req.params.reportId;
      report = await Report.findById(reportId);

      if (!report) {
        const err = new ProjectError("No report found!");
        err.statusCode = 404;
        throw err;
      }

      // if (report.userId.toString() !== req.user?._id) {
      //   const err = new ProjectError("You are not allowed");
      //   err.statusCode = 405;
      //   throw err;
      // }

      report = await Report.findById({ _id: req.params.reportId });
    } else {
      report = await Report.find({ userId: req.user?._id });
    }

    if (!report) {
      const err = new ProjectError("Report not found");
      err.statusCode = 404;
      throw err;
    }

    apiResponse.success(res, report, "Report!");
  } catch (error) {
    next(error);
  }
};

export { getReport };
