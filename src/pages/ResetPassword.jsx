import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import agtechDark from "./../assets/login/logo-dark.svg";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

function ResetPassword() {
  const gap = "20px";
  return (
    <Stack flexDirection="column" alignItems="center" gap="200px">
      <Box component="img" mt={10} src={agtechDark} alt="dark-logo" />
      <Stack gap={gap}>
        <Stack gap={gap}>
          <Typography variant="blgsm">Reset Password</Typography>
          <Typography variant="bmdr">
            Strong passwords include numbers, letters, and punctuation marks.
          </Typography>
          <InputField fieldName="New" fieldType="password" />
          <InputField fieldName="Confirm" fieldType="password" />
        </Stack>
        <Divider />
        <CustomButton color="primary" variant="contained">
          Reset Password
        </CustomButton>
      </Stack>
    </Stack>
  );
}

export default ResetPassword;