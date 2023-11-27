import React, { useState, useEffect, Component, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalStoreContext } from '../store/index';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
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
    CardContent,
    Autocomplete
} from "@mui/material";
import tempMap from '../assets/tempMap.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import Card from "@mui/material/Card";
import SquareIcon from '@mui/icons-material/Square';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "./Choropleth"

const MapEdit = () => {
    const tempMapData = {
        addedFeatures: [
            { type: "String", name: "Name" },
            { type: "Number", name: "Population" },
            { type: "Number", name: "Area" },
            { type: "Number", name: "GDP" },
            { type: "Number", name: "HDI" },],
        baseData: [],
        mapType: "Choropleth"
    }
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState("");

    const [selectedFeatureType, setSelectedFeatureType] = useState("");
    const [pickColor, setPickColor] = useState("red");
    const [geojsonData, setGeojsonData] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    let displayFeatures;

    if (features.length > 0) {
        displayFeatures = features.map((feature, index) => (
            <IconButton
                key={index}
                sx={{
                    fontSize: '10px',
                    backgroundColor: '#0844A4',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '10px',
                    margin: '0 4px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s',
                    ':hover': {
                        backgroundColor: '#0A5CE8',
                    },
                }}
            >
                {feature.name}
            </IconButton>
        ));
    } else {
        // Render nothing if features is empty
        displayFeatures = null;
    }
    const handleAddFeature = () => {
        if (selectedFeatureType && newFeature) {
            setFeatures([
                ...features,
                { type: selectedFeatureType, name: newFeature },
            ]);

            setSelectedFeatureType("");
            setNewFeature("");
        }
    };

    const handleEditFeature = (index) => {
        const updatedFeatures = [...features];
        updatedFeatures.splice(index, 1);
        setFeatures(updatedFeatures);
    };

    const handleRenderChoropleth = () => {
        console.log("Rendering as choropleth map...");
    };

    const handleRankFeatures = () => {
        console.log("Ranking features...");
    };
    const handleUndo = () => {
    }
    const handleRedo = () => {
    }
    const handleFeatureSelect = (value) => {
        setSelectedFeatureType(value);
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);

                if (data.features && data.features.length > 0) {
                    const commonProperties = Object.keys(data.features[0].properties);

                    const addedFeatures = [];

                    for (const feature of data.features) {
                        const featureProperties = Object.keys(feature.properties);

                        const newCommonProperties = commonProperties.filter((property) =>
                            featureProperties.includes(property)
                        );

                        commonProperties.length = 0;
                        commonProperties.push(...newCommonProperties);

                        for (const property of commonProperties) {
                            const propertyType = typeof feature.properties[property];

                            const existingFeature = addedFeatures.find((f) => f.name === property);
                            if (!existingFeature) {
                                addedFeatures.push({ type: propertyType, name: property });
                            } else {
                                if (existingFeature.type !== propertyType) {
                                    existingFeature.type = "Mixed";
                                }
                            }
                        }
                    }
                    setFeatures(addedFeatures);
                }

                setGeojsonData(data);
                // Other operations with the GeoJSON data as needed
                // mapRef.current.fitBounds(data.getBounds());
            };
            reader.readAsText(file);
        }
    };
    const mapRef = React.useRef();
    return (
        <Grid container>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={6}>
                <Typography
                    variant="h4"
                    sx={{
                        color: "black",
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left",
                    }}
                >
                    Map Title
                </Typography>
                <MapContainer ref={mapRef} center={mapCenter} zoom={11} scrollWheelZoom={true} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker> */}
                    {/* {geojsonData && <GeoJSON data={geojsonData} />} */}
                    {geojsonData && <Choropleth color={pickColor} geojsonData={geojsonData} featureForChoropleth={selectedFeatureType} />}
                </MapContainer>
                <Button variant="contained"
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}>
                    Add a New Region
                </Button>
                <input type="file" accept=".geojson" onChange={handleFileUpload} />

            </Grid>
            <Grid item xs={12} sm={.5}></Grid>

            {/* Right Side */}
            <Grid item xs={12} sm={4}>
                <Box sx={{ height: "40px" }}></Box>
                {/* Title */}
                <Grid container>
                    <Grid item xs={12} sm={9}>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "blue",
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "center",
                                }}
                            >
                                Category: Choropleth Map
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box>
                            <UndoIcon sx={{ mr: 1 }} onClick={handleUndo} />
                            <Redo onClick={handleRedo} />
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ paddingY: 2 }} />
                <Box>
                    <Typography>
                        Features: {displayFeatures}
                    </Typography>
                    <Link>edit</Link>
                </Box>

                <Box sx={{ paddingY: 2 }} />

                <Card>
                    <CardContent>
                        <Typography>Feature Name:</Typography>
                        <TextField
                            type="text"
                            fullWidth
                            placeholder="Add a feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            size="small"
                            sx={{ height: '40px' }}
                        />
                    </CardContent>
                </Card>
                <Button variant="contained" sx={{
                    borderRadius: '10px',
                    backgroundColor: '#0844A4',
                    color: 'white', // Text color
                    marginTop: '10px',
                }} onClick={handleAddFeature}> Add More Features</Button>
                <Box sx={{ paddingY: 2 }} />

                <Autocomplete
                    value={selectedFeatureType}
                    onChange={(e, value) => handleFeatureSelect(value)}
                    options={[
                        'None',
                        ...features
                            .filter((feature) => feature.type === 'number')
                            .map((feature) => feature.name)
                    ]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Feature for Choropleth"
                            size="small"
                            fullWidth
                        />
                    )}
                    style={{ minWidth: '200px', flex: 1 }}
                />
                <Typography> Choose a Color: {pickColor}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SquareIcon
                        sx={{
                            color: 'red',
                            padding: 1,
                            border: pickColor === 'red' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('red')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'blue',
                            padding: 1,
                            border: pickColor === 'blue' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('blue')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'yellow',
                            padding: 1,
                            border: pickColor === 'yellow' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('yellow')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'green',
                            padding: 1,
                            border: pickColor === 'green' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('green')}
                    />
                    <SquareIcon
                        sx={{
                            color: 'purple',
                            padding: 1,
                            border: pickColor === 'purple' ? '2px solid #0844A4' : '2px solid transparent',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPickColor('purple')}
                    />
                </Box>

                <Box>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                    }}> Rank It</Button>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                        marginLeft: '10px'
                    }} href="/create">
                        Render as Choropleth Map
                    </Button></Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
        </Grid>
    );
};

export default MapEdit;
