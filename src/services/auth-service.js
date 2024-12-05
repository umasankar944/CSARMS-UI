import axios from "axios";

const BASE_URL = 'http://localhost:5000'

export const userLogin = async (payload) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, payload)
        console.log(response.status)
        console.log(response.data.user.USERID)
        return response.data
    } catch (err) {
        console.error(err)
    }
}


export const userRegister = async (payload) => {
    console.log("inside post")
    try {
        const response = await axios.post(`${BASE_URL}/register`, payload)
        console.log(response)
        console.log(response.status)
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

export const sendToNotificationQueue = async (payload) => {
    try {
        const response = await axios.post(`${BASE_URL}/notification`, payload )
        return response.data
    } catch (err) {
        console.error(err)
    }
}