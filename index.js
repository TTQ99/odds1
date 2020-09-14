const axios = require('axios')
const cheerio = require('cheerio')

function getMatch () {
  axios.get('https://www.iuliao.com/live?issue=2020-09-11').then(res => {
    const $ = cheerio.load(res.data)
    const match = $('.normal-table>tbody>tr')
    const arr = []
    match.each(function (i, elem) {
      const dom = cheerio.load(elem)
      arr.push({
        ht: dom('.home>a').text(),
        at: dom('.away>a').text(),
        id: dom('tr').attr('data-mid'),
        hs: dom('.score .home').text(),
        as: dom('.score .away').text(),
      })
    })
  })
}

async function getOddsData () {
  let res = await axios.get('https://www.iuliao.com/odds/match/1426272/europe')
  const $ = cheerio.load(res.data)
  console.log($('tr[data-cid=10000]').text())
}

getOddsData()