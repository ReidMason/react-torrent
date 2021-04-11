import axios, { AxiosResponse } from 'axios';

class QbittorrentService {
    axios;
    setAuthenticated: Function;

    constructor(setAuthenticated: Function) {
        this.setAuthenticated = setAuthenticated;
        this.axios = axios.create({ baseURL: "api/v2" })
        this.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

        // Add inteceptor to invalidate authentication any time a 403 reponse is received
        this.axios.interceptors.response.use((response) => { return response; },
            (error) => {
                if (error.response.status === 403)
                    this.setAuthenticated(false);
                return error.response;
            })
    }

    validateAuthentication() {
        return new Promise<boolean>((resolve) => {
            // Send a test request to try and get the version
            this.getVersion().then((response) => {
                const isAuthenticated: boolean = response.status === 200;
                this.setAuthenticated(isAuthenticated);
                resolve(isAuthenticated);
            }).catch((error) => {
                this.setAuthenticated(false);
                resolve(false);
            })
        })
    }

    login(username: string, password: string) {
        const payload = new URLSearchParams({ username, password })
        return new Promise((resolve, reject) => {
            this.axios.post('/auth/login', payload).then((response: AxiosResponse) => {
                const loginSuccess = response.data === 'Ok.'
                this.setAuthenticated(loginSuccess);
                resolve(loginSuccess);

            }).catch((response) => {
                this.setAuthenticated(false);
                reject(response);
            });
        })
    }

    logout() {
        this.setAuthenticated(false);
        return this.axios.post('/auth/logout')
    }

    getVersion() {
        return this.axios.get('/app/version');
    }

    getTorrents() {
        this.axios.get('/torrents/info').then((response) => {
            console.log(response);
        })
    }
}

export default QbittorrentService;