import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator , StyleSheet} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { getDailyProgress } from "../services/apiService";

export default function WeeklyDataChart() {

    const screenWidth = Dimensions.get("window").width;

    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
                const data = await getDailyProgress();
                setWeeklyData(data);
                setLoading(false);
        };
        fetchProgress();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#4287f5" />
    };

    if (weeklyData.length === 0) {
        return <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>No data available</Text>;
    };
    const labels = weeklyData.map((entry) => entry.date.substring(5) || 'N/A');
    const stepsData = weeklyData.map((entry) => entry.steps ||0);
    const burnedCalories = weeklyData.map((entry) => entry.burned_kcal || 0);
    const intakeCalories = weeklyData.map((entry) => entry.calories_intake || 0);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Weekly Progress</Text>

            <Text style={styles.chartTitle}>Steps Over the Week</Text>
            <ScrollView horizontal={true} style={{ marginBottom: 20 }}>
            <LineChart
                data={{ labels, datasets: [{ data: stepsData}] }}
                width={screenWidth}
                height={220}
                chartConfig={{
                    ...chartConfig,
                    fillShadowGradient: "#2b2bd6",
                    fillShadowGradientOpacity: 1,
                }}
                style={styles.chartStyle}
                
            />
            </ScrollView>

            <Text style={styles.chartTitle}>Calories Intake</Text>
            <ScrollView horizontal={true} style={{ marginBottom: 20 }}>
    <BarChart
        data={{
            labels: labels,
            datasets: [
                { data: intakeCalories},
            ],
        }}
        width={screenWidth}
        height={220}
        yAxisLabel="kcal "
        chartConfig={{
            ...chartConfig,
            fillShadowGradient: "#1cd434",
            fillShadowGradientOpacity: 1,
        }}
        style={styles.chartStyle}
        showBarTops={false}
        fromZero
        
    />
</ScrollView>
    <Text style={styles.chartTitle}>Burned Calories</Text>
<ScrollView horizontal={true} style={{ marginBottom: 20 }}>
    <BarChart
        data={{
            labels: labels,
            datasets: [
                { data: burnedCalories },
            ],
        }}
        width={screenWidth}
        height={220}
        yAxisLabel="kcal "
        chartConfig={{
            ...chartConfig,
            fillShadowGradient: "#d6551e",
            fillShadowGradientOpacity: 1,
        }}
        style={styles.chartStyle}
        showBarTops={false}
        fromZero
    />
</ScrollView>

        </ScrollView>
    );


    
}

const chartConfig = {
    backgroundGradientFrom: "#3A3736",
    backgroundGradientTo: "#262322",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#3A3736',
        borderRadius: 10,
        margin: -10
    },
    title: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#fff",
    },
    chartTitle: {
        textAlign: "center",
        fontSize: 16,
        marginVertical: 5,
        color: "#fff",
    },
    chartStyle: {
        marginVertical: 8,
        borderRadius: 10,
        alignSelf: "center",
    },
    noDataText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#fff",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});