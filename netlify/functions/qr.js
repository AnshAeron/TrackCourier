import QRCode from "qrcode";

export async function handler(event) {
  try {
    const path = event.path || "";

    const fileName = path.split("/").pop() || "";

    const consignmentA = decodeURIComponent(
      fileName.replace(/\.png$/i, ""),
    ).trim();

    if (!consignmentA) {
      return {
        statusCode: 400,
        body: "Invalid QR request",
      };
    }

    const trackingUrl = `https://trackmycourier.in/track?id=${encodeURIComponent(consignmentA)}`;

    const qrBuffer = await QRCode.toBuffer(trackingUrl, {
      type: "png",
      width: 500,
      margin: 4,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
      isBase64Encoded: true,
      body: qrBuffer.toString("base64"),
    };
  } catch (err) {
    console.error("QR generation error:", err);

    return {
      statusCode: 500,
      body: "Unable to generate QR",
    };
  }
}
