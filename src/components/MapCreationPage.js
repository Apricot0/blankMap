import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import {
    Box,
    Typography,
    TextField,
    TextareaAutosize,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Button,
} from '@mui/material';

const MapCreationPage = () => {
    // State for form inputs
    const [mapName, setMapName] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();
    const handleStartWithBlank = () => {
        navigate("/"+selectedCategory)
        // Logic to handle starting with a blank map
        console.log("Start with Blank Map");
    };

    const handleLoadFromMap = () => {
        navigate("/"+selectedCategory)
        console.log("Load from Map");
    };

    const handleCategoryChange = (event) => {
        // Update the selected category when the user chooses from the dropdown
        const selectedValue = event.target.value;
      
        // Set the appropriate edit value based on the selected category
        const editValue = (selectedValue === 'Choropleth'|| selectedValue ==='') ? 'edit' : selectedValue === 'HeatMap' ? 'edit-heat' : 'edit';
      
        setSelectedCategory(editValue);
      };
    const handleToggleSwitch = () => {
        setIsPublic(!isPublic);
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={3}>
                {/* <Typography variant="h4" sx={{ color: 'black', textAlign: 'center' }}>
                    Create Map
                </Typography> */}
                <FormControl sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
              
                        id="mapName"
                        type="text"
                        value={mapName}
                        margin="normal"
                        size="small"
                        label="Map Name:"
                        variant="outlined"
                        placeholder="Enter Name of the map"
                        onChange={(e) => setMapName(e.target.value)}
                        sx={{
                            width: '400px', // Set the width to make it square
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                    />
                </FormControl>
                <Box>
                    <FormControlLabel
                        sx={{ display: 'flex', justifyContent: 'center', }}
                        control={<Switch checked={isPublic} onChange={handleToggleSwitch} />}
                        label={
                            <Typography variant="body1">
                                {isPublic ? 'Public' : 'Private'}
                            </Typography>
                        }
                        labelPlacement="start"
                    />
                </Box>
                <FormControl fullWidth margin="normal" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        id="mapDescription"
                        type="text"
                        value={description}
                        margin="normal"
                        label="Description:"
                        variant="outlined"
                        placeholder="Enter a map description"
                        fullWidth
                        multiline
                        sx={{
                            width: '400px', // Set the width to make it square
                            height: '250px', // Set the height to make it
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <TextField
                        id="mapTags"
                        type="text"
                        value={tags}
                        margin="normal"
                        label="Tags:"
                        variant="outlined"
                        placeholder="Enter your map tags"
                        fullWidth
                        multiline
                        sx={{
                            width: '400px', // Set the width to make it square
                            height: '200px', // Set the height to make it
                            borderRadius: '8px', // Optional: Set the border-radius for rounded corners
                        }}
                        onChange={(e) => setTags(e.target.value)}
                        rows={5}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={1}>
            </Grid>
            <Grid item xs={12} sm={7}>
                <Box sx={{ height: '40px' }}></Box>
                <Grid container>
                    <Grid item xs={12} sm={5}>
                        <Typography variant="body1" sx={{ color: 'blue', display: 'flex', justifyContent: 'left', alignItems: 'center', }}>Your Map:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <InputLabel sx={{ justifyContent: 'right', alignItems: 'center' }} htmlFor="selectedCategory">Choose a Category:</InputLabel>
                        <Select
                            id="selectedCategory"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            sx={{ width: '200px', display: 'flex', justifyContent: 'right', alignItems: 'center', }}
                            size="small"
                        >
                            <MenuItem value="">-- Select --</MenuItem>
                            <MenuItem value="Choropleth">Choropleth</MenuItem>
                            <MenuItem value="HeatMap">Heat Map</MenuItem>
                            {/* Add more categories as needed */}
                        </Select>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', alignItems: 'center', }}>
                    <Button variant="contained" color="primary" onClick={handleStartWithBlank}>
                        Start with Blank
                    </Button>
                    <Box sx={{ width: '10px' }}></Box>
                    <Button variant="contained" color="primary" onClick={handleLoadFromMap}>
                        Load from Map
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default MapCreationPage;