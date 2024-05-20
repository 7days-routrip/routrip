import app, { server } from "@/app";

const PORT = 1234;
server.listen(PORT, () => {
  console.log("HTTPS server listening on port " + PORT);
});

const PORT_HTTP = 80;
app.listen(PORT_HTTP, () => {
  console.log("HTTP server listening on port" + PORT_HTTP);
});
