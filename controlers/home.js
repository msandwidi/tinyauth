const get_ping = (req, res) => {
  res.status(200).json({
    success: true,
    text: "Up and Running..."
  });
};

const get_landing = (req, res) => {
  res.status(200).json({
    text: "TinyAuth...",
    success: true
  });
}

module.exports = app => {
  app.get("/api/ping", get_ping);
  app.get("/api/home", get_landing);
};