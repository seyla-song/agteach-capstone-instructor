import { TextField, Box, Divider, Typography } from "@mui/material";
import IconWithTitle from "../course-product/IconWithTitle";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import TextSection from "../course-product/TextSection";

/**
 * AboutCourse component renders a page for instructors to input course title,
 * course description, and learning objective of the course.
 *
 * It uses the TextSection component to render each section.
 *
 * @returns a JSX element containing the AboutCourse component.
 */

export default function AboutCourse({ register, errors, setValue }) {
   const handleChange = () => {
    setValue("description", setValue("description"));
   }

  return (
    <Box className="container">
      <IconWithTitle
        title="About Course"
        icon={<NewspaperOutlinedIcon sx={{ color: "common.white" }} />}
      />
      <Divider sx={{ my: 2 }} />
      <TextSection
        title="Let's craft a course title"
        description="Crafted a good title would help your content engage more students."
      />
      <TextField
        sx={{ my: 2 }}
        fullWidth
        id="outlined-controlled"
        label="Enter your course title"
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
        defaultValue={setValue}
      />
      <Typography variant="bsr" color="dark.300" sx={{ mt: 2 }}>
        eg: How to plant an indoor tomatoes 100% edible
      </Typography>

      <Box mt={4}>
        <TextSection
          title="Tell us more about your course"
          description="Crafted a good title would help your content engage more students."
        />
        <TextField
          slotProps={{
            input: { sx: { alignItems: "flex-start", minHeight: "150px" } },
          }}
          sx={{ my: 2 }}
          fullWidth
          multiline
          label="Enter your course description"
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
          defaultValue={setValue("description")}
        />
      </Box>
      <TextSection
        title="What student will learn in this course?"
        description="Describe the learning objective of this course that learner expect to
          achieve after completing this course"
      />
      <TextField
        slotProps={{
          input: { sx: { alignItems: "flex-start", minHeight: "150px" } },
        }}
        sx={{ my: 2 }}
        fullWidth
        multiline
        id="outlined-controlled"
        label="What they will learn in this course: "
        {...register("objective", { required: "Objective is required" })} 
        error={!!errors.objective}
        helperText={errors.objective?.message}
      />
    </Box>
  );
}
