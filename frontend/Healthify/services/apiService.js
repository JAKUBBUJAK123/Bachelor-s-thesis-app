import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthToken = async () => {
    return await AsyncStorage.getItem("AuthToken");
};

//For screenD
export const fetchPersonalUserInfomations = async () => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch('http://192.168.0.227:5000/api/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;

}

//For screenD
export const updatePersonalUserInformations = async (updatedData) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch('http://192.168.0.227:5000/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        throw new Error("Failed to update user data");
    }

    const data = await response.json();
    return data;
};

//For screenD
export const handleLogout = async () => {
    await AsyncStorage.removeItem("AuthToken");
};