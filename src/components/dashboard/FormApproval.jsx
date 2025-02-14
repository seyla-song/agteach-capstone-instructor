import { Stack, Button, TextField, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFormApprovalMutation } from "../../services/api/approvalApi";
import { CustomAlert } from "../CustomAlert";
import FormTextSection from "./FormTextSection";
import { useDispatch, useSelector } from "react-redux";
import { setInstructorVerificationStatus } from "../../features/user/approvalSlice";

/**
 * FormApproval
 *
 * This component is used to create the instructor verification form.
 *
 * The form will be used to collect the following information:
 * - National ID Card Number
 * - Bank Account Number
 * - Target Course
 * - Target Product
 * - Describe who you are
 *
 * The form will be validated to ensure that:
 * - The National ID Card Number is 9 digits
 * - The Bank Account Number is 9 digits
 * - The Target Course, Target Product, and Describe who you are fields are not empty
 * - The Target Course, Target Product, and Describe who you are fields are not more than 500 words
 *
 * The form will be submitted to the server, and the response will be displayed in a snackbar.
 *
 * @param {{}} props - the component props
 * @returns {JSX.Element} - the form component
 */
export default function FormApproval() {
  const { register, handleSubmit, watch, setValue, formState } = useForm();
  const dispatch = useDispatch();
  const { errors, touchedFields } = formState;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [approval, { isLoading }] = useFormApprovalMutation();

  const wordCountError = (identifier, maxLength = 500) => {
    const count = watch(identifier)?.trim().split(/\s+/).length || 0;
    if (count > maxLength) {
      return {
        error: true,
        helperText: `Please enter less than ${maxLength} words`,
        count,
      };
    } else if (count < 150) {
      return {
        error: true,
        helperText: "Please enter more than 150 words",
        count,
      };
    }
    return { error: false, count };
  };

  const { isApproved, isRejected } = useSelector((state) => state.approval);

  const handleSubmission = async (data) => {
    try {
      const res = await approval(data).unwrap();
        dispatch(
          setInstructorVerificationStatus({
            IsApproved: isApproved,
            IsRejected: isRejected,
            IsFormSubmitted: true,
            IsApprovalLoading: false,
          })
        );
      setSnackbar({ open: true, message: res.message, severity: "success" });
      window.location.reload();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data.message,
        severity: "error",
      });
    }
  };

  return (
    <Box bgcolor="common.white" p={4} width="65%">
      <CustomAlert
        open={snackbar.open}
        label={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <Stack
        component="form"
        spacing={5}
        onSubmit={handleSubmit(handleSubmission)}
      >
        <Typography variant="h4" pb={2} sx={{ color: "primary.main" }}>
          Verification Form
        </Typography>
        <Stack spacing={2}>
          <FormTextSection title="Enter National ID Card Number" />
          <TextField
            label="National ID Card Number"
            placeholder="xxx xxx xxx"
            inputProps={{ maxLength: 11 }}
            {...register("nationalId", {
              required: "Please enter an ID number",
              validate: {
                exactLength: (value) =>
                  value.replace(/\s/g, "").length === 9 ||
                  "ID number must be 9 digits",
              },
            })}
            error={!!errors.nationalId}
            helperText={errors.nationalId?.message}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\s/g, "");
              if (/^\d{0,9}$/.test(rawValue)) {
                const formattedValue = rawValue.replace(
                  /(\d{3})(?=\d)/g,
                  "$1 "
                );
                setValue("nationalId", formattedValue.trim(), {
                  shouldValidate: true,
                });
              }
            }}
          />
          <Typography component="ul">
            <Typography component="li" color="dark.300" variant="bsr">
              NOTE: A National ID number ensures identification and access to
              services.
            </Typography>
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <FormTextSection
            title="Tell us, what inspires you to sell course ?"
            description="What kind of courses will you be producing?"
          />

          <TextField
            label={`Description ${watch("targetCourse") ? `: ${wordCountError("targetCourse").count} / 500 word` : ""}`}
            multiline
            minRows={4}
            {...register("targetCourse", {
              required: "Please enter a description",
              onBlur: () =>
                setValue("touchedFields", {
                  ...touchedFields,
                  targetCourse: true,
                }),
            })}
            error={
              !!errors.targetCourse ||
              (touchedFields.targetCourse &&
                wordCountError("targetCourse").error)
            }
            helperText={
              errors.targetCourse?.message ||
              (touchedFields.targetCourse &&
                wordCountError("targetCourse").error &&
                wordCountError("targetCourse").helperText)
            }
          />
        </Stack>

        <Stack spacing={2}>
          <FormTextSection
            title="Tell us, what inspires you to sell product ?"
            description="Describe what product you will be selling on AgTeach Platform?"
          />

          <TextField
            label={`Description ${watch("targetProduct") ? `: ${wordCountError("targetProduct").count} / 500 word` : ""}`}
            multiline
            minRows={4}
            {...register("targetProduct", {
              required: "Please enter a description",
              onBlur: () =>
                setValue("touchedFields", {
                  ...touchedFields,
                  targetProduct: true,
                }),
            })}
            error={
              !!errors.targetProduct ||
              (touchedFields.targetProduct &&
                wordCountError("targetProduct").error)
            }
            helperText={
              errors.targetProduct?.message ||
              (touchedFields.targetProduct &&
                wordCountError("targetProduct").error &&
                wordCountError("targetProduct").helperText)
            }
          />
        </Stack>

        <Stack spacing={2}>
          <FormTextSection
            title="Describe who you are"
            description="Tell us more about you? And why you want to sell and teach on AgTeach?"
          />

          <TextField
            label={`Description ${watch("profileBackground") ? `: ${wordCountError("profileBackground").count} / 500 word` : ""}`}
            multiline
            minRows={4}
            {...register("profileBackground", {
              required: "Please enter a description",
              onBlur: () =>
                setValue("touchedFields", {
                  ...touchedFields,
                  profileBackground: true,
                }),
            })}
            error={
              !!errors.profileBackground ||
              (touchedFields.profileBackground &&
                wordCountError("profileBackground").error)
            }
            helperText={
              errors.profileBackground?.message ||
              (touchedFields.profileBackground &&
                wordCountError("profileBackground").error &&
                wordCountError("profileBackground").helperText)
            }
          />
        </Stack>

        <Stack spacing={2}>
          <FormTextSection title="Enter Bank Account Number" />
          <TextField
            label="Account Number"
            placeholder="xxx xxx xxx"
            inputProps={{ maxLength: 11 }}
            {...register("bankNumber", {
              required: "Please enter a bank number",
              validate: {
                exactLength: (value) =>
                  value.replace(/\s/g, "").length === 9 ||
                  "Bank number must be 9 digits",
              },
            })}
            error={!!errors.bankNumber}
            helperText={errors.bankNumber?.message}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\s/g, "");
              if (/^\d{0,9}$/.test(rawValue)) {
                const formattedValue = rawValue.replace(
                  /(\d{3})(?=\d)/g,
                  "$1 "
                );
                setValue("bankNumber", formattedValue.trim(), {
                  shouldValidate: true,
                });
              }
            }}
          />
          <Typography component="ul">
            <Typography component="li" color="dark.300" variant="bsr">
              NOTE: A bank account number enables transactions and security.
            </Typography>
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ width: "110px", height: "50px", bgcolor: "blue.main" }}
          >
            {isLoading ? "SUBMITTING" : "SUBMIT"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
