import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

// Documentation on the Socket.io: https://socket.io/docs/v4/

export const config = {
    api: {
        bodyParser: false
    }
};

// Don't know what's happening here
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false
        });
        res.socket.server.io = io;
    }

    res.end();
}

export default ioHandler;