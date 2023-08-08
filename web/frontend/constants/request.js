import axios from 'axios'

class RequestCustom {
    instance
    constructor(sessionToken) {
        const instance = axios.create({
            baseURL: "",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })

        instance.interceptors.request.use(
            async config => {
                const accessToken = typeof window !== "undefined" && localStorage.getItem('accessToken')
                if (accessToken) {
                    config.headers['x-access-token'] = accessToken
                }

                return config
            },
            error => {
                Promise.reject(error)
            }
        )

        this.instance = instance
    }

    get = (url, params) => {
        return this.instance.get(url, { params })
    }

    post = (url, data) => {
        return this.instance.post(url, data)
    }

    put = (url, data) => {
        return this.instance.put(url, data)
    }

    patch = (url, data) => {
        return this.instance.patch(url, data)
    }

    delete = (url) => {
        return this.instance.delete(url)
    }
}

export default RequestCustom