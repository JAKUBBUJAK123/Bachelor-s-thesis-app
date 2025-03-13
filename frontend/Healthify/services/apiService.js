import AsyncStorage from "@react-native-async-storage/async-storage";


BASE_URL='http://192.168.0.158:5000';

const getAuthToken = async () => {
    return await AsyncStorage.getItem("AuthToken");
};

//For screenD
export const fetchPersonalUserInfomations = async () => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/user`, {
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
export const getDailyProgress = async () => {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/api/weakly_summary`, {
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

    const response = await fetch(`${BASE_URL}/api/user`, {
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

//For screenC
export const handleSearchFood = async(query , results) => {
    try {
        const response = await fetch(`${BASE_URL}/api/search_food?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        results(data)
    } catch (error) {
        console.error("Error fetching food data:", error);
    }
    
}

//For screenC 
export const fetchMeals = async () => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("User not authicanted")
    }
    const response = await fetch(`${BASE_URL}/api/meals`, {
        method: 'GET',
        headers : {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data;
}



//For screenC
export const addMeals = async (meal) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("User not authicanted")
    }
    const response = await fetch(`${BASE_URL}/api/meals` , {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body : JSON.stringify(meal)
    });
    return response.json();
}

//For screenC
export const updateMeals = async (mealId , updatedData) => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("User not authicanted")};
    
    const response = await fetch(`${BASE_URL}/api/meals/${mealId}` , {
        method : 'PUT',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });
    return response.json();
}

//For loginScreen
export const fetchLogin = async (email , password) => {
    if (!email || ! password) {
            Alert.alert("Missing fields", 'Please enter your email and password')
            return;
            };
    const response = await fetch(`${BASE_URL}/api/login` , {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email,password}),
    });
    const result = await response.json();
    if (response.ok) {
        await AsyncStorage.setItem('AuthToken' , result.token)
        return result;
    }
    else{
        return;
    }
}

//For ScreenB
export const fetchWalkingData = async () => {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("User not authicanted")
    }
    const response = await fetch(`${BASE_URL}/api/walking`, {
        method: 'GET',
        headers : {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data;
}

