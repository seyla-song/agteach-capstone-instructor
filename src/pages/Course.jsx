import { useState } from "react";
import QueryHeader from "../components/QueryHeader";
import { Chip, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChipDelivery from "../components/ChipDelivery";
function CoursePage() {
  const [selectState, setSelectState] = useState();
  const label = "Sort";
  function handleCreateNew() {}
  function handleSearch() {}
  return (
    <>
      <QueryHeader
        label={label}
        useSelectState={[selectState, setSelectState]}
        selectData={["Newest", "Oldest", "World"]}
        handleCreateNew={handleCreateNew}
        handleSearch={handleSearch}
      />
      <ChipDelivery isDelivered={true} />
      <ChipDelivery isDelivered={false} />
    </>
  );
}

export default CoursePage;
