import { Instagram } from "../controllers/instagram";

export const handle_ig_events = (client) => {
  client.on("pendingRequest", async (chat) => {
    console.log({ chat });
    await chat.approve();
    chat.sendMessage({ content: "iai" });
  });
  //client.on('', (c))
  client.on("rawRealtime", (_, message) => {
    //console.log(_, message);
  });
  client.on("connected", () => {
    Instagram.setUser(client.user);
    console.log(`Logged in as ${client.user.username}`);
    Instagram.storeSession(JSON.stringify(client.ig.state)).then(() => {
      console.info("Instagram session stored");
    });
  });
  client.on("newFollower", (user) => {
    console.log({ user });
  });
  client.on("messageCreate", (message) => {
    if (message.content === "!ping") message.reply("pong!");
  });
};
