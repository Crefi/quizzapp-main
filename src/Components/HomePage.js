import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Paper } from "@mui/material";

const HomePage = () => {
  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Quiz App!
      </Typography>
      <Typography variant="body1" paragraph>
        Chose an Azure course 
      </Typography>
      <Button component={Link} to="/quiz" variant="contained" color="primary">
        Az 104 Full
      </Button>
      <Button component={Link} to="/quiz50" variant="contained" color="primary">
        Az 104 - 50 questions
      </Button>
      <Button component={Link} to="/quiz204" variant="contained" color="primary">
        Az 204 full
      </Button>
    </Paper>
  );
};

export default HomePage;
