import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function MediaCard({ image, name , time }) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardMedia
        sx={{ height: { xs: 100, sm: 140, md: 180 }, objectFit: "contain" }}
        image={image}
        title={name}
      />
      <CardContent>
        <h2>{name}</h2>
        <Typography variant="h2" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
};
