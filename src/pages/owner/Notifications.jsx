import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  Pagination,
  Divider,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";

import api from "../../api/Api";
import { getAuthData } from "../../utils/auth";

export default function Notifications() {
  const auth = getAuthData();

  const hostelId = auth?.hostelId;

  const [tab, setTab] = useState(0);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [history, setHistory] = useState([]);

  const [pageNo, setPageNo] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications/all", {
        params: {
          hostelId,
          search,
          startTime: fromDate ? new Date(fromDate).getTime() : null,
          endTime: toDate ? new Date(toDate + " 23:59:59").getTime() : null,
          pageNo: pageNo - 1,
          pageSize: 10,
        },
      });

      const data = response.data?.payLoad || [];

      setHistory(data);

      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendBroadcast = async () => {
    try {
      if (!title.trim()) {
        toast.error("Title required");
        return;
      }

      if (!message.trim()) {
        toast.error("Message required");
        return;
      }

      setLoading(true);

      await api.post("/notification/send/broadcast", {
        hostelId,
        title,
        message,
      });

      toast.success("Notification sent successfully");

      setTitle("");
      setMessage("");

      setTab(1);

      loadHistory();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send notification",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 1) {
      loadHistory();
    }
  }, [tab, pageNo, search]);

  return (
    <div>
      {/* Header */}

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <p className="text-sm text-gray-500">
          Send broadcast notifications and view notification history
        </p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          className="border-b"
        >
          <Tab icon={<CampaignIcon />} iconPosition="start" label="Broadcast" />

          <Tab icon={<HistoryIcon />} iconPosition="start" label="History" />
        </Tabs>

        <CardContent>
          {/* Broadcast Tab */}
          {tab === 0 && (
            <div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg">
                  Broadcast Notification
                </h3>

                <p className="text-sm text-gray-500">
                  Send notification to all students in your hostel
                </p>
              </div>

              <Card variant="outlined">
                <CardContent>
                  <div className="grid gap-4">
                    <TextField
                      label="Notification Title"
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                      label="Message"
                      multiline
                      rows={6}
                      fullWidth
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="contained"
                        startIcon={<SendIcon />}
                        onClick={sendBroadcast}
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Notification"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}{" "}
          {/* History Tab */}
          {tab === 1 && (
            <div>
              <Card variant="outlined" className="mb-6">
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <TextField
                      label="Search"
                      size="small"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <TextField
                      label="From Date"
                      type="date"
                      size="small"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField
                      label="To Date"
                      type="date"
                      size="small"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={() => {
                        setPageNo(1);
                        loadHistory();
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {history.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-10">
                      <HistoryIcon
                        sx={{
                          fontSize: 50,
                          color: "#9ca3af",
                        }}
                      />

                      <p className="mt-3 text-gray-500">
                        No notifications found
                      </p>
                    </CardContent>
                  </Card>
                )}

                {history.map((item) => (
                  <Card key={item.id} className="rounded-xl shadow-sm">
                    <CardContent>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-base">
                            {item.title}
                          </h4>

                          <p className="text-xs text-gray-500">
                            {new Date(item.creationTime).toLocaleString()}
                          </p>
                        </div>

                        <Chip
                          label={item.type}
                          color={
                            item.type === "BROADCAST" ? "success" : "primary"
                          }
                          size="small"
                        />
                      </div>

                      <Divider className="mb-3" />

                      <p className="text-gray-700 mb-4">{item.message}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Delivered To
                        </span>

                        <Chip
                          label={`${item.receiverCount} Students`}
                          color="info"
                          size="small"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Pagination
                  page={pageNo}
                  count={totalPages}
                  onChange={(e, value) => setPageNo(value)}
                  color="primary"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
