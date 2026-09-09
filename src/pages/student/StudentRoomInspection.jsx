import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import api from "../../api/Api";

const imageFields = [
  {
    key: "tap",
    label: "Bathroom Tap",
  },
  {
    key: "light",
    label: "Bathroom Light",
  },
  {
    key: "fan",
    label: "Ceiling Fan",
  },
  {
    key: "switchBoard",
    label: "Switch Board",
  },
  {
    key: "door",
    label: "Door",
  },
  {
    key: "window",
    label: "Window",
  },
  {
    key: "bed",
    label: "Bed",
  },
  {
    key: "cupboard",
    label: "Cupboard",
  },
];

export default function StudentRoomInspection() {
  const [remarks, setRemarks] = useState("");

  const [images, setImages] = useState({});

  const handleImage = (key, file) => {
    setImages((prev) => ({
      ...prev,

      [key]: file,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("remarks", remarks);

    Object.keys(images).forEach((key) => {
      formData.append(key, images[key]);
    });

    try {
      await api.post("/inspection/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Inspection Submitted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Room Inspection
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" mb={3}>
            Before leaving hostel please upload clear photos of every item.
          </Typography>

          {imageFields.map((item) => (
            <div
              key={item.key}
              className="mb-4 flex justify-between items-center"
            >
              <Typography>{item.label}</Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                {images[item.key] ? "Selected" : "Upload"}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(item.key, e.target.files[0])}
                />
              </Button>
            </div>
          ))}

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            sx={{
              mt: 4,

              background: "#4f46e5",

              textTransform: "none",
            }}
            onClick={handleSubmit}
          >
            Submit Inspection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
