import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

import api from "../../api/Api";
import { toast } from "react-toastify";

export default function RoomInspectionDrawer({ open, onClose, inspection }) {
  const [details, setDetails] = useState(null);

  const [preview, setPreview] = useState("");

  const [ownerRemark, setOwnerRemark] = useState("");

  const loadInspection = async () => {
    try {
      const res = await api.get("/inspection/details", {
        params: {
          id: inspection?.id,
        },
      });

      setDetails(res.data.payLoad);

      setOwnerRemark(res.data.payLoad.ownerRemark || "");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (open && inspection) {
      loadInspection();
    }
  }, [open]);

  const approveInspection = async () => {
    try {
      await api.put("/inspection/approve", {
        id: inspection.id,
        ownerRemark,
      });

      toast.success("Inspection Approved");

      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  const rejectInspection = async () => {
    try {
      await api.put("/inspection/reject", {
        id: inspection.id,
        ownerRemark,
      });

      toast.success("Inspection Rejected");

      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  if (!details) return null;

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 700,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}

          <div className="flex justify-between items-center p-5 border-b">
            <Typography variant="h6" fontWeight={700}>
              Room Inspection
            </Typography>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Body */}

          <div className="p-5 flex-1 overflow-auto">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography fontWeight={600}>Student</Typography>

                <Typography color="text.secondary">
                  {details.studentName}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontWeight={600}>Room</Typography>

                <Typography color="text.secondary">
                  {details.roomNumber}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontWeight={600}>Submitted</Typography>

                <Typography color="text.secondary">
                  {details.createdDate}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontWeight={600}>Status</Typography>

                <Typography color="primary">{details.status}</Typography>
              </Grid>
            </Grid>

            <Divider className="my-5" />

            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Uploaded Images
            </Typography>

            <Grid container spacing={2}>
              {details.images.map((img) => (
                <Grid item xs={4} key={img.id}>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={img.image}
                      alt=""
                      className="w-full h-40 object-cover"
                    />

                    <div className="flex justify-between items-center p-2">
                      <Typography fontSize={13}>{img.imageType}</Typography>

                      <IconButton onClick={() => setPreview(img.image)}>
                        <ZoomInIcon />
                      </IconButton>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>

            <Divider className="my-5" />

            <Typography fontWeight={700} mb={1}>
              Student Remark
            </Typography>

            <Typography color="text.secondary">
              {details.studentRemark || "No Remark"}
            </Typography>

            <Divider className="my-5" />

            <TextField
              multiline
              rows={4}
              fullWidth
              label="Owner Remark"
              value={ownerRemark}
              onChange={(e) => setOwnerRemark(e.target.value)}
            />
          </div>

          {/* Footer */}

          {details.status === "PENDING" && (
            <div className="p-5 border-t flex gap-3">
              <Button
                color="error"
                variant="contained"
                fullWidth
                onClick={rejectInspection}
              >
                Reject
              </Button>

              <Button
                color="success"
                variant="contained"
                fullWidth
                onClick={approveInspection}
              >
                Approve
              </Button>
            </div>
          )}
        </Box>
      </Drawer>

      {/* Image Preview */}

      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview("")}
        maxWidth="lg"
      >
        <DialogTitle>Inspection Image</DialogTitle>

        <DialogContent>
          <img src={preview} alt="" className="max-w-full rounded-lg" />
        </DialogContent>
      </Dialog>
    </>
  );
}
