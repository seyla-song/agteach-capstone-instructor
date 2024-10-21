import { useState, useRef } from "react";
import CustomTable from "../components/CustomTable";
import QueryHeader from "../components/QueryHeader";
import { Stack, Typography, Box } from "@mui/material";
import { useGetEnrollmentCourseQuery } from "../services/api/courseApi";
import emptyProduct from "../assets/Spooky Stickers Sweet Franky.png";
import { useNavigate } from "react-router";
import CustomButton from "../components/CustomButton";
import { useGetEnrollmentDetailsQuery } from "../services/api/balanceApi";

function EnromentPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectState, setSelectState] = useState(null);

  // Fixing the order value logic
  const order =
    selectState === "Newest"
      ? "Newest"
      : selectState === "Oldest"
        ? "Oldest"
        : "World";
  console.log("order", order);

  const {
    data: enrollmentData,
    isLoading,
    error,
  } = useGetEnrollmentCourseQuery({
    name: searchTerm,
    order,
  });

console.log("Enrollment Data: ", enrollmentData?.courseSaleHistory);

  const searchRef = useRef();
  const label = "Sort";

  let enrollmentList = [];
  if (!isLoading && enrollmentData) {
    const validEnrollment = Array.isArray(enrollmentData.courseSaleHistory)
      ? enrollmentData.courseSaleHistory
      : [];
    enrollmentList = validEnrollment.map((item) => ({
      CourseName: item.CourseName,
      Price: `$ ${item.price}`,
      Student: item.student,
      Date: new Date(item.CreatedAt).toISOString().split("T")[0],
      View: (
        <CustomButton
          sx={{ backgroundColor: "blue.main" }}
          variant="contained"
          onClick={() =>
            navigate(`/enrollment/${item.courseId}`)
          }
        >
          <Typography variant="bsr">
            View
          </Typography>
        </CustomButton>
      ),

    }));
  }

  const handleSelectChange = (event) => {
    setSelectState(event.target.value);
  };

  // Handle Search functionality
  const handleSearch = () => {
    if (searchRef.current) {
      const term = searchRef.current.value;
      setSearchTerm(term);
    }
  };

  console.log("Enrollment List: ", enrollmentList);

  return (
    <Stack gap="30px">
      <QueryHeader
        label={label}
        useSelectState={[selectState, setSelectState]}
        selectData={["Newest", "Oldest", "World"]}
        handleSelectChange={handleSelectChange}
        handleSearch={handleSearch}
      />
      {isLoading ? (
        <Typography>Loading Enrollment...</Typography>
      ) : error ? (
        <Typography>Error: {error.message}</Typography>
      ) : Array.isArray(enrollmentList) && enrollmentList.length > 0 ? (
        <CustomTable data={enrollmentList} />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height={"60vh"}
          sx={{ textAlign: "center" }}
        >
          <img
            src={emptyProduct}
            alt="emptyProduct"
            style={{ width: "200px", height: "200px", marginBottom: "10px" }}
          />
          <Typography variant="bmdr">No enrollment data available.</Typography>
        </Box>
      )}
    </Stack>
  );
}

export default EnromentPage;

