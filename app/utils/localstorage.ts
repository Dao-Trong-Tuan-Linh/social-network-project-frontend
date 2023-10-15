
export const setToken = (token:string)  => {
    localStorage.setItem("token",token)
}

export const getToken = () => {
    return localStorage.getItem("token") || ''
}

export const removeToken = () => {
    localStorage.removeItem("token")
}

export const setUser = (user:string)  => {
    localStorage.setItem("user",user)
}

export const getUser = () => {
    return localStorage.getItem("user") || ''
}

export const removeUser = () => {
    localStorage.removeItem("user")
}

