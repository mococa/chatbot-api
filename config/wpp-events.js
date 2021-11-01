export const clientNew = async (connection) => {
  connection.on("qr", (qr) => {
    console.log({ qr });
    QRCode.toDataURL(qr).then((qrcode) => {
      WhatsappBot.setQR(qrcode);
    });
  });

  await connection
    .connect()
    //.catch((err) => console.log("unexpected error: " + err)); // catch any errors
};
