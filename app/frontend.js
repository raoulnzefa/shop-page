import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js';

let app = new Vue ({
    el: '#app',
    data() {
        return {
            login: '',
            password: '',
            message: '',
            header: 'Войти в аккаунт',
            permission: '',
            store: [], // delete
            loaded: false, // make false
            isGood: false,
            good: {},
            similar: [],
            tmp: undefined
        }
    },
    computed: {
        isStore() {
            return this.store === [] ? false : true;
        },
        isDenied() {
            return this.permission === 'denied' ? true : false;
        }
    },
    methods: {
        async logIn() {
            let login = this.login;
            let password = this.password;
            const info = {login, password}
            if(login && password && login.indexOf('@mail.ch')) {
                 let response = await serverLog('/api/login', 'POST', info);
                 response ? this.permission = response : this.permission = '';
            } else if(!login || !password) {
                this.permission = '';
                this.message = 'Заполните все поля';
            } else {
                this.permission = 'denied';
                this.message = 'Вы не можете войти с этим Email';
            }
        },
        pickGood(el) {
            this.isGood = true;
            this.good = this.store.filter(elem => elem.sku === el.sku);
            let arr = this.store.filter(elem => elem.sku !== el.sku);
            this.similar = arr.filter((elem, i) => i < 3);
        },
        exit() {
            this.login = '';
            this.password = '';
            this.message = '';
            this.header = 'Войти в аккаунт';
            this.permission = '';
            this.store = [];
            this.loaded = false;
            this.isGood = false;
            this.good = {};
            this.similar = [];

        },
        // reqS() {
        //     fetch('/image.png')
        //         .then(res => res.blob())
        //         .then(blob => {
        //             console.log(blob);
        //             this.tmp = new Blob([res.url], 'photo');
        //             console.log(this.tmp);
        //             // this.tmp = new Blob(res, 'photo');
        //         });
        //     // console.log(this.tmp);
        //
        // }
    },
    watch: {
         async permission() {
            if(this.permission !== '') {
                let arr = [];
                await fetch(this.permission)
                    .then(data => data.json())
                    .then(json => json.forEach(el => this.store.push(el)))
                    .then(this.loaded = true)
                    .then(this.header = 'Товары')
                    .catch(err => {
                        console.log(err, this.store);
                        this.loaded = false;
                        this.header = 'Войти в аккаунт'
                    })
            } else {
                this.loaded = false;
            }
        }
    }
});

async function serverLog(url, method, data = null) {
    try {
        let headers = {}
        let body

        if(data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn('Error:', e.message);
    }
}
