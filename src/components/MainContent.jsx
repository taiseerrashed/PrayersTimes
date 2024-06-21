import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Prayer from "./Prayer";
import Select from '@mui/material/Select';
import { Box, FormControl, InputLabel, MenuItem } from "@mui/material";
import axios from "axios";
import { useTheme } from "../ThemeContext";
import moment from "moment";
import "moment/locale/ar";
moment.locale("ar");

const MainContent = () => {
    const { theme } = useTheme();

    // STATES
    const [timings, setTimings] = useState({
        "Fajr": "04:07",
        "Dhuhr": "12:55",
        "Asr": "16:30",
        "Maghrib": "19:57",
        "Isha": "21:30",
    });
    const [selectedCity, setSelectedCity] = useState({
        displayName: "الزقازيق",
        apiName: "Zagazig"
    });
    const [today, setToday] = useState("");
    const [nextPrayerIndex, setNextPrayerIndex] = useState(1);
    const [remainingTime, setRemainingTime] = useState("");

    const availableCities = [
        { displayName: "الزقازيق", apiName: "Zagazig" },
        { displayName: "المنصورة", apiName: "Mansoura" },
        { displayName: "أسيوط", apiName: "Asyut" },
        { displayName: "قنا", apiName: "Qena" }
    ];
    const prayersArray = [
        {key: "Fajr", displayName: "الفجر"},
        {key: "Dhuhr", displayName: "الظهر"},
        {key: "Asr", displayName: "العصر"},
        {key: "Maghrib", displayName: "المغرب"},
        {key: "Isha", displayName: "العشاء"},
    ];

    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`);
        setTimings(response.data.data.timings);
    }

    useEffect(() => {
        getTimings();
    }, [selectedCity]);

    useEffect(() => {
        let interval = setInterval(() => {
            // console.log("calling timer");
            setupCountdownTimer();
        }, 1000);

        const t = moment();
        setToday(t.format("Do MMMM YYYY | h:mm"));

        return () => {
            clearInterval(interval);
        }
    }, [timings]);

    const setupCountdownTimer = () => {
        const momentNow = moment();
        let prayerIndex = 2;

        if(momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
            prayerIndex = 1;
        } else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
            prayerIndex = 2;
        } else if (momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))) {
            prayerIndex = 3;
        } else if (momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) && momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
            prayerIndex = 4;
        } else {
            prayerIndex = 0;
        }

        setNextPrayerIndex(prayerIndex);

        // now after knowing what is the next prayer, we can setup the countdown timer by getting the prayer's time
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        // console.log("next prayer time is ", nextPrayerTime);
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
        // console.log(remainingTime);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            // console.log("midnight is ", midnightDiff);
            const fajrToMidnight = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss"));
            // console.log("the diff ", fajrToMidnight);

            const totalDifference = midnightDiff + fajrToMidnight;

            remainingTime = totalDifference;
        }

        const durationRemainingTime = moment.duration(remainingTime);
        // console.log("duration is", durationRemainingTime.hours(), durationRemainingTime.minutes(), durationRemainingTime.seconds());
        setRemainingTime(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`);
    };

    const handleCityChange = (event) => {
        // console.log("the new value is ", event.target.value);
        const cityObject = availableCities.find((city) => city.apiName === event.target.value);
        setSelectedCity(cityObject);
    };

  return (
    <>
        {/* Top Row */}
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Box>
                    <h2>{today}</h2>
                    <h1>{selectedCity.displayName}</h1>
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box>
                    <h2>
                        متبقي حتى صلاة {" "}
                        {prayersArray[nextPrayerIndex].displayName}
                    </h2>
                    <h1>{remainingTime}</h1>
                </Box>
            </Grid>
        </Grid>
        {/*== Top Row ==*/}

        <Divider sx={{borderColor: "white", opacity: "0.1", my: 2 }} />

        {/* Prayers Cards */}
        <Grid container spacing={2} justifyContent="center">
            {prayersArray.map((prayer) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={prayer.key}>
                    <Prayer
                        name={prayer.displayName}
                        time={timings[prayer.key]}
                        image={`../../images/card-${prayersArray.indexOf(prayer) + 1}.jpeg`}
                    />
                </Grid>
            ))}
        </Grid>
        {/*== Prayers Cards ==*/}

        {/* Select City */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <FormControl sx={{ width: { xs: "80%", sm: "50%", md: "20%" } }}>
                <InputLabel id="demo-simple-select-label"><span style={{color: theme === "dark" ? "white" : "black"}}>المدينة</span></InputLabel>
                <Select
                  sx={{color: theme === "dark" ? "white" : "black", marginBottom: "30px"}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCity.apiName}
                  label="المدينة"
                  onChange={handleCityChange}
                >
                    {availableCities.map((city) => {
                        return(
                            <MenuItem key={city.apiName} value={city.apiName}>{city.displayName}</MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
        {/*== Select City ==*/}
    </>
  );
};

export default MainContent;
