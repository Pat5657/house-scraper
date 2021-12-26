const puppeteer = require('puppeteer')


module.exports = async function (targetUrl) {
    // load page
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(targetUrl)
    
    // parse the listings from the page
    const listings = await page.evaluate(() => {
        // get listings parent element
        let propertyData = document.getElementById('property-data')
        // get listing elements
        let children = propertyData.querySelectorAll('a.pli:not(.l-a)')

        // define base result
        let results = []

        // parse each listing to the results
        results = Object.values(children).map(c => {
            // get price (p/month)
            let price = c.querySelector('div.pim').innerText.split(' ')[0]
            // get listing name
            let name = c.querySelector('span.listing-title').innerText

            // return listing info
            return {
                name,
                price,
                link: c.href
            }
        })

        // return parsed listings
        return results
    })
    
    // close the browser
    await browser.close();

    // return listings
    return listings
}