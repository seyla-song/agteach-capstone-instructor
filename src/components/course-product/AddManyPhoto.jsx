import { useEffect, useState } from "react";
import { Stack, Box, Typography, Button, IconButton } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ClearIcon from "@mui/icons-material/Clear";
import AddPhotoModal from "./AddPhotoModal";

import {
  UploadedPhotoStyle,
  NotYetUploadedPhotoStyle,
} from "../../theme/CourseProductStyle";

/**
 * AddManyPhotos component renders an upload area for multiple photos
 *
 * It renders a button with a label "Add Photos" and a count of the number of photos uploaded
 * When the button is clicked, it opens a modal with a drag and drop area and a file input
 *
 * When a file is selected, it is added to the uploadedPhotos array and the file input is reset
 * If the number of photos exceeds 5, an error message is displayed
 *
 * When a photo is removed, it is removed from the uploadedPhotos array
 *
 * @returns A JSX element containing the AddManyPhotos component
 */
export default function AddManyPhotos({
  setValue,
  name,
  defaultValue,
  setRemovedImages,
}) {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  useEffect(() => {
    if (defaultValue && defaultValue.images.length > 0) {
      const imageUrls = defaultValue.images.map((image) => image.imageUrl);
      setUploadedPhotos(imageUrls);
      setValue(name, imageUrls);
    }
  }, [defaultValue, name, setValue]);

  const [uploadError, setUploadError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // to trigger input reset

  console.log(uploadedPhotos);
  const handleFileChange = (event) => {
    const newPhotos = Array.from(event.target.files);
    if (newPhotos.length + uploadedPhotos.length > 4) {
      setUploadError("Max 4 photos can be uploaded");
      return;
    }
    setUploadError("");
    setUploadedPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...newPhotos];
      setValue(name, updatedPhotos); // Update the form with new files
      return updatedPhotos;
    });
    setFileInputKey(Date.now()); // Reset file input key
  };

  const handleRemovePhoto = (index, file) => {
    setUploadedPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.filter((_, i) => i !== index);
      setValue(name, updatedPhotos); // Correctly update form with filtered photos
      return updatedPhotos;
    });
    console.log(file);
    setRemovedImages((prev) => [...prev, file]);
  };

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFileUpload = () => {
    document.getElementById("file-input").click();
  };

  const handleFileDrop = (files) => {
    const newPhotos = Array.from(files);
    if (newPhotos.length + uploadedPhotos.length > 4) {
      setUploadError("Only 4 photos can be uploaded");
      return;
    }
    setUploadError("");
    setUploadedPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...newPhotos];
      setValue(name, updatedPhotos); // Update form value with the dropped files
      return updatedPhotos;
    });
  };

  return (
    <Stack paddingY={2} spacing={2}>
      {!uploadedPhotos.length ? (
        <Stack onClick={handleButtonClick} sx={NotYetUploadedPhotoStyle}>
          <InsertPhotoIcon />
          <Typography variant="btr" color="gray">
            Upload up to 4 photos (png, jpg, webp)
          </Typography>
          <Typography variant="btr" color="gray">
            580 x 580 (Limit size: 1 MB)
          </Typography>
        </Stack>
      ) : (
        <Stack direction="row" flexWrap="wrap">
          {uploadedPhotos.map((file, index) => (
            <Box key={index} sx={UploadedPhotoStyle}>
              <Box
                component="img"
                src={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
                alt={`Uploaded ${index}`}
              />
              <Box
                onClick={() => handleRemovePhoto(index, file)}
                sx={{ position: "absolute", top: 1, right: 1, zIndex: 1 }}
              >
                <IconButton sx={{ backgroundColor: "common.white" }}>
                  <ClearIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
      {uploadError && <Typography color="red">{uploadError}</Typography>}
      <Button
        variant={uploadedPhotos.length !== 4 ? "outlined" : "contained"}
        color={uploadedPhotos.length !== 4 ? "error" : "success"}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: "8px",
          maxWidth: "200px",
        }}
        onClick={handleButtonClick}
      >
        <Typography variant="bssm">
          Add Photos {uploadedPhotos.length}/4
        </Typography>
      </Button>
      <AddPhotoModal
        open={modalOpen}
        handleClose={handleCloseModal}
        handleFileUpload={handleFileUpload}
        handleFileDrop={handleFileDrop}
      />
      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        key={fileInputKey} // To reset the input after each file selection
      />
    </Stack>
  );
}
