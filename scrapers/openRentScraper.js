const puppeteer = require('puppeteer')


module.exports = async function (targetUrl) {
    // load page
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(targetUrl)
    
    // parse the listings from the page
    const listings = await page.evaluate(async () => {
        // get listings parent element
        let propertyData = document.getElementById('property-data')
        // get listing elements
        let children = propertyData.querySelectorAll('a.pli:not(.l-a)')

        // define base result
        let results = []

        // parse each listing to the results
        for (let c of Object.values(children)) {
            // get price (p/month)
            let price = c.querySelector('div.pim').innerText.split(' ')[0]
            price = parseInt(price.replace(/\D/g, ''))
            
            // get listing name
            let name = c.querySelector('span.listing-title').innerText
            
            // get internal reference
            let reference = c.id

            // get listing info
            let listingInfo = c.querySelector('ul.lic').children
            // get bed count
            let beds = parseInt(listingInfo[0].innerText.replace(/\D/g, ''))
            // get bath count
            let baths = parseInt(listingInfo[1].innerText.replace(/\D/g, ''))
            // get cover image
            let imgElement = c.querySelector('img.propertyPic') 
            let image = imgElement.dataset.src || imgElement.src
            if (imgElement.dataset.src) {
                image = "https:" + image
            }

            // return listing info
            results.push({
                name,
                price,
                reference,
                beds,
                baths,
                image,
                link: c.href
            })
        }

        // return parsed listings
        return results
    })
    
    // close the browser
    await browser.close();

    // return listings
    return listings
}