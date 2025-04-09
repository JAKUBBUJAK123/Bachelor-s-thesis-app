import React from "react";
import { TouchableOpacity, StyleSheet , Text} from "react-native";
import { useTheme } from "../services/ThemeContext";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ToggleTheme() {
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.cardBackground }]}
            onPress={toggleTheme}
        >
           
            <Icon
                name={theme.text === "#000000" ? "sun-o" : "moon-o"}
                size={24}
                color={theme.text}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    themeToggle: {
        padding: 10,
        borderRadius: 50,
        alignSelf: "center",
        marginVertical: 10,
    },
});