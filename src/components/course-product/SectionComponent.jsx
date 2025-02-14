import React, { useState } from "react";
import { Box, Stack, Typography, TextField } from "@mui/material";
import LectureComponent from "./LectureComponent"; // Import your LectureComponent
import ButtonComponent from "./ButtonInBox";
import { v4 as uuidv4 } from "uuid";
import { Delete, MoreVertRounded } from "@mui/icons-material";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useFormContext } from "react-hook-form";

export default function SectionComponent({
  id,
  onDelete,
  number,
  type,
  sectionNumber,
  lectureIndex,
  allLecture,
}) {
  const {
    register,
    unregister,
    watch,
    formState: { errors },
  } = useFormContext();
  const [lectures, setLectures] = useState(
    allLecture || [{ id: uuidv4(), number: 1, type: "lecture" }]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const sectionTitle = watch(`allSection[${number - 1}].sectionName`);

  // Add a new lecture
  const handleAddLecture = () => {
    setLectures((prevLectures) => [
      ...prevLectures,
      { id: uuidv4(), number: prevLectures.length + 1, type: "lecture" },
    ]);
  };

  // Delete lecture and unregister field
  const handleDeleteLecture = (lectureId) => {
    setLectures((prevLectures) => {
      const updatedLectures = prevLectures.filter(
        (lecture) => lecture.id !== lectureId
      );

      updatedLectures.forEach((lecture, index) => {
        lecture.number = index + 1;
      });

      return updatedLectures;
    });
    unregister(`section[${sectionNumber - 1}].allLecture[${lectureIndex}]`);
  };

  // Delete section confirmation modal
  const handleConfirmDelete = () => {
    onDelete(id);
    unregister(`allSection[${number - 1}].allLecture`);
    unregister(`allSection[${number - 1}]`);
    setModalOpen(false);
  };

  // Show/hide delete confirmation
  const handleClickOnVert = () => {
    setShowDelete((prevShowDelete) => !prevShowDelete);
  };

  // Modal open and close functions
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box bgcolor="grey.200" padding={2} mb={2}>
      <Stack
        position="relative"
        direction="row"
        pt={2}
        justifyContent="space-between"
      >
        <Typography variant="blgr">
          <strong>Section {number}:</strong> Write your section title below
        </Typography>
        <MoreVertRounded onClick={handleClickOnVert} sx={{ cursor: "pointer" }} />
        {showDelete && (
          <Stack
            onClick={handleOpenModal}
            direction={"row"}
            boxShadow={"0px 2px 4px rgba(0, 0, 0, 0.15)"}
            sx={{
              zIndex: 1,
              position: "absolute",
              top: 40,
              right: 20,
              bgcolor: "gray.300",
              p: 1,
              gap: 1,
              justifyItems: "center",
              cursor: "pointer",
            }}
          >
            <Delete color="error" />
            <Typography color="error">Delete</Typography>
          </Stack>
        )}
      </Stack>
      <TextField
        sx={{ my: 2 }}
        fullWidth
        id="outlined-controlled"
        label={`${sectionTitle ? `Section Title : ${sectionTitle.length} / 70` : "eg: Introduction to indoor gardening"}`}
        {...register(`allSection[${number - 1}].sectionName`, {
          required: "Title is required",
          maxLength: {
            value: 70,
            message: "Title cannot be exceed 70 character",
          },
        })}
        error={!!errors.allSection?.[number - 1]?.sectionName}
        helperText={errors.allSection?.[number - 1]?.sectionName?.message}
      />
      <Box bgcolor="gray.500">
        {lectures.map((lecture, index) => (
          <LectureComponent
            key={lecture.id}
            id={lecture.id}
            sectionId={id}
            sectionNumber={number}
            lectureNumber={index + 1}
            onDelete={(lectureId) => handleDeleteLecture(lectureId)}
            type={lecture.type}
          />
        ))}
        {lectures.length < 15 ? (
          <ButtonComponent
            onClick={handleAddLecture}
            text="Add Lecture +"
            variant="outlined"
            flexEnd
            sx={{ px: 2 }}
          />
        ) : (
          <Typography
            sx={{ textAlign: "end", paddingTop: "16px", color: "red.main" }}
          >
            You have reach the maximium lecture per section
          </Typography>
        )}
      </Box>
      <DeleteConfirmModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        type={type}
      />
    </Box>
  );
}
