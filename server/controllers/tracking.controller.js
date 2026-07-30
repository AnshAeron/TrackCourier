import { getTrackingDetails } from "../services/tracking.service.js";

export const trackShipment = async (req, res) => {
  try {
    const { consignmentA } = req.params;

    const booking = await getTrackingDetails(consignmentA);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Tracking number not found.",
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
