require('dotenv').config()
let openRentScraper = require('./scrapers/openRentScraper')
let axios = require('axios')


const api = axios.create({
    baseURL: process.env.API_URL
})

// define main function
let run = async () => {
    console.log('~~~~~~ Prepare for hunt ~~~~~~')

    // retrieve token
    let { data, status } = await api.post('/auth/login', {
        username: 'pat',
        password: 'Admin123!'
    })
    // validate login api call
    if (status != 200) {
        console.log('login failed')
        return
    }
    console.log('Logged in')
    // extract auth token 
    const { token: AUTH_TOKEN } = data
    // set api token
    api.defaults.headers.common['Authorization'] = 'Bearer ' + AUTH_TOKEN

    // fetch targets
    let { data: targets, status: targetsStatus} = await api.get('/target')
    // validate login api call
    if (targetsStatus != 200) {
        console.log('Failed to retrieve targets')
        return
    }
    console.log('Retrieved targets')

    console.log('~~~~~~ Hunt begins ~~~~~~')
    
    let results = []

    // loop through each target
    for (let target  of targets) {
        let listings = []

        // fetch and parse listings
        listings = await openRentScraper(target.url)
        // ENABLE ONCE SUPPORT FOR OTHER SITES IS AVAILABLE
        if (false) {
            // identify the scraper to use
            switch(target.site) {
                case 'openrent':
                    listings = await openRentScraper(target.url)
                    break;
                default:
                    // invalid site
                    console.log('Invalid target site:', target.site)
            }
        }

        // append results
        results = [...results, ...listings]
    }
    
    console.log('~~~~~~ Submitting results ~~~~~~')

    // submit data
    let { data: submitResult, status: submitStatus } = await api.post('/listing', {
        listings: results
    })
    // validate response
    if (submitStatus != 200) {
        console.log('Failed to submit results')
        console.log('Status:', submitStatus)
    } else {
        console.log('Results submitted: ', submitResult)
    }

    console.log('~~~~~~ Finished ~~~~~~')
}

(async () => {
    await run()
})();