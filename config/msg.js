export const MsgPayloadTypes = {
   get SERVER_STATUS_UPDATE() {
      return 0x1;
   },

   get SOCKET_STATUS_UPDATE() {
      return 0x2;
   },

   get PRESENCE_UPDATE() {
      return 0x14;
   },

   get STATUS_ADDED() {
      return 0x15;
   },
};
