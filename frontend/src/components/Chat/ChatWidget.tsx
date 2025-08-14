import { Box, Paper, Typography } from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { io } from "socket.io-client";

type Props = {
  jobId: number;
  onClose: () => void;
  username: string;
  role: string;
};
const socket = io("http://localhost:4040");
const ChatWidget = forwardRef(
  ({ jobId, onClose, username, role }: Props, ref) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);

    const [Chats, setChats] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    useEffect(() => {
      socket.emit("join_job", { jobId: jobId.toString()  });

      socket.on("receive_message", ({ message, time, from }) => {
        console.log(`Message from ${from} in job : ${message}`);

        setChats((prev) => [...prev, { message, time, from }]);
      });
      // Cleanup listener when component unmounts
      return () => {
        socket.off("receive_message");
      };
    }, [jobId]);
    const handleSubmit = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      const daystring = now.toLocaleDateString("en-us", options);

      const timeString = now.toLocaleTimeString("en-us", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const finalString = `${daystring} ,${timeString}`;

      const data = {
        jobId,
        message,
        from: username,
        time: finalString,
      };
      socket.emit("send_message", data);
      setMessage("")
    };
    return (
      <Draggable handle=".drag-handle" cancel="input" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="drag-handle"
            style={{
              background: "#1976d2",
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              cursor: "move",
            }}
          >
            Chat - Job {jobId}
            <button
              onClick={onClose}
              style={{
                float: "right",
                color: "white",
                background: "transparent",
                border: "none",
              }}
            >
              ✖
            </button>
          </div>

          <div style={{ padding: "10px", overflowY: "auto", flex: 1 }}>
            {/* Chat messages go here */}
            {Chats.map((chat: any) => (
              <div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      chat.from==username ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      bgcolor: chat.from===username ? "#dcf8c6" : "#ffffff",
                      borderRadius:
                        role == "provider"
                          ? "18px 18px 0 18px"
                          : "18px 18px 18px 0",
                    }}
                  >
                    <Typography variant="body1">{chat.message}</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        {chat.time}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "14px",
                backgroundColor: "#fff",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 16px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#1976d2",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#115293")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              }
            >
              Send
            </button>
          </div>
        </div>
      </Draggable>
    );
  }
);
export default ChatWidget;
