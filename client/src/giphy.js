import axios from 'axios';

const API_ROOT = 'http://api.giphy.com/v1/gifs';
const API_KEY = 'NthlpWwXVvbH5IuKzzFxJ1btA29MSNlI';

const encode = encodeURIComponent;
const responseBody = res => res.body;

const giphy = {
    search: (query, off, done) => {
        let result;
        const offset = off ? off : 0;
        delete axios.defaults.headers.common.Authorization;
        axios.get( (API_ROOT +'/search?api_key='+ API_KEY + '&q=' + query + '&limit=19&offset=' + offset )).then( res => done(res.data));
    }

}

export default giphy;