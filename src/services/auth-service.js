import axios from "axios";

const BASE_URL = 'http://localhost:5000/'

export const userLogin = async (payload) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, payload)
        return response.data
    } catch (err) {
        console.error(err)
    }
}


export const userRegister = async (payload) => {
    console.log("inside post")
    try {
        const response = await axios.post(`${BASE_URL}/register`, payload)
        return response.data
    } catch (err) {
        console.error(err)
    }
}


export const getUserDetails = async (payload) => {
    try {
        const response = await axios.get(`${BASE_URL}/details`, { headers: payload })
        return response.data
    } catch (err) {
        console.error(err)
    }
}