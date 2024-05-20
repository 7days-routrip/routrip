import app, { server } from "@/app";

const PORT = 1234;
server.listen(PORT, () => {
  console.log("HTTPS server listening on port " + PORT);
});
