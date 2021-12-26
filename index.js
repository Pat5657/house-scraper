let openRentScraper = require('./scrapers/openRentScraper')

// Define scrape targets
const targets = [
    {
        site: 'openrent',
        url: 'https://www.openrent.co.uk/properties-to-rent/wembley-greater-london?term=Wembley,%20Greater%20London&prices_max=2700&bedrooms_min=3&bedrooms_max=4&hasParking=true'
    }
]

// define main function
let run = async () => {
    console.log('~~~~~~ Hunt begins ~~~~~~')
    
    let results = []

    // loop through each target
    for (let target  of targets) {
        let listings = []

        // identify the scraper to use
        switch(target.site) {
            case 'openrent':
                listings = await openRentScraper(target.url)
                break;
            default:
                // invalid site
                console.log('Invalid target site:', target.site)
        }

        // append results
        results.push({
            site: target.site,
            listings
        })
    }
    
    console.log('Findings', results)

    console.log('~~~~~~ Finished ~~~~~~')
}

(async () => {
    await run()
})();