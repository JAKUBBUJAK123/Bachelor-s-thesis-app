import { useState } from "react";
import { useEffect } from "react";

const CLIENT_ID = '3c84ba2d72774ebe96d2bce5adda4314';
const CLIENT_SECRET = 'f429bc02cb724d419db4a0957455475a';

const TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';

export const fetchToken = async () => {
    const formBody = new URLSearchParams();
    formBody.append('grant_type', 'client_credentials');
    formBody.append('scope', 'basic');

    try {
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
            },
            body: formBody.toString(),
        });

        if (!response.ok) {
            throw new Error(`Token fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Token:", data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
    }
};

export const FetchFood = async (query) => {
    try {
        const token = await fetchToken();

        // Log the token to ensure it's not undefined or invalid
        console.log("Token used for fetching food data:", token);

        const response = await fetch(
            `https://platform.fatsecret.com/rest/server.api?method=foods.search&format=json&search_expression=${query}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Food data fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Food Data Response:", data);

        if (data.foods && data.foods.food) {
            const foodItems = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];
            return foodItems;
        } else {
            throw new Error("No food data found in response");
        }
    } catch (error) {
        console.error("Error fetching food data:", error);
        throw error;
    }
};
