import React, { useState, useEffect, Component, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalStoreContext } from '../store/index';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import DataEditPanel from './DataEditPanel';
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
    Autocomplete,
    Card,
    Paper,
} from "@mui/material";
import tempMap from '../assets/tempMap.png'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Redo from "@mui/icons-material/Redo";
import SquareIcon from '@mui/icons-material/Square';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import omnivore from 'leaflet-omnivore';
import * as turf from '@turf/turf';
import Choropleth from "./Choropleth"
import ColorLayer from "./ColorLayer";

const RegionalEdit = () => {
    const { globalStore } = useContext(GlobalStoreContext);
    const [file_created, setFile_created] = useState(null);
    // const tempMapData = {
    //     addedFeatures: [
    //         { type: "String", name: "Name" },
    //         { type: "Number", name: "Population" },
    //         { type: "Number", name: "Area" },
    //         { type: "Number", name: "GDP" },
    //         { type: "Number", name: "HDI" },],
    //     baseData: [],
    //     mapType: "Choropleth"
    // }
    // console.log(globalStore.currentMap)
    const [features, setFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState("");
    const [selectedFeatureType, setSelectedFeatureType] = useState("string");
    const [featureForChoropleth, setFeatureForChoropleth] = useState("");
    const [pickColor, setPickColor] = useState("red");
    const [geojsonData, setGeojsonData] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.9897471840457, -75.13893127441406]);
    const [choroStep, setChoroStep] = useState(5);
    const [panelOpen, setPanelOpen] = useState(false);
    useEffect(() => {
        setFile_created(globalStore.selectedFile);
    }, [globalStore.selectedFile]);
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
    const handlePanelOpen = () => {
        setPanelOpen(true);
    }
    const handleAddFeature = () => {
        if (geojsonData && selectedFeatureType && newFeature) {
            const isFeatureAlreadyExists = features.some(
                (feature) => feature.name === newFeature
            );
            if (isFeatureAlreadyExists) {
                console.log('Feature already exists!');
                return;
            }
            setFeatures([
                ...features,
                { type: selectedFeatureType, name: newFeature },
            ]);

            const updatedGeojsonData = {
                ...geojsonData,
                features: geojsonData.features.map((feature) => {
                    const newProperties = {
                        ...feature.properties,
                        [newFeature]: selectedFeatureType === 'string' ? '' : 0,
                    };

                    return {
                        ...feature,
                        properties: newProperties,
                    };
                }),
            };

            setGeojsonData(updatedGeojsonData);

            setSelectedFeatureType('string');
            setNewFeature('');
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
    const handleChoroplethSelect = (value) => {
        setFeatureForChoropleth(value);
    }
    const handleFeatureTypeChange = (event) => {
        setSelectedFeatureType(event.target.value);
    };
    const updateGeojsonData = (newData) => {
        setGeojsonData(newData);
    };
    const handleSave = (editedData) => {
        // Implement your logic to save the edited data, e.g., updating state or sending it to a server
        console.log('Saving edited data:', editedData);
        setGeojsonData(editedData);
        // setPanelOpen(false);
        // You can update your geojsonData state or perform other actions here
    };
    const panelClose = () => {
        setPanelOpen(false);
    }
    const handleDownload = () => {
        const geoJsonString = JSON.stringify(geojsonData, null, 2);
        const blob = new Blob([geoJsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = 'title.geojson';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    const handleFileUpload = (event) => {
        let file = null;
        if (event != null) {
            file = event.target.files[0];
        } else {
            file = file_created;
        }
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
    
                if (data.features && data.features.length > 0) {
                    const addedFeatures = [];
    
                    for (const feature of data.features) {
                        // Check if the "color" property exists in the feature
                        if (!feature.properties.hasOwnProperty("color")) {
                            // If not, add "color" with the value "gray"
                            feature.properties.color = "gray";
                        }
    
                        const featureProperties = Object.keys(feature.properties);
    
                        const newCommonProperties = addedFeatures.filter((f) =>
                            featureProperties.includes(f.name)
                        );
    
                        for (const property of featureProperties) {
                            const propertyType = typeof feature.properties[property];
    
                            const existingFeature = newCommonProperties.find((f) => f.name === property);
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
    // let inputButton= <input type="file" accept=".geojson" onChange={handleFileUpload} />;
    if (file_created != null && geojsonData === null) {
        // inputButton=null;
        handleFileUpload();
        console.log("should be null")
    }
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
                    {geojsonData && <ColorLayer geojsonData={geojsonData} colorProperty="color" />}
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
                {/* {inputButton} */}
                {/* <input type="file" accept=".geojson" onChange={handleFileUpload} /> */}

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
                                Category: Simple Regional Map
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
                    {features && features.length > 0 && <Button onClick={handlePanelOpen}>Data Edit</Button>}
                </Box>

                <Box sx={{ paddingY: 2 }} />
                <Card>
                    <CardContent>
                        <FormControl fullWidth size="small">
                            <InputLabel id="feature-type-label">Feature Type</InputLabel>
                            <Select
                                labelId="feature-type-label"
                                id="feature-type"
                                value={selectedFeatureType}
                                onChange={handleFeatureTypeChange}
                                label="feature type"
                                inputProps={{
                                    style: { height: '36px' },
                                }}
                            >
                                <MenuItem value="string">String</MenuItem>
                                <MenuItem value="number">Number</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            type="text"
                            fullWidth
                            label="Feature name:"
                            variant="outlined"
                            placeholder="Add a feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            size="small"
                            sx={{ height: '40px', marginBottom: '10px', marginTop: '10px' }}
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

                {/* <Autocomplete
                    value={featureForChoropleth}
                    onChange={(e, value) => handleChoroplethSelect(value)}
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
                /> */}
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
                        Render as Simple Region
                    </Button>
                    <Button variant="contained" sx={{
                        borderRadius: '10px',
                        backgroundColor: '#0844A4', // Replace with your desired color
                        color: 'white', // Text color
                        marginTop: '10px',
                        marginLeft: '10px'
                    }} onClick={handleDownload}>
                        download
                    </Button></Box>
            </Grid>
            <Grid item xs={12} sm={.5}></Grid>
            {panelOpen && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{ padding: '10px', border: '1px solid #ccc', marginTop: '20px', marginInline: '20px', marginBottom: '20px' }}>
                            <Typography variant="h5" style={{ marginBottom: '20px' }}>Data Edit Panel</Typography>
                            <DataEditPanel geojsonData={geojsonData} onSave={handleSave} features={features} panelClose={panelClose} />
                        </Paper>
                    </Grid>
                </Grid>
            )}</Grid>
    );
};

export default RegionalEdit;
